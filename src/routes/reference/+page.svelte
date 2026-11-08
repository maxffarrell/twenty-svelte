<script lang="ts">
  import { Button, Input, Label, Textarea, Card } from '$lib';
  import MotionPreview from '../../demo/MotionPreview.svelte';
  const variants = ['primary', 'secondary', 'tertiary'] as const;
  const accents = ['default', 'blue', 'danger'] as const;
  const sizes = ['sm', 'md'] as const;
  const inversions = [false, true];
  const states = ['default', 'hover', 'pressed', 'focused', 'disabled'] as const;
  let removed = $state(false);
  let dark = $state(false);
  let extras = $state(false);
  let lastInteraction = $state('Hover, hold a button, or use Tab and Space.');
</script>

<svelte:head><title>Twenty — Figma reference specimens</title></svelte:head>
<div class={['reference-page', { light: !dark, dark }]}>
  <header><a href="/">← Component demo</a><h1>Figma reference specimens</h1><p>Source-sized controls from the Twenty copy, resolved in both palette modes.</p><div class="reference-actions"><Button size="sm" variant="secondary" showLeadingIcon={false} onclick={() => dark = !dark}>{dark ? 'Show light references' : 'Show dark references'}</Button><Button size="sm" variant="secondary" showLeadingIcon={false} onclick={() => extras = !extras}>{extras ? 'Hide optional slots' : 'Show optional slots'}</Button></div></header>
  <section aria-label="Reference controls">
    <article><h2>Button · 925:30301</h2><div data-fixture="button"><Button>Filter</Button></div></article>
    <article><h2>Input · 111579:648163</h2><div class="reference-field" data-fixture="input"><Input aria-label="Reference name" value="Tim" /></div></article>
    <article><h2>Text input · default</h2><div class="reference-field" data-fixture="field"><Label for="reference-name">First Name</Label><Input id="reference-name" value="Tim" /><span class="reference-hint">This is a hint text to help user.</span></div></article>
    <article><h2>Textarea · 93731:320137</h2><div class="reference-field" data-fixture="textarea"><Label for="reference-note">title</Label><Textarea id="reference-note" placeholder="eddy@apple.com, katherine@apple.com, craig@apple.com" /><span class="reference-hint">This is a hint text to help user.</span></div></article>
    <article><h2>Small Card · 9214:89505</h2><div data-fixture="card"><Card.Root><Card.Avatar letter="T" /><Card.Header><Card.Title>Thomas Kurian</Card.Title><Card.Description>Add a job title</Card.Description></Card.Header><Card.Action aria-label="Remove reference contact" onclick={() => removed = true} /></Card.Root></div><p role="status">{removed ? 'Remove requested locally.' : ''}</p></article>
  </section>
  <section aria-label="Live interaction checks" class="live-checks">
    <h2>Live interactions · native hover, hold, focus, and keyboard activation</h2>
    <MotionPreview />
    <div class="live-buttons">
      {#each variants as variant (variant)}{#each accents as accent (accent)}
        <Button {variant} {accent} aria-label={`Try ${variant} ${accent}`} onclick={() => lastInteraction = `Activated ${variant} / ${accent}.`}>Filter</Button>
      {/each}{/each}
      <Button size="sm" variant="tertiary" accent="blue" aria-label="Try small tertiary blue" onclick={() => lastInteraction = 'Activated small tertiary / blue.'}>Filter</Button>
      <Button accent="blue" showShortcut showTrailingIcon aria-label="Try shortcut and trailing icon" onclick={() => lastInteraction = 'Activated shortcut example.'}>Filter</Button>
      <Button disabled aria-label="Disabled interaction check">Disabled</Button>
      <Card.Action disabled aria-label="Disabled card action" />
    </div>
    <p role="status">{lastInteraction}</p>
    <div class="live-fields">
      {#each sizes as size (size)}
        <div class="reference-field"><Label for={`disabled-${size}`}>Disabled input · {size}</Label><Input id={`disabled-${size}`} controlSize={size} value="Tim" disabled /></div>
      {/each}
      <div class="reference-field"><Label for="live-input">Input · focus and select text</Label><Input id="live-input" value="Tim" /></div>
      <div class="reference-field"><Label for="live-danger">Input · danger</Label><Input id="live-danger" value="Tim" aria-invalid="true" aria-describedby="danger-hint" /><span id="danger-hint" class="reference-hint error-hint">This is a hint text to help user.</span></div>
      <div class="reference-field"><Label for="live-textarea">Textarea · focus and select text</Label><Textarea id="live-textarea" value="Enter some copy" /></div>
      <div class="reference-field"><Label for="disabled-textarea">Textarea · disabled</Label><Textarea id="disabled-textarea" value="Enter some copy" disabled /></div>
      <div class="reference-field"><Label for="danger-textarea">Textarea · error</Label><Textarea id="danger-textarea" value="Enter some copy" aria-invalid="true" /></div>
    </div>
  </section>
  <section aria-label="Button state references" class="reference-matrix">
    <h2>Button state references · both sizes and inversions</h2>
    {#each sizes as size (size)}{#each inversions as inverted (inverted)}
    {#each variants as variant (variant)}
      {#each accents as accent (accent)}
        <article class={['reference-state-row', { inverted }]} data-accent={accent}><h3>{variant} / {accent} / {size}{inverted ? " / inverted" : ""}</h3>{#each states as state (state)}<div class="reference-state"><span>{state}</span><Button {variant} {accent} {size} {inverted} showShortcut={extras} showTrailingIcon={extras} tabindex={-1} disabled={state === 'disabled'} data-preview-state={state} data-reference-key={`${variant}/${accent}/${size}/${inverted}/${state}`}>Filter</Button></div>{/each}</article>
      {/each}
    {/each}
    {/each}{/each}
  </section>
</div>

<style>
  .reference-page { min-height:100vh; background:light-dark(#fff,#171717); color:light-dark(#333,#ebebeb); padding:24px; font-family:Inter, sans-serif; }
  header { min-height:132px; margin-bottom:32px; }
  h1 { font-size:24px; margin:16px 0 8px; line-height:1.2; letter-spacing:0; }
  h2,h3 { font:500 12px/17px Inter,sans-serif; margin:0 0 12px; }
  p,a { font-size:12px; }
  section { display:flex; flex-wrap:wrap; align-items:flex-start; gap:32px; }
  article { flex:none; }
  section[aria-label='Reference controls'] { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(350px,100%),350px)); grid-auto-rows:160px; }
  .reference-field { width:200px; display:flex; flex-direction:column; gap:4px; }
  .reference-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
  .reference-hint { color:light-dark(#b3b3b3,#666); font:400 12px/1.4 Inter,sans-serif; text-box-trim:trim-both; text-box-edge:cap alphabetic; }
  .error-hint { color:#e5484d; }
  .live-checks { display:block; margin-top:32px; padding-top:24px; border-top:1px solid light-dark(#ebebeb,#222); }
  .live-buttons { display:flex; flex-wrap:wrap; gap:16px; align-items:center; }
  .live-fields { display:flex; flex-wrap:wrap; gap:24px; margin-top:24px; }
  .reference-matrix { margin-top:48px; display:flex; flex-direction:column; gap:16px; }
  .reference-state-row { display:flex; align-items:center; flex-wrap:wrap; gap:24px; }
  .reference-state-row h3 { width:120px; margin:0; }
  .reference-state { display:flex; flex-direction:column; align-items:flex-start; gap:8px; }
  .reference-state > span { font-size:10px; color:light-dark(#999,#818181); }
  .reference-state-row.inverted { padding:12px; background:#666; color:white; }
  .reference-state-row.inverted[data-accent="blue"] { background:#3e63dd; }
  .reference-state-row.inverted[data-accent="danger"] { background:#e5484d; }
  .reference-state-row.inverted .reference-state > span { color:white; }
  .reference-state :global(button) { pointer-events:none; }
</style>
