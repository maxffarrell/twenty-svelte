<script lang="ts">
 import { onDestroy } from 'svelte';
 import { Button } from '$lib';
 let phase = $state<'hover' | 'pressed'>('hover');
 let measurement = $state('Play the source transition to measure its elapsed time.');
 let timer: ReturnType<typeof setTimeout> | undefined;
 function play() {
  clearTimeout(timer);
  phase = 'pressed';
  timer = setTimeout(() => { phase = 'hover'; timer = undefined; }, 220);
 }
 function measure(event: TransitionEvent) {
  if (event.propertyName === 'background-color') measurement = `Measured ${event.propertyName}: ${Math.round(event.elapsedTime * 1000)}ms.`;
 }
 onDestroy(() => clearTimeout(timer));
</script>
<div class="motion-preview">
 <Button accent="blue" tabindex={-1} data-preview-state={phase} data-motion-preview="true" aria-label="Motion specimen" ontransitionend={measure}>Filter</Button>
 <Button variant="secondary" showLeadingIcon={false} onclick={play}>Play press and release</Button>
 <p role="status">{measurement}</p>
 <p>Source: 100ms · cubic-bezier(0, 0, 0.58, 1). System reduced-motion preference is respected.</p>
</div>
<style>
 .motion-preview { display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin:20px 0 24px; }
 p { font:400 12px/1.5 Inter,sans-serif; margin:0; }
 p:last-child { flex-basis:100%; }
</style>
