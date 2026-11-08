# Dependency maintenance — 2026-11-08

All direct packages were checked against npm's current stable `latest` tags. The toolchain now uses SvelteKit 3.1.1, Vite 8.3.6, Vitest 5.1.0, Svelte 5.57.3, and current static adapter/package tooling. TypeScript remains on 6.0.3 because SvelteKit and svelte-check's declared peer ranges do not support TypeScript 7. Config moved into the Vite plugin and tsconfig now extends `$app/tsconfig`, as required by SvelteKit 3. The explicit `$lib` compatibility alias preserves existing library source imports; SvelteKit currently emits a deprecation notice for that compatibility setting.

Removed the unused auto adapter. Tinypool was only a transitive dependency of Vitest 3 and is absent after upgrading Vitest 5. Its critical advisory and the previous moderate Vitest mocker advisories are gone. A Runed override to 0.38.0 prevents Bits UI/Svelte Toolbelt from installing an older optional SvelteKit 2 peer with vulnerable cookie/form handling. Native component interaction tests pass with the override.

## Remaining upstream advisory

`npm audit` reports **7 low, 0 moderate, 0 high, 0 critical** dependency entries. All seven trace to one root advisory: [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) in `deepmerge` 4.3.1, which is still the latest published release. The advisory lists **no patched version**. The affected dependency paths are deepmerge → vite-plugin-svelte → SvelteKit → static adapter / Runed → Bits UI / Svelte Toolbelt. Audit also propagates this build-tool advisory through optional peers in its production-only report; that report is not zero.

In this checkout, vite-plugin-svelte calls deepmerge to merge repository-owned compiler/plugin configuration (`src/utils/options.js`), not values from contact fields or a remote configuration endpoint. Cloudflare serves only prerendered static assets; the development/build tools are not deployed as request handlers. This limits exposure here, but does not fix deepmerge itself. Do not merge untrusted objects into build configuration. Upgrade the plugin/deepmerge when upstream publishes a fix. Do not use `npm audit fix --force`: its suggested historical SvelteKit/adapter downgrades would undo the supported migration and reintroduce other problems.

Validation: `npm run check`, `npm test`, `npm run build`; `npm ls tinypool` shows an empty tree. The generated 180-state Figma stylesheet still matches the checked-in source audit.
