<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	let { class: className, children, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	data-slot="card-header"
	class={cn(
		"tw-card-header",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
