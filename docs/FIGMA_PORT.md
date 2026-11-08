# Twenty Figma component measurements

Source: https://www.figma.com/design/xt8O9mFeLl46C5InWwoMrN/Twenty

Inspected through the signed-in Figma browser with view permission. The MCP connector rejected view access, but the browser’s Properties panel exposed layout, typography, colors, and interactions. No edits were made to the Figma file.

## Scope and fidelity

This pass replaces shadcn styling for Button, Input, Label, Textarea, and Card with properties read from the source. It does not implement every component in the file. Card.Root/Header/Title/Description/Action now map specifically to the non-clickable Big Cards/Small Card variant. Content and Footer remain structural compatibility extensions; clickable/small variants and bundled avatar/icon assets are outside this pass.

Light values below are direct Figma measurements. Dark mode uses the corresponding roles from Twenty’s existing public dark theme; a dark Figma specimen was not inspected, so dark mode is not claimed as an exact visual match. Demo layout, hero illustration, and compatibility variants are independent of the port.

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

The canonical API exposes primary/secondary/tertiary and default/blue/danger. Legacy aliases are documented in the README. Inverted variants were sampled but are not exposed in this pass.

## Text input

Parent default medium: `27154:311594` (label), box `111579:648163`. The Inputs/Text Input set exposes Danger, Active, Default, Disabled, Placeholder with Small (24px) and Default (32px) sizes.

- Default specimen: fixed width 200px, total height 57px with label and helper; vertical gap 4px.
- Box: 32px height (small 24px), radius 8px, 1px inner border #EBEBEB; black at 2% fill.
- Inner Input: left padding 8px, right padding 4px, gap 4px. Leading-icon slot, when present, uses 16px icons.
- Text: Inter 13px / 400 / 140%, cap-height trim, zero tracking, #333333.
- Label: Inter 11px / 600 / 100%, cap-height trim (8px measured height), #B3B3B3.
- Helper: Inter 12px / 400 / 140%, #B3B3B3.
- Active border #3E63DD. Danger border #F9C6C6. Disabled box retains the default fill/border.

The exported Input represents the native editable surface; labels and helpers compose around it. Prefix/adornment components are not included in this pass.

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
- Optional leading avatar slot 24px. Optional trailing icon-button slot 24px, with 16px light-weight icon, 4px horizontal padding, 8px radius. Consumer-supplied dynamic content is allowed; the demo uses the Icon?=false composition and no trailing action.
