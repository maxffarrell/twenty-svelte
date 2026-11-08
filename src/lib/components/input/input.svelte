<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLInputAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import bellIcon from "$lib/assets/figma/bell.svg";

	let { class: className, value = $bindable(), controlSize = "md", showPrefix = true, prefix, ...restProps }: HTMLInputAttributes & { controlSize?: "sm" | "md"; showPrefix?: boolean; prefix?: Snippet } = $props();
</script>

<span class="tw-input-shell" data-control-size={controlSize} data-invalid={String(restProps['aria-invalid'] === true || restProps['aria-invalid'] === 'true')}>
{#if showPrefix}
	<span class="tw-input-prefix" aria-hidden="true">{#if prefix}{@render prefix()}{:else}<span class="tw-figma-icon tw-input-icon" style:mask-image={`url("${bellIcon}")`}></span>{/if}</span>
{/if}
<input
	bind:value
	data-slot="input"
	data-control-size={controlSize}
	class={cn("tw-input", className)}
	{...restProps}
/>
</span>
