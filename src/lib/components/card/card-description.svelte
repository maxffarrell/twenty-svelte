<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<div
	data-slot="card-description"
	class={cn("tw-card-description", className)}
	{...restProps}
>
	{@render children?.()}
</div>
