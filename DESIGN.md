---
name: HalaqahId
description: Tahfidz memorization management system for Islamic schools
colors:
  tahfidz-green: "#5ea500"
  tahfidz-green-dark: "#7ccf00"
  tahfidz-green-foreground: "#ffffff"
  ink-navy: "#09090b"
  cloud: "#f4f4f5"
  snow: "#fafafa"
  whisper: "#e4e4e7"
  slate: "#71717b"
  alert-red: "#e7000b"
  spring-meadow: "#e2f6d4"
  deep-moss: "#336400"
  dark-surface: "#18181b"
  dark-panel: "#27272a"
typography:
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem (14px) / 1rem (16px) on md+"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "'rlig' 1, 'calt' 1"
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.5rem (24px) → 1.875rem (30px) on md+"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.25rem (20px) → 1.5rem (24px) on md+"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.75rem (12px) → 0.875rem (14px) on md+"
    fontWeight: 500
    lineHeight: 1
rounded:
  sm: "calc(0.65rem - 4px) ≈ 6.4px"
  md: "calc(0.65rem - 2px) ≈ 8.4px"
  lg: "0.65rem ≈ 10.4px"
  full: "9999px"
spacing:
  xs: "4px (0.25rem)"
  sm: "8px (0.5rem)"
  md: "16px (1rem)"
  lg: "24px (1.5rem)"
  xl: "40px (2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.tahfidz-green}"
    textColor: "{colors.tahfidz-green-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "oklch(0.648 0.2 131.684 / 0.9)"
    textColor: "{colors.tahfidz-green-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.cloud}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-destructive:
    backgroundColor: "{colors.alert-red}"
    textColor: "{colors.tahfidz-green-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  badge-default:
    backgroundColor: "{colors.tahfidz-green}"
    textColor: "{colors.tahfidz-green-foreground}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: HalaqahId

## 1. Overview

**Creative North Star: "The Quiet Classroom"**

HalaqahId's design system embodies a well-organized classroom where everything has its place — warm but disciplined, focused on the task at hand. The interface serves pesantren teachers who need to move quickly through attendance, memorization deposits, and student progress tracking during class hours. There is no visual noise, no decorative flourish competing for attention; the system earns trust through consistency, clarity, and restraint.

The aesthetic philosophy is utilitarian calm: a single green accent (Tahfidz Green) marks interactive elements and primary actions, while neutral surfaces recede to let data speak. The system explicitly rejects generic SaaS dashboard clichés — no hero-metric templates, no identical card grids, no gratuitous glassmorphism. It also rejects over-ornamentation; the spiritual context of Quran memorization is honored through craft and intention, not decorative Islamic patterns or calligraphy.

Light mode is the primary surface — teachers work under fluorescent or natural light in classrooms, where high-contrast dark-on-white is most legible. Dark mode exists as a secondary experience for evening review sessions, with reduced chroma on the primary green to prevent eye strain.

**Key Characteristics:**
- Restrained color strategy: green accent on ≤10% of any given screen
- System font stack for zero-load-time familiarity
- Flat surfaces with whispered shadows — depth through borders and tonal contrast, not elevation
- Compact component density optimized for data-heavy workflows
- Dual-theme (light/dark) with full token coverage

## 2. Colors

The palette is built on a single saturated green accent against near-neutral surfaces with the faintest cool-blue tint. Color is used sparingly and with intent — its rarity is the point.

### Primary
- **Tahfidz Green** (#5ea500 / oklch(0.648 0.2 131.684)): The sole accent color. Used for primary buttons, active navigation states, focus rings, progress indicators, and the brand mark in the sidebar. In dark mode, the green brightens to #7ccf00 (oklch(0.768 0.233 130.85)) to maintain contrast against dark surfaces.

### Neutral
- **Ink Navy** (#09090b / oklch(0.141 0.005 285.823)): Primary text color in light mode. A near-black with the slightest blue undertone that prevents it from reading as pure black. Becomes the dark mode background.
- **Cloud** (#f4f4f5 / oklch(0.967 0.001 286.375)): Secondary surfaces, muted backgrounds, and hover states for ghost/secondary buttons. Nearly neutral with a whisper of blue.
- **Snow** (#fafafa / oklch(0.985 0 0)): Sidebar background in light mode. Pure near-white, slightly cooler than the main background.
- **Whisper** (#e4e4e7 / oklch(0.92 0.004 286.32)): Borders, input strokes, and dividers. Visible enough to define boundaries, invisible enough to not compete with content.
- **Slate** (#71717b / oklch(0.552 0.016 285.938)): Muted foreground text — labels, descriptions, timestamps. Used sparingly; body text uses Ink Navy for contrast.

### Semantic
- **Alert Red** (#e7000b / oklch(0.577 0.245 27.325)): Destructive actions, error states, and validation messages. In dark mode, softens to #ff6467 (oklch(0.704 0.191 22.216)).
- **Spring Meadow** (#e2f6d4 / oklch(0.95 0.05 131.684)): Sidebar accent background — a light green tint that connects the sidebar to the brand green without using the accent directly.
- **Deep Moss** (#336400 / oklch(0.45 0.15 131.684)): Text on Spring Meadow backgrounds. Dark green for high contrast against the tinted surface.

### Named Rules

**The Green Restraint Rule.** Tahfidz Green appears on ≤10% of any given screen. It marks interactive affordances only — primary buttons, active nav items, focus rings, and the brand mark. If green is used decoratively, the screen has failed. Its scarcity is what gives it meaning.

**The Cool Whisper Rule.** All neutrals carry the faintest blue tint (hue ~286°). Never warm-tint neutrals toward yellow, orange, or beige — that band reads as cream/parchment, the saturated AI default. The cool undertone keeps the system feeling clinical and focused, appropriate for a data-management tool.

## 3. Typography

**Display Font:** System UI stack (system-ui, -apple-system, 'Segoe UI', sans-serif)
**Body Font:** System UI stack (same family, multiple weights)
**Mono Font:** Not defined (no code display surfaces)

**Character:** A single sans-serif family in four weights (400/500/600/700) carries the entire hierarchy. This is deliberate — product UIs don't need display/body pairing. The system font stack loads instantly and feels native on every OS, which is the right instinct for a tool teachers use daily.

### Hierarchy
- **H1 / Page Title** (700, 1.5rem → 1.875rem, line-height 1.2, tracking -0.025em): Used once per page. The weight and size difference from H2 is enough to anchor the page without needing a separate display font.
- **H2 / Section Title** (600, 1.25rem → 1.5rem, line-height 1.3, tracking -0.025em): Section headers within dashboards and management views.
- **H3 / Card Title** (600, 1.125rem → 1.25rem, line-height 1.4): Card titles, dialog headers, form section labels.
- **H4** (500, 1rem → 1.125rem, line-height 1.4): Sub-section headers, prominent labels.
- **Body** (400, 0.875rem → 1rem, line-height 1.625): Default text. Font-feature-settings enable required ligatures and contextual alternates for cleaner rendering.
- **Small / Label** (500, 0.75rem → 0.875rem, line-height 1): Metadata, timestamps, badges, navigation labels in the mobile dock.

### Named Rules

**The Single Family Rule.** One font family, four weights. Never introduce a second typeface for "visual interest" — the hierarchy comes from weight, size, and spacing, not font pairing. Product UIs don't need display fonts.

**The Line Length Rule.** Prose and paragraph text capped at 65–75ch. Data tables and compact UI can run denser. This matters especially in the settings pages and any instructional text.

## 4. Elevation

The system is predominantly flat with whispered shadows. Depth is conveyed through borders (1px Whisper stroke) and tonal contrast between surfaces (Snow sidebar vs. white content area vs. Cloud hover states), not through dramatic elevation changes. Cards carry a `shadow-sm` — barely perceptible at rest — that becomes slightly more defined on hover. This keeps the visual weight low and the interface feeling calm and organized.

### Shadow Vocabulary
- **Whisper** (`0 1px 2px rgba(0,0,0,0.05)`): Cards at rest. Barely visible; provides just enough lift to separate from the background without drawing attention.
- **Micro** (`0 1px 1px rgba(0,0,0,0.03)`): Inputs and form controls. Near-invisible; the border does the boundary work, the shadow is a subconscious cue.
- **Header** (none + `backdrop-blur` + `bg-background/95`): The top header uses a frosted-glass blur to float above scrolling content. This is the one intentional use of blur in the system — it serves a functional purpose (content passes behind it) rather than a decorative one.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. The whisper shadow on cards is the maximum resting elevation. Shadows increase only as a response to interaction (hover, focus) or functional necessity (header blur over scrolling content). No surface casts a shadow deeper than `shadow-sm` at rest.

## 5. Components

### Buttons
- **Shape:** Gently rounded rectangle (radius ≈ 8.4px, `rounded-md`)
- **Primary:** Tahfidz Green background, white text, 36px height, 16px horizontal padding. Hover dims to 90% opacity. Focus shows a 3px green ring offset from the element.
- **Secondary:** Cloud background, Ink Navy text. Hover dims to 80% opacity. Used for secondary actions alongside a primary button.
- **Ghost:** Transparent background, Ink Navy text. Hover reveals Cloud background. Used for icon-only actions, cancel buttons, and tertiary actions.
- **Outline:** White background, 1px Whisper border, Ink Navy text. Hover shifts to Cloud background. Used when the button needs to be visible but not dominant.
- **Destructive:** Alert Red background, white text. Used exclusively for confirm-delete and irreversible actions.
- **Sizes:** sm (32px), default (36px), lg (40px). Icon-only variants match the square of their height.

### Badges
- **Shape:** Full pill (border-radius: 9999px)
- **Default:** Tahfidz Green background, white text. Used for status indicators and counts.
- **Secondary:** Cloud background, Ink Navy text. Used for informational labels.
- **Outline:** Transparent background, 1px border, foreground text. Lightest visual weight.
- **Destructive:** Alert Red background, white text. Error states and warnings.

### Cards
- **Corner Style:** Generously rounded (radius ≈ 10.4px, `rounded-xl`)
- **Background:** Card surface color (white in light, dark-surface in dark mode)
- **Shadow Strategy:** Whisper shadow at rest, per Elevation section
- **Border:** 1px Whisper stroke on all sides
- **Internal Padding:** 24px vertical (`py-6`), 24px horizontal for content (`px-6`). Header uses a grid layout for title + action alignment.
- **Structure:** Card → CardHeader (title + description + optional action) → CardContent → CardFooter. 24px gap between sections.

### Inputs / Fields
- **Style:** 1px Whisper border, transparent background, 36px height, 12px horizontal padding. Gently rounded (radius ≈ 8.4px).
- **Focus:** Border shifts to ring color (Tahfidz Green), 3px green ring with 50% opacity appears around the element. Color and box-shadow transition smoothly.
- **Error:** Border turns Alert Red, ring shifts to destructive/20 opacity. `aria-invalid` attribute drives the state.
- **Disabled:** 50% opacity, pointer-events none, cursor not-allowed.
- **Selection:** Primary green background with white text on selected text.

### Navigation
- **Desktop Sidebar:** Collapsible (icon-only mode available), Snow background, Ink Navy text. Active item gets Spring Meadow background with Deep Moss text. Brand mark (green square with book icon) anchors the header. Footer shows user info + logout.
- **Mobile Dock:** Fixed bottom bar, background color, top border. Icons with 10px labels. Active item gets Tahfidz Green text and bold weight. Max 4 items per role.
- **Top Header:** Sticky, 64px height, backdrop-blur over background at 95% opacity, bottom border, subtle shadow. Avatar on right (clickable → settings), theme toggle, sidebar trigger on desktop.
- **States:** Active = green text + bold. Inactive = muted-foreground text. Hover = accent background tint.

### Skeleton (Loading States)
- Accent background color with `animate-pulse`. Rounded corners matching the element being loaded. Used instead of centered spinners for content areas.

## 6. Do's and Don'ts

### Do:
- **Do** use Tahfidz Green only for primary actions, active states, focus rings, and the brand mark. Its scarcity is what makes it meaningful.
- **Do** keep shadows at whisper level or below. `shadow-sm` is the maximum resting elevation; deeper shadows only on hover or functional overlays.
- **Do** use the single system font family in varying weights (400/500/600/700) for hierarchy. Never introduce a second typeface.
- **Do** maintain the cool-blue tint (hue ~286°) across all neutrals. Backgrounds, borders, and muted text all share this undertone.
- **Do** use skeleton loaders (pulse animation on accent background) for content loading states, not centered spinners in empty containers.
- **Do** ensure all interactive elements have complete state coverage: default, hover, focus-visible, active, disabled, loading, error.
- **Do** use the backdrop-blur header pattern (one intentional blur) — it's functional, not decorative. Content scrolls behind it, so the blur serves readability.

### Don't:
- **Don't** use Tahfidz Green decoratively or on more than ~10% of any screen. If a card has a green background, a green border, and a green icon, the accent has lost its meaning.
- **Don't** use warm-tinted neutrals (cream, sand, parchment, beige backgrounds). The cool undertone is a deliberate identity choice that distinguishes this from the saturated AI default.
- **Don't** use glassmorphism, decorative blurs, or frosted cards outside the top header. The header blur is the system's single sanctioned use of backdrop-filter.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on cards, list items, or callouts. Use full borders, background tints, or leading icons instead.
- **Don't** use gradient text (`background-clip: text` with gradient backgrounds). Emphasis comes through weight or size, never through gradient fills.
- **Don't** create identical card grids (same-sized cards with icon + heading + text repeated endlessly). Vary layout when content varies in importance.
- **Don't** introduce display fonts, serif headings, or decorative typeface into any UI surface. The system font stack in multiple weights is the complete typographic vocabulary.
- **Don't** use shadows deeper than `shadow-sm` at rest. The calm, flat aesthetic is core to the "Quiet Classroom" identity — heavy shadows break it.
- **Don't** default to modal dialogs for workflows that could be inline or progressive. Exhaust inline alternatives before reaching for a modal.
- **Don't** use generic SaaS dashboard patterns (hero-metric templates, numbered section markers as default scaffolding, tiny uppercase tracked eyebrows above every section). The interface should feel purpose-built for tahfidz workflows, not a repurposed CRM.
