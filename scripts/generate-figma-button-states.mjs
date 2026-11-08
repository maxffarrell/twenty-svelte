import fs from 'node:fs';

const audit = JSON.parse(fs.readFileSync(new URL('../docs/figma-resolved-button-audit.json', import.meta.url)));
const color = (paint) => {
  if (!paint) return 'transparent';
  const [hex, alpha] = paint.split('/');
  if (Number(alpha) === 1) return hex;
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${rgb.join(' ')} / ${Number(alpha) * 100}%)`;
};
const themed = (light, dark) => light === dark ? color(light) : `light-dark(${color(light)}, ${color(dark)})`;
const order = { default: 0, hover: 1, focused: 2, pressed: 3, disabled: 4 };
const pseudo = { hover: ':hover:not(:disabled)', pressed: ':active:not(:disabled)', focused: ':focus-visible:not(:disabled)', disabled: ':disabled' };
let css = '/* Generated from docs/figma-resolved-button-audit.json. Both source palette modes. */\n@layer components {\n';
// Native states can overlap. Focus wins over hover; pressing wins over focus.
for (const button of audit.buttons.toSorted((a, b) => order[a.key.split(', ')[3]] - order[b.key.split(', ')[3]])) {
  const [variant, accent, size, state, inverted] = button.key.split(', ');
  const selector = `.tw-button[data-variant="${variant}"][data-accent="${accent}"][data-control-size="${size.startsWith('24') ? 'sm' : 'md'}"][data-inverted="${inverted}"]`;
  const selectors = state === 'default' ? selector : `${selector}${pseudo[state]},\n${selector}[data-preview-state="${state}"]`;
  const { light, dark } = button.colors;
  const shadows = [];
  if (light.stroke.value || dark.stroke.value) shadows.push(`inset 0 0 0 1px ${themed(light.stroke.value, dark.stroke.value)}`);
  for (let index = 0; index < light.effects.length; index++) {
    const effect = light.effects[index];
    if (effect.type !== 'INNER_SHADOW' || effect.radius !== 0 || effect.offset.x !== 0 || effect.offset.y !== 0) throw new Error(`Unsupported effect: ${button.nodeId}`);
    // Figma's 2px inner shadow begins inside the 1px stroke.
    shadows.push(`inset 0 0 0 ${effect.spread + 1}px ${themed(effect.value, dark.effects[index].value)}`);
  }
  const hover = button.interactions.find(interaction => interaction.trigger === 'ON_HOVER')?.actions[0];
  css += `  /* ${button.nodeId}: ${button.key} */\n  ${selectors} {\n    background-color: ${themed(light.fill.value, dark.fill.value)};\n    color: ${themed(light.text.value, dark.text.value)};\n    box-shadow: ${shadows.length ? shadows.join(', ') : 'none'};\n    opacity: ${button.opacity};\n    --tw-shortcut-color: ${themed(light.shortcut.value, dark.shortcut.value)};\n    --tw-separator-color: ${themed(light.separator.value, dark.separator.value)};\n${hover ? `    --tw-hover-duration: ${hover.durationMs}ms;\n` : ''}  }\n`;
}
css += '}\n';
const target = new URL('../src/lib/figma-button-states.css', import.meta.url);
const changed = !fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== css;
fs.writeFileSync(target, css);
console.log(`${audit.buttons.length * 2} resolved Figma states; ${changed ? 'updated stylesheet' : 'stylesheet already matches'}.`);
