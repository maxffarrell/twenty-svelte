<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const buttonVariants = tv({
        base: "tw-button",
        variants: {
            variant: {
                primary: "tw-button--primary",
                secondary: "tw-button--secondary",
                tertiary: "tw-button--tertiary",
                // Compatibility aliases for the initial shadcn API.
                default: "tw-button--primary",
                destructive: "tw-button--primary",
                outline: "tw-button--secondary",
                ghost: "tw-button--tertiary",
                link: "tw-button--tertiary tw-button--link",
            },
            accent: { default: "", blue: "tw-button--blue", danger: "tw-button--danger" },
            size: {
                default: "", md: "", sm: "tw-button--sm",
                // Twenty has two button sizes; legacy lg now maps to medium.
                lg: "", icon: "tw-button--icon", "icon-sm": "tw-button--icon-sm",
            },
        },
        compoundVariants: [{ variant: "destructive", accent: "default", class: "tw-button--danger" }],
        defaultVariants: { variant: "primary", size: "default", accent: "default" },
    });
</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		variant = "primary",
		accent,
		size,
		type = "button",
		child,
		leadingIcon,
		trailingIcon,
		children,
		class: className,
		...restProps
	}: HTMLButtonAttributes &
		VariantProps<typeof buttonVariants> & {
			child?: Snippet<[{ props: Record<string, unknown> }]>;
			leadingIcon?: Snippet;
			trailingIcon?: Snippet;
			ref?: HTMLElement | null;
		} = $props();

	const mergedProps = $derived({
		...restProps,
		type,
		class: cn(buttonVariants({ variant, size, accent: accent ?? (variant === "destructive" ? "danger" : "default") }), className),
		"data-slot": "button",
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={ref}>
		{@render leadingIcon?.()}
		{#if children}<span class="tw-button-label">{@render children()}</span>{/if}
		{@render trailingIcon?.()}
	</button>
{/if}
