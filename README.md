# Twenty Svelte

An initial Svelte 5 component library using shadcn-svelte source components and Twenty CRM's public `twenty-ui` light and dark theme tokens. It is an independent project, not an official Twenty product. This is a foundation, not a complete port of Twenty's design system.

## Run locally

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
```

The example at `/` demonstrates buttons and a contact form. The library exports `Button`, `Input`, `Label`, `Textarea`, and the `Card` namespace. These components forward native attributes and events; label inputs with `Label` and `for`/`id` (or an accessible name). Buttons default to `type="button"`; set `type="submit"` for forms.

## Use from a local checkout

After `npm run build`, install this directory in a SvelteKit project. This package is private and has not been published. Consumers need Tailwind CSS 4 and must scan the package's Svelte source to generate utility classes. In the consumer's global CSS (adjust the path if needed):

```css
@import 'tailwindcss';
@import 'twenty-svelte/styles.css';
@source '../node_modules/twenty-svelte/dist';
```

Wrap your UI in an element with class `light` or `dark` to select Twenty's token set. The CSS bridge maps a subset of Twenty tokens to shadcn's semantic colors; applications can override those variables. The library does not load fonts; use Inter or supply a compatible fallback.

```svelte
<script lang="ts">
  import { Button, Input, Label, Card } from 'twenty-svelte';
</script>
<div class="light">
  <Card.Root>
    <Card.Header><Card.Title>Contact</Card.Title></Card.Header>
    <Card.Content><Label for="name">Name</Label><Input id="name" /></Card.Content>
    <Card.Footer><Button>Save</Button></Card.Footer>
  </Card.Root>
</div>
```

## Sources and limitations

Twenty's public `packages/twenty-ui` is MIT licensed. The theme CSS comes from commit `a074732678d68ee75c020cf65c95b7c5f3c79207`; its license and copyright notice are in `licenses/twenty-ui-MIT.txt`. Components originate from the MIT-licensed shadcn-svelte registry template at commit `17cc0574ab5ef1de82ec05173bb90623de9790ba` and have been adapted; its notice is in `licenses/shadcn-svelte-MIT.txt`. Both upstream licenses apply to their respective material.

The supplied Figma file was inaccessible to the connected account, so no exact-node visual comparison was possible. These components use public tokens and shadcn defaults; they have not been verified as pixel-accurate Twenty components. Future work should compare against the Figma library once access is granted, expand the component and interaction coverage, and validate contrast and keyboard behavior in real browsers.

## Demo and Workers deployment

The demo is a prerendered SvelteKit site. Run `npm run dev` to explore it locally; `npm run build` writes static files to `build/` and also packages the library. The `wrangler.jsonc` configuration serves that directory as Cloudflare Workers static assets. Once Wrangler is authenticated to the intended Cloudflare account and Workers is set up, deploy with `npx wrangler deploy`. This deploys the demo only; it does not publish the npm package.
