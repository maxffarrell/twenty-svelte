# Twenty Svelte

A Svelte 5 component library with Button, Input, Label, Textarea, and Small Card styling measured from Twenty’s Figma design system. It retains the shadcn-svelte component API and Bits UI label behavior. It is an independent project, not an official Twenty product or a complete port of the design system. The Card namespace maps to the Big Cards/Small Card row.

## Run locally

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
```

The demo at `/` shows Figma button variants, field states, and a contact form. The library exports `Button`, `Input`, `Label`, `Textarea`, and the `Card` namespace. These components forward native attributes and events; label inputs with `Label` and `for`/`id` (or an accessible name). Buttons default to `type="button"`; set `type="submit"` for forms.

## Use from a local checkout

After `npm run build`, install this directory in a SvelteKit project. This package is private and has not been published. Consumers need Tailwind CSS 4 and must scan the package's Svelte source to generate utility classes. In the consumer's global CSS (adjust the path if needed):

```css
@import 'tailwindcss';
@import 'twenty-svelte/styles.css';
@source '../node_modules/twenty-svelte/dist';
```

Wrap your UI in an element with class `light` or `dark` to select Twenty's token set. The CSS bridge maps a subset of Twenty tokens to shadcn's semantic colors; applications can override those variables. The demo self-hosts Inter under its SIL Open Font License. Library consumers should load Inter themselves to reproduce the measured typography; a fallback font will change text metrics.

```svelte
<script lang="ts">
  import { Button, Input, Label, Card } from 'twenty-svelte';
</script>
<div class="light">
  <Card.Root>
    <Card.Header>
      <Card.Title>Thomas Kurian</Card.Title>
      <Card.Description>Add a job title</Card.Description>
    </Card.Header>
  </Card.Root>
</div>
```

## Sources and limitations

Twenty's public `packages/twenty-ui` is MIT licensed. The theme CSS comes from commit `a074732678d68ee75c020cf65c95b7c5f3c79207`; its license and copyright notice are in `licenses/twenty-ui-MIT.txt`. Components originate from the MIT-licensed shadcn-svelte registry template at commit `17cc0574ab5ef1de82ec05173bb90623de9790ba` and have been adapted; its notice is in `licenses/shadcn-svelte-MIT.txt`. Both upstream licenses apply to their respective material.

The Figma file was inspected in the authenticated browser with view permission. Measured node IDs and properties are recorded in [docs/FIGMA_PORT.md](docs/FIGMA_PORT.md). Button, Input, Label, Textarea, and Card now use measured geometry and typography instead of shadcn styling. The light-mode values were read from Figma’s Properties panel; dark mode maps those component roles onto Twenty’s public dark tokens and has not been compared to a separate dark Figma specimen. Card.Root, Header, Title, Description, and Action map to Cards/Small Card; Content and Footer remain compatibility extensions. This is a scoped port of these controls, not a claim that the complete Twenty component library is implemented.

## Demo and Workers deployment

The demo is a prerendered SvelteKit site. Run `npm run dev` to explore it locally; `npm run build` writes static files to `build/` and also packages the library. The `wrangler.jsonc` configuration serves that directory as Cloudflare Workers static assets. Once Wrangler is authenticated to the intended Cloudflare account and Workers is set up, deploy with `npx wrangler deploy`. This deploys the demo only; it does not publish the npm package.

## Component styling API

Buttons use `variant="primary" | "secondary" | "tertiary"`, `accent="default" | "blue" | "danger"`, and `size="sm" | "md"` (24px / 32px). The default is primary, neutral, 32px. Use the `leadingIcon` and `trailingIcon` snippets for the 14px icon slots. The previous `default`, `outline`, `ghost`, and `destructive` variants remain aliases; `lg` maps to Twenty’s 32px medium size. `link`, `icon`, and `icon-sm` are compatibility extensions, not separately verified Figma variants.

Inputs use `controlSize="sm" | "md"` (24px / 32px); the native numeric `size` attribute remains available. Set `aria-invalid="true"` for the Figma error border and associate helper text using `aria-describedby`. Textareas have an 80px minimum height. Labels and helpers sit 4px from their control. Native `disabled`, required fields, value binding, events, and form submission still work.

`Card.Root` maps to the non-clickable Big `Cards/Small Card` variant: 350px reference width (shrinks to fit), 64px height, 12px padding/gap, bottom divider. Compose `Card.Header` with `Card.Title` and `Card.Description`; `Card.Action` is a 24px action slot. The old large-panel Card layout has intentionally changed. `Card.Content` and `Card.Footer` are retained as unverified structural extensions; use Root/Header/Title/Description for the source layout. Clickable and Small card variants and bundled avatar/icon components are not included in this pass.
