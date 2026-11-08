<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import trashIcon from "$lib/assets/figma/trash.svg";

	let { class: className, children, type = "button", ...restProps }: HTMLButtonAttributes = $props();
</script>

<button
	{type}
	data-slot="card-action"
	class={cn("tw-card-action", className)}
	{...restProps}
>
	{#if children}{@render children()}{:else}<img src={trashIcon} alt="" width="16" height="16" />{/if}
</button>
