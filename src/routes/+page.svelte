<script lang="ts">
 import { Button, Input, Label, Textarea, Card } from '$lib';
 let name = $state(''); let saved = $state(false);
</script>
<svelte:head><title>Twenty Svelte — Components</title></svelte:head>
<main class="mx-auto flex max-w-4xl flex-col gap-8 p-8">
 <header class="flex flex-col gap-2"><p class="text-sm text-muted-foreground">TWENTY SVELTE / COMPONENTS</p><h1 class="text-3xl font-semibold">A Svelte foundation for Twenty</h1><p class="text-muted-foreground">Accessible building blocks, styled with Twenty’s public theme tokens.</p></header>
 <Card.Root><Card.Header><Card.Title>Actions</Card.Title><Card.Description>Button variants and sizes</Card.Description></Card.Header><Card.Content><div class="flex flex-wrap gap-2"><Button>Save changes</Button><Button variant="outline">Cancel</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">More</Button><Button variant="destructive">Delete</Button><Button size="sm">Small</Button><Button disabled>Disabled</Button></div></Card.Content></Card.Root>
 <Card.Root><Card.Header><Card.Title>Contact details</Card.Title><Card.Description>A simple form composed from the library.</Card.Description></Card.Header><Card.Content><form class="flex max-w-md flex-col gap-4" onsubmit={(event) => { event.preventDefault(); saved = true; }}><div class="flex flex-col gap-2"><Label for="name">Name</Label><Input id="name" placeholder="Ada Lovelace" bind:value={name} required /></div><div class="flex flex-col gap-2"><Label for="note">Note</Label><Textarea id="note" placeholder="Add a note" /></div><div><Button type="submit">Save contact</Button></div><p role="status">{saved ? `Saved ${name}` : ''}</p></form></Card.Content></Card.Root>
</main>
