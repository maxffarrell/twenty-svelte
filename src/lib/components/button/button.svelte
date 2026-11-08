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
	import searchIcon from "$lib/assets/figma/search.svg";
	import chevronIcon from "$lib/assets/figma/chevron-down.svg";

	let {
		ref = $bindable(null),
		variant = "primary",
		accent,
		size,
		type = "button",
		child,
		leadingIcon,
		trailingIcon,
		showLeadingIcon = true,
		showTrailingIcon = false,
		showShortcut = false,
		shortcut = "⌘O",
		inverted = false,
		children,
		class: className,
		...restProps
	}: HTMLButtonAttributes &
		VariantProps<typeof buttonVariants> & {
			child?: Snippet<[{ props: Record<string, unknown> }]>;
			leadingIcon?: Snippet;
			trailingIcon?: Snippet;
			showLeadingIcon?: boolean;
			showTrailingIcon?: boolean;
			showShortcut?: boolean;
			shortcut?: string;
			inverted?: boolean;
			ref?: HTMLElement | null;
		} = $props();

	const mergedProps = $derived({
		...restProps,
		type,
		class: cn(buttonVariants({ variant, size, accent: accent ?? (variant === "destructive" ? "danger" : "default") }), className),
		"data-slot": "button",
		"data-variant": variant === "secondary" || variant === "outline" ? "secondary" : variant === "tertiary" || variant === "ghost" || variant === "link" ? "tertiary" : "primary",
		"data-accent": accent ?? (variant === "destructive" ? "danger" : "default"),
		"data-inverted": String(inverted),
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={ref}>
		{#if showLeadingIcon}
			{#if leadingIcon}{@render leadingIcon()}{:else}<span class="tw-figma-icon tw-button-icon" style:mask-image={`url("${searchIcon}")`} aria-hidden="true"></span>{/if}
		{/if}
		{#if children}<span class="tw-button-label">{@render children()}</span>{/if}
		{#if showShortcut}<span class="tw-button-separator" aria-hidden="true"></span><span class="tw-button-shortcut">{shortcut}</span>{/if}
		{#if showTrailingIcon}
			{#if trailingIcon}{@render trailingIcon()}{:else}<span class="tw-figma-icon tw-button-icon" style:mask-image={`url("${chevronIcon}")`} aria-hidden="true"></span>{/if}
		{/if}
	</button>
{/if}
