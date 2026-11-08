# Twenty Figma component measurements

Original: https://www.figma.com/design/xt8O9mFeLl46C5InWwoMrN/Twenty

Connector source: https://www.figma.com/design/zpykphKQ2es7WjtOvymue6/Twenty--Copy-

The original was inspected through the signed-in browser. The user-owned copy was then read with the Figma connector (design context, screenshots, and a read-only Plugin API audit). No design edits were made. The connector audit supersedes sampled browser-only button-state measurements below.

## Scope and fidelity

This pass replaces shadcn styling for Button, Input, Label, Textarea, and Card with properties read from the source. It does not implement every component in the file. Card.Root/Header/Title/Description/Action now map specifically to the non-clickable Big Cards/Small Card variant. Content and Footer remain structural compatibility extensions; clickable/small card variants remain outside this pass. The Big-card avatar and action SVG are now included.

The original light measurements are retained below. A later read-only local export audit resolves the actual component variable bindings in both palette modes; see the state and motion follow-up at the end. Demo layout and compatibility variants are independent of the Figma port.

## Button

Component set: `170:9512`. Primary neutral medium: `925:30301`; primary blue medium default: `9637:61850`. Examples of other inspected nodes: secondary neutral small inverted `26857:61452`; secondary danger medium `2975:40486`.

- Height 24px (Small), 32px (Medium), both radius 8px, horizontal padding 8px, content gap 4px.
- Label: Inter, 13px, weight 500, line height 140%, cap-height trim, zero letter spacing. Neutral label #666666. Icon 14px. The reference "Filter" label is 32px wide; with a 14px icon and 4px gap, the total button is 66px wide. Border is an inner 1px stroke and must not increase intrinsic width.
- Primary neutral: black at 2%, hover 4%, press 8%; border black at 8%.
- Primary blue: #3E63DD, hover #3A5CCC, press #101D46, white label, border black at 4%.
- Primary danger: #E5484D, pressed #DC3D43, white label, border black at 4%.
- Secondary: transparent, 1px inner border. Neutral border black at 8%; blue border #C6D4F9; danger border #F9C6C6. Neutral hover and press fill black at 4%; blue hover fill #F0F4FF.
- Tertiary: no default fill or border, with the same 8px radius and spacing.
- Disabled blue primary: 24% opacity.
- Focused blue primary: #3E63DD stroke, inner white shadow, x/y 0, blur 0, spread 2px. No shadcn external 3px ring.
- Figma hover-to-press transition: smart animate, ease-out, 100ms.

The canonical API exposes primary/secondary/tertiary and default/blue/danger. Legacy aliases are documented in the README. Both inverted values are exposed and use the complete connector paint/effect table in `figma-button-audit.json`.

## Text input

Parent default medium: `27154:311594` (label), box `111579:648163`. The Inputs/Text Input set exposes Danger, Active, Default, Disabled, Placeholder with Small (24px) and Default (32px) sizes.

- Default specimen: fixed width 200px, total height 57px with label and helper; vertical gap 4px.
- Box: 32px height (small 24px), radius 8px, 1px inner border #EBEBEB; black at 2% fill.
- Inner Input: left padding 8px, right padding 4px, gap 4px. Leading-icon slot, when present, uses 16px icons.
- Text: Inter 13px / 400 / 140%, cap-height trim, zero tracking, #333333.
- Label: Inter 11px / 600 / 100%, cap-height trim (8px measured height), #B3B3B3.
- Helper: Inter 12px / 400 / 140%, #B3B3B3.
- Active border #3E63DD. Danger border #F9C6C6. Disabled box retains the default fill/border.

The exported Input represents the native editable surface; labels and helpers compose around it. The exact 16px bell SVG is the default prefix; `showPrefix={false}` removes it, and a prefix snippet supports dynamic content.

## Textarea

Default group `93731:320137`, label `93731:320138`, surface `93731:320139`, helper `93731:320140`. Focus group `93731:320169`; hover `93731:320165`; error `93731:320141`; disabled `93731:320173`.

- Group: 200px reference width, 105px total height including label and helper; gap 4px.
- Surface: min height 80px, radius 8px, padding 8px, gap 10px, 1px border #EBEBEB, black at 2% fill.
- Focus border #3E63DD. Error border #FFE5E5. Hover and disabled surface retain default fill/border.
- Label and helper typography are the same as Text Input.

## Typography and verification limits

The demo self-hosts the official Inter variable font, licensed in `licenses/Inter-OFL.txt`. Cap trimming is enabled on labels where the browser supports CSS text-box-trim. Text rasterization can vary by OS/browser and variable-font revision; this is not a pixel-diff certification. The source properties above, browser computed styles, responsive layout, and native interactions form the acceptance checks.

## Small Card

Big non-clickable source variant `9214:89505`, title `9214:89508`, subtitle `9214:89509`.

- Horizontal 350px × 64px, padding 12px, gap 12px, bottom inner divider 1px #F1F1F1, no default fill or outer radius.
- Text container fills remaining width, vertical gap 8px, measured height 26px.
- Title Inter 13px / 500 / 140%, cap-height trim, #333333. Subtitle Inter 13px / 400 / 140%, cap-height trim, #999999.
- Optional leading avatar slot 24px. Optional trailing icon-button slot 24px, with 16px light-weight icon, 4px horizontal padding, 8px radius. The demo now includes the 24px purple L avatar and exported 16px trash icon in the 24px native action button. Consumer-supplied dynamic content remains supported.

## Connector corrections and acceptance checks

The earlier browser-only samples missed the following details. The implementation now follows the connector:

- The canonical button includes the exact exported 14px search icon by default. Optional trailing chevron and shortcut separator are implemented; an intrinsic-width rounding rule matches the 66px reference width without hardcoding the label width.
- Secondary blue pressed fill is #E6EDFE; tertiary blue hover is #F8FAFF and pressed is #F0F4FF.
- Secondary danger hover/press border is #FFE5E5 rather than its default #F9C6C6.
- Disabled secondary border is #999999 for neutral and the accent color for blue/danger.
- Focused secondary/tertiary neutral/blue fill is white at 80%; focused danger is white. Focused and disabled primary neutral fill is black at 4%.
- Primary danger text is #FFE5E5 rather than white.
- Textarea placeholder/content uses Inter Medium (500), not Regular (400). The native resize handle is omitted to match the reference.
- The Big card’s avatar is always present in the retrieved component; its `icon` property controls the trailing action, not the avatar. Earlier documentation incorrectly interpreted it as removing the avatar.

The original table contains 180 rows (3 variants × 3 accents × 2 sizes × 5 states × 2 inversions). The light-mode stylesheet is generated from these exact paints, strokes, effects and opacities. The browser-rendered reference matrix was checked against every row: 180/180 match for 66px width, 24/32px height, background, stroke, opacity, 13px/500 label typography, and the 14px icon slot. The exact exported SVG geometry is used as a CSS mask for state-dependent icon color, including the card action mask.

Source screenshots and rendered evidence are saved locally under `output/figma-reference/`. `/reference` is the durable rendered specimen view. Text input group height is 56.734px versus Figma’s displayed 57px; textarea group is 104.734px versus displayed 105px, due to fractional native font cap metrics. Component surfaces match their integer reference bounds. No claim of byte-identical font rasterization is made.

The connector reached the Starter-plan tool limit after these references were fetched. No further connector calls or plan changes were made, and dark-mode parity is still not certified.

### Raster comparison follow-up

The imported public token CSS applies `superellipse(2.2)` globally in supporting browsers. Source controls explicitly set `--t-corner-shape: round` to avoid inheriting that unrelated global superellipse. The local source export records 0.6 corner smoothing on the rectangular controls; native rounded CSS corners remain a rendering approximation of that curve. The state audit certifies dimensions, paints, and timing, rather than identical corner/font rasterization. Font smoothing is explicit. Textarea borders use an inset stroke so they do not add a 1px text inset to Figma's 8px padding.

Figma image exports include overflowing ink/bounds: the 32px Input snapshot is 200×33px, and the logically 105px textarea group exports at 200×108px including helper descenders. Comparison captures use those export bounds without changing the logical control sizes. Raster comparisons are recorded locally in `output/figma-reference/pixel-comparison.json`; they show residual font/JPEG differences, so the audit does not certify pixel identity. The exact imported SVG roots are 14×14 (search and chevron) and 16×16 (bell and trash); their geometry is not redrawn or resized.


## Resolved state and motion follow-up

The connector tool quota was exhausted and its motion export does not currently include interactive variant transitions. The authenticated Figma editor was used read-only to inspect the actual Prototype and Variables panels, then File → Save local copy produced a local `.fig` snapshot. The snapshot was parsed locally with `openfig-core` 0.4.1. No source design, variable, plan, credential, or permission was changed. The full 91 MB file is not committed or uploaded; only the scoped component measurements and its SHA-256 are retained.

`figma-resolved-button-audit.json` contains all 180 variants with directly resolved Light and Dark fills, strokes, label/shortcut/separator colors, effects, variable identities, and prototype edges. This supersedes color-role guesses, including for dark mode: Static White and the legacy Grays/0 focus inset remain white, while palette-bound whites change with their actual bindings. The original connector light table remains available for comparison; its recorded nonempty paints match the local export.

There are 36 hover and 36 press edges. All 36 press edges use Smart Animate, 100ms, curve `[0, 0, 0.58, 1]`. Of the 36 hover edges, 31 are instant and five use a 75ms Ease-out dissolve: Small tertiary blue/danger, plus all three inverted Small tertiary accents. Their geometry and text remain fixed, so CSS interpolates the changing paints. A short-lived return flag preserves press/release timing without adding easing to instant hover entry. Shortcut/separator paints animate with the same timing. Reduced-motion removes these transitions. Native focus wins over hover and press wins over focus when states overlap.

`figma-resolved-field-audit.json` includes all ten Text Input and five Textarea source states, plus the Big non-clickable Small Card and its Icon/Light action states. Disabled input text and prefix use Text/Secondary (light #666666, dark #B3B3B3), not Text/Light. Empty placeholder prefixes use Text/Light. Selection colors match the Active specimens. The card avatar, subtitle, divider, and trash mask now use resolved palette values; the action includes source hover/press/focus/disabled treatments. `aria-pressed="true"` exposes its active accent, and `aria-busy="true"` hides the glyph as in the source loading specimen. The current Small Card instance overrides its avatar letter to T; `/reference` passes that explicitly, while the reusable Avatar retains its base default L.

`/reference` now has explicit light/dark inspection controls, optional-slot previews, native interactive examples, and an instrumented press/release replay. Forced state specimens stay out of keyboard navigation. Main demo appearance continues to follow the OS automatically.

Reproduce the source audit without adding a runtime dependency:

```sh
npm install --ignore-scripts --prefix /tmp/twenty-figma-audit openfig-core@0.4.1
node scripts/audit-figma-export.mjs /path/to/design.fig /tmp/twenty-figma-audit/node_modules/openfig-core/dist/index.js
node scripts/generate-figma-button-states.mjs
node scripts/generate-figma-field-states.mjs
node scripts/check-figma-reference.mjs /path/to/browser-capture.json
```

The source's dark primary-blue pressed fill resolves to #EEF1FD while its label remains Static White. That low-contrast authored state is preserved for fidelity; improving it requires a design decision. The scope remains the five exported component types and Big non-clickable card configuration, rather than all components in the file. Native form/keyboard semantics supplement the source's static field and focus specimens.

Browser validation passed 3,318 source comparisons across the 360 themed button states, optional slots, and field/card specimens. The motion replay emitted a real `transitionend` elapsed time of 100ms. Native Space activation, focus-visible styling, text selection, and disabled-control Tab skipping were verified. Type checking, ten unit tests, and production packaging passed.
