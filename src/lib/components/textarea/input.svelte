<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	let {
		class: className,
		value = $bindable(),
		...restProps
	}: Omit<HTMLTextareaAttributes, "children"> = $props();
</script>

<textarea
	bind:value
	data-slot="textarea"
	class={cn("tw-textarea", className)}
	{...restProps}
></textarea>
