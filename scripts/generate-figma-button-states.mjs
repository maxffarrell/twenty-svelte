import fs from 'node:fs';

const audit = JSON.parse(fs.readFileSync(new URL('../docs/figma-button-audit.json', import.meta.url)));
const color = (paint) => {
  if (!paint) return 'transparent';
  const [hex, alpha] = paint.split('/');
  if (Number(alpha) === 1) return hex;
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${rgb.join(' ')} / ${Number(alpha) * 100}%)`;
};

let css = '/* Generated from the connector audit in docs/figma-button-audit.json. Light Figma mode. */\n@layer components {\n';
// Small and Medium have identical paints; the base component supplies the height.
for (const [id, name, fill, stroke, text, opacity, effects] of audit.rows.filter((r) => r[1].includes('32px'))) {
  const [variant, accent, , state, inverted] = name.split(', ');
  const selector = `.light .tw-button[data-variant="${variant}"][data-accent="${accent}"][data-inverted="${inverted}"]`;
  const pseudo = { hover: ':hover:not(:disabled)', pressed: ':active:not(:disabled)', focused: ':focus-visible:not(:disabled)', disabled: ':disabled' };
  if (state !== 'default' && !pseudo[state]) throw new Error(`Unknown Figma state: ${state}`);
  const selectors = state === 'default' ? selector : `${selector}${pseudo[state]},\n${selector}[data-preview-state="${state}"]`;
  // Some variants rename the text node. These role colors are confirmed by their design-context responses.
  const accentText = accent === 'blue' ? '#3e63dd' : accent === 'danger' ? '#e5484d' : '#666666';
  const fallback = inverted === 'true' ? (variant === 'primary' ? accentText : '#ffffff') : (variant === 'primary' && accent === 'danger' ? '#ffe5e5' : accentText);
  const shadows = [];
  if (stroke) shadows.push(`inset 0 0 0 1px ${color(stroke)}`);
  if (effects.length) shadows.push('inset 0 0 0 3px #ffffff');
  css += `  /* ${id}: ${name} */\n  ${selectors} {\n    background-color: ${color(fill)};\n    color: ${text ? color(text) : fallback};\n    box-shadow: ${shadows.length ? shadows.join(', ') : 'none'};\n    opacity: ${Math.round(opacity * 100) / 100};\n  }\n`;
}
css += '}\n';
const target = new URL('../src/lib/figma-button-states.css', import.meta.url);
const changed = !fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== css;
fs.writeFileSync(target, css);
console.log(`${audit.rows.length} Figma variants; ${changed ? 'updated stylesheet' : 'stylesheet already matches'}.`);
