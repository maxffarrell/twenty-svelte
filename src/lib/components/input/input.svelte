<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLInputAttributes } from "svelte/elements";

	let { class: className, value = $bindable(), controlSize = "md", ...restProps }: HTMLInputAttributes & { controlSize?: "sm" | "md" } = $props();
</script>

<input
	bind:value
	data-slot="input"
	data-control-size={controlSize}
	class={cn("tw-input", className)}
	{...restProps}
/>
