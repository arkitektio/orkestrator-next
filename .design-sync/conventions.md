# Orkestrator UI — how to build with this design system

A shadcn/Radix component library (the "radix-vega" shadcn style) on **Tailwind CSS v4**,
with an OKLCH token theme. The look is **compact and dense**: the default text size is
`text-xs`, buttons are `h-7`, spacing is tight. Build screens that feel like a professional
desktop tool, not a marketing site.

## Setup / wrapping

- **No root provider is needed for styling.** Tokens and component styles load globally from
  `styles.css` (which `@import`s `_ds_bundle.css`). Components are styled the moment they mount.
- **Dark mode** is class-based: put `class="dark"` on an ancestor (e.g. the page root) to switch
  the whole token set. Light is the default (no class).
- **A few components need their own context provider** (all exported from the library, same bundle):
  - `Tooltip` → wrap the tooltip(s) in `<TooltipProvider>`.
  - `Sidebar` → wrap in `<SidebarProvider>` (use `SidebarLayout` for a simpler ready-made shell).
  - Radix-driven open/close components (`Dialog`, `Sheet`, `Drawer`, `Popover`, `DropdownMenu`,
    `Select`, `Accordion`, `Tabs`) are self-contained — the Root provides its own context.

## Styling idiom — Tailwind utilities bound to semantic tokens

Style your own layout with **Tailwind v4 utility classes**, and reach for the DS's **semantic
color tokens** so everything tracks the theme (and dark mode) automatically. Never hard-code hex
colors. The tokens (CSS custom properties, consumed via `bg-*`/`text-*`/`border-*` utilities):

| Token / utility | Use for |
|---|---|
| `bg-background` / `text-foreground` | page surface + primary text |
| `bg-card` / `text-card-foreground` | cards, panels (note: `--card` == background in light mode; rely on `border`) |
| `bg-primary` / `text-primary-foreground` / `text-primary` | brand actions/emphasis (a violet in light, teal-ish in dark) |
| `bg-secondary`, `bg-muted` / `text-muted-foreground`, `bg-accent` | secondary surfaces + de-emphasized text |
| `bg-destructive` / `text-destructive` | errors, destructive actions |
| `border-border`, `border-input`, `ring-ring` | borders, field borders, focus rings |
| `bg-sidebar*`, `--chart-1..5` | sidebar surfaces; chart series colors |
| `rounded-md` / `rounded-lg` (`--radius` = 0.625rem) | the standard corner radius |

The whole palette is driven by `--brand-hue` / `--brand-chroma` master controls — don't fight it;
use the semantic tokens and the brand stays consistent.

## Where the truth lives

- The stylesheet: `_ds/<folder>/styles.css` → `_ds_bundle.css` (every component class + the
  `:root` / `.dark` token definitions). Read it before inventing classes.
- Per component: `<Name>.d.ts` (the props contract) and `<Name>.prompt.md` (usage). Compose
  compound components from their parts (e.g. `Card` + `CardHeader`/`CardTitle`/`CardContent`/
  `CardFooter`; `Dialog` + `DialogTrigger`/`DialogContent`/…).

## Idiomatic example

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '<library>';

<Card className="w-80">
  <CardHeader>
    <CardTitle>Deployment</CardTitle>
    <CardDescription>Serving traffic from 3 regions.</CardDescription>
  </CardHeader>
  <CardContent className="text-xs text-muted-foreground">
    Last deploy 12 minutes ago. <Badge>Active</Badge>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button size="sm">Redeploy</Button>
    <Button size="sm" variant="outline">View logs</Button>
  </CardFooter>
</Card>
```

`Button` variants: `default` (brand gradient), `secondary`, `outline`, `ghost`, `destructive`,
`link`. Sizes: `xs`, `sm`, `default`, `lg`, `icon` (+ `icon-xs`/`icon-sm`/`icon-lg`). Keep to the
compact scale — `size="sm"` and `text-xs` are the norm here.
