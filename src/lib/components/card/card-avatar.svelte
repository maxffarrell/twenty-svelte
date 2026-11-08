<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  let { letter = "L", class: className, ...restProps }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { letter?: string } = $props();
</script>

<div data-slot="card-avatar" class={cn("tw-card-avatar", className)} {...restProps}><span>{letter}</span></div>
