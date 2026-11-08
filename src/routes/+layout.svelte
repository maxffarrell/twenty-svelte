<script lang="ts">
 import '../app.css';
 import { onMount } from 'svelte';
 import { watchSystemTheme } from '../demo/system-theme';
 let { children } = $props();
 onMount(() => watchSystemTheme(window.matchMedia('(prefers-color-scheme: dark)'), document.documentElement));
</script>
{@render children()}
