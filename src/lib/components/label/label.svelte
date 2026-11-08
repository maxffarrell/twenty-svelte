<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComponentProps<typeof LabelPrimitive.Root> = $props();
</script>

<LabelPrimitive.Root
	data-slot="label"
	class={cn("tw-label", className)}
	bind:ref
	{...restProps}
>
	<span class="tw-label-text">{@render children?.()}</span>
</LabelPrimitive.Root>
