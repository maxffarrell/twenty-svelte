<script lang="ts">
 import { Button } from '$lib';
 import type { Snippet } from 'svelte';
 let { href, children, variant = 'tertiary' }: { href: string; children: Snippet; variant?: 'primary' | 'secondary' | 'tertiary' } = $props();
</script>
<Button {variant} showLeadingIcon={false}>
 {#snippet child({ props })}<a {...props} {href} type={undefined}><span class="tw-button-label">{@render children()}</span></a>{/snippet}
</Button>
