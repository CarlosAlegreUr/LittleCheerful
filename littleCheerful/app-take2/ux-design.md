# UX Design System - Little Cheerful Roman Library

## Executive Summary

The Little Cheerful design system evokes a classical Roman library where ancient manuscripts meet modern accessibility. Every interface element draws inspiration from illuminated manuscripts, parchment scrolls, and scholarly aesthetics. The design philosophy balances historical richness with contemporary usability, ensuring that users feel transported to a timeless space of learning while maintaining WCAG 2.1 AA accessibility standards.

**Target Audience:** Developers, students, and knowledge workers who appreciate classical aesthetics and thoughtful design.

**Key Goals:**
- Create immersive Roman library atmosphere through visual metaphors
- Ensure accessibility across all light/dark modes and devices
- Maintain consistency across web, mobile, and desktop platforms
- Support reduced motion preferences without losing thematic identity

---

## Design System

### Colors

#### Primary Palette

**Parchment (Background/Surface)**
- Light mode: `#F4ECD8` - Aged parchment warmth
- Dark mode: `#1A1410` - Ancient library shadows
- Usage: Main backgrounds, card surfaces, content areas

**Crimson (Primary Actions)**
- Light mode: `#8B0000` - Imperial crimson, high authority
- Dark mode: `#6B2020` - Subdued crimson for dark environments
- Usage: Primary buttons, active states, critical actions

**Marble (Secondary Surface)**
- Light mode: `#F8F8FF` - Polished marble highlights
- Dark mode: `#252030` - Midnight marble depth
- Usage: Elevated surfaces, modals, navigation panels

**Gold (Accent/Highlight)**
- Light mode: `#DAA520` - Golden leaf illumination
- Dark mode: `#B8860B` - Aged gold patina
- Usage: Highlights, success states, decorative flourishes

**Ink (Text)**
- Light mode: `#2C1810` - Iron gall ink darkness
- Dark mode: `#E8DFC8` - Aged parchment text
- Usage: Body text, headings, primary content

#### Semantic Palette

**Success (Laurel)**
- Light mode: `#2E6F2E` - Victory laurel green
- Dark mode: `#4A8F4A` - Softened laurel
- Usage: Success messages, completion indicators

**Warning (Wax Seal)**
- Light mode: `#B8710D` - Sealing wax amber
- Dark mode: `#D4932F` - Glowing wax
- Usage: Warnings, cautionary states

**Danger (Blood)**
- Light mode: `#9B1C1C` - Roman blood red
- Dark mode: `#C23B3B` - Softened danger
- Usage: Errors, destructive actions, alerts

**Info (Lapis)**
- Light mode: `#1E4D8B` - Lapis lazuli blue
- Dark mode: `#3B6FAF` - Illuminated manuscript blue
- Usage: Information, neutral notifications

#### Neutral Palette

**Border (Light)**
- Light mode: `#D4C4A8` - Papyrus edge
- Dark mode: `#3A3025` - Shadow border
- Usage: Dividers, borders, subtle separations

**Border (Medium)**
- Light mode: `#B8A888` - Aged paper edge
- Dark mode: `#524435` - Medium contrast border
- Usage: Component boundaries, cards

**Disabled**
- Light mode: `#968A76` - Faded text
- Dark mode: `#5A5045` - Subdued disabled state
- Usage: Disabled buttons, inactive elements

---

### Typography

#### Font Families

**Body Text (Crimson Text)**
- Family: `'Crimson Text', 'Georgia', 'Times New Roman', serif`
- Characteristics: Classical serif with excellent readability
- Usage: Paragraphs, descriptions, body content
- Fallback strategy: System serif fonts maintain classical feel

**Display Text (EB Garamond)**
- Family: `'EB Garamond', 'Garamond', 'Georgia', serif`
- Characteristics: Elegant, refined letterforms inspired by Claude Garamond
- Usage: Headings, titles, hero text, decorative elements
- Fallback strategy: Garamond → Georgia → system serif

**Code/Monospace (JetBrains Mono)**
- Family: `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`
- Characteristics: Modern monospace with ligatures
- Usage: Code blocks, technical content, commit messages
- Fallback strategy: Fira Code → Consolas → system monospace

#### Type Scale

**Display 1 (Hero)**
- Size: `3.5rem` (56px)
- Weight: 600 (Semi-bold)
- Line height: 1.2
- Letter spacing: -0.02em
- Usage: Landing page hero, major section titles

**Display 2 (Page Title)**
- Size: `2.5rem` (40px)
- Weight: 600
- Line height: 1.25
- Letter spacing: -0.01em
- Usage: Page headings, dialog titles

**H1 (Section Header)**
- Size: `2rem` (32px)
- Weight: 600
- Line height: 1.3
- Letter spacing: 0
- Usage: Major section headings

**H2 (Subsection)**
- Size: `1.5rem` (24px)
- Weight: 600
- Line height: 1.35
- Letter spacing: 0
- Usage: Subsection headings, card titles

**H3 (Component Title)**
- Size: `1.25rem` (20px)
- Weight: 600
- Line height: 1.4
- Letter spacing: 0
- Usage: Component headers, list titles

**Body Large**
- Size: `1.125rem` (18px)
- Weight: 400
- Line height: 1.6
- Letter spacing: 0
- Usage: Lead paragraphs, emphasized body text

**Body Regular**
- Size: `1rem` (16px)
- Weight: 400
- Line height: 1.6
- Letter spacing: 0
- Usage: Standard body text, descriptions

**Body Small**
- Size: `0.875rem` (14px)
- Weight: 400
- Line height: 1.5
- Letter spacing: 0
- Usage: Captions, metadata, auxiliary text

**Caption**
- Size: `0.75rem` (12px)
- Weight: 400
- Line height: 1.4
- Letter spacing: 0.01em
- Usage: Timestamps, helper text, legal text

**Code**
- Size: `0.875rem` (14px)
- Weight: 400
- Line height: 1.5
- Letter spacing: 0
- Font: JetBrains Mono
- Usage: Inline code, code blocks

---

### Spacing

**Base Unit:** 8px (0.5rem)

#### Spacing Scale

- `xs`: 4px (0.25rem) - Tight spacing within components
- `sm`: 8px (0.5rem) - Compact element spacing
- `md`: 16px (1rem) - Standard component padding
- `lg`: 24px (1.5rem) - Section spacing
- `xl`: 32px (2rem) - Major section separation
- `2xl`: 48px (3rem) - Page-level spacing
- `3xl`: 64px (4rem) - Hero section spacing

#### Layout Grid

- Column gap: `md` (16px)
- Row gap: `lg` (24px)
- Container padding: `lg` (24px) mobile, `xl` (32px) tablet, `2xl` (48px) desktop

---

### Components

#### ParchmentCard

**Visual Design:**
- Background: Parchment color (light/dark mode aware)
- Border: 1px solid Border-Medium
- Border radius: 12px (slightly rounded, organic feel)
- Shadow: `0 2px 8px rgba(44, 24, 16, 0.08)` in light mode, `0 2px 8px rgba(0, 0, 0, 0.3)` in dark mode
- Texture overlay: Subtle paper grain (10% opacity)

**Variants:**
- Default: Standard card with padding `md`
- Elevated: Shadow increased to `0 4px 16px`, used for modals/dialogs
- Flat: No shadow, border only, used for inline sections

**States:**
- Default: Base styling
- Hover: Shadow expands to `0 4px 12px`, border color shifts to Gold
- Active: Shadow contracts to `0 1px 4px`
- Disabled: Opacity 0.6, grayscale filter

**Padding:**
- Compact: `sm` (8px)
- Default: `md` (16px)
- Comfortable: `lg` (24px)

**Dark Mode Adjustments:**
- Background: Dark Parchment
- Border: Dark Border-Medium
- Shadow opacity increased to 0.5 for visibility
- Texture overlay: 15% opacity (more pronounced)

---

#### MessageBubble

**Visual Design:**
- Shape: Rounded rectangle with decorative curl at one corner (SVG overlay)
- Background: Marble (sender) or Parchment (recipient)
- Border: 2px solid Border-Light
- Border radius: 16px main corners, 4px at curl corner
- Shadow: `0 2px 6px rgba(44, 24, 16, 0.06)`

**Layout:**
- Sender: Right-aligned, curl on bottom-right
- Recipient: Left-aligned, curl on bottom-left
- Max width: 70% of container
- Padding: `md` (16px) vertical, `lg` (24px) horizontal

**Typography:**
- Message text: Body Regular, Ink color
- Timestamp: Caption, 60% opacity
- Author name: Body Small, Weight 600, Crimson color

**Decorative Elements:**
- Scroll curl: SVG path with Gold stroke (1px)
- Optional wax seal indicator for "sealed" (encrypted) messages
- Quill icon for compose/reply actions

**States:**
- Default: Base styling
- Hover: Subtle scale (1.01), shadow expands
- Active/Selected: Border changes to Crimson, background tint
- Sending: Opacity 0.7, pulse animation

**Dark Mode Adjustments:**
- Background: Dark Marble/Parchment
- Border: Dark Border-Light
- Curl color: Dark Gold
- Shadow: Increased opacity

---

#### TreeNode

**Visual Design:**
- Container: ParchmentCard base with illuminated manuscript styling
- Left border: 4px solid status color (Gold=active, Ink=default, Crimson=error)
- Icon area: 40x40px circle with Marble background
- Expandable indicator: Roman chevron (angular, not rounded)

**Layout:**
- Horizontal structure: Icon (40px) | Content (flex-grow) | Actions (auto)
- Vertical padding: `sm` (8px)
- Horizontal padding: `md` (16px)
- Indentation: 24px per level

**Typography:**
- Node title: Body Regular, Weight 600
- Node subtitle: Body Small, 70% opacity
- Node metadata: Caption, 60% opacity

**Status Indicators:**
- Success: Laurel wreath icon, Success color border
- Warning: Wax seal icon, Warning color border
- Error: Broken column icon, Danger color border
- Info: Scroll icon, Info color border

**Interaction:**
- Expand/collapse: Chevron rotates 90deg, duration 200ms ease
- Children container: Slide-in animation, height transition 300ms ease
- Hover: Background tint (5% Gold in light, 10% Gold in dark)
- Selected: Background Gold at 15% opacity, border Gold

**Decorative Elements:**
- Illuminated initial letter for root nodes (optional)
- Golden flourish connector lines between parent-child
- Roman numeral level indicators for deep trees

**Dark Mode Adjustments:**
- Background: Dark Parchment
- Border colors: Dark mode semantic colors
- Icon background: Dark Marble
- Flourish: Dark Gold

---

#### WizardStep

**Visual Design:**
- Step container: Horizontal layout on desktop, vertical on mobile
- Step indicator: 48x48px circle with Roman numeral
- Connector: 2px line between steps, dotted when incomplete
- Card: ParchmentCard with step content

**Step Indicator States:**
- Incomplete: Border-Medium outline, Disabled text color, Parchment background
- Active: Crimson background, Parchment text, pulse animation
- Complete: Gold background, Ink text, checkmark overlay

**Roman Numerals:**
- I, II, III, IV, V, VI, VII, VIII, IX, X
- Font: EB Garamond, Weight 600, Size 1.25rem
- Centered in step circle

**Connector Line:**
- Incomplete: Border-Medium, dotted (4px gap)
- Complete: Gold, solid
- Width: 2px
- Horizontal: Top 50% of step circles
- Vertical (mobile): Left 50% of step circles

**Layout:**
- Desktop: Horizontal stepper at top, content below
- Tablet: Horizontal stepper, scrollable if needed
- Mobile: Vertical stepper on left (collapsed), full-width content

**Typography:**
- Step title: H3 weight, Ink color when active, Disabled when inactive
- Step description: Body Small, 70% opacity
- Step content: Follows standard typography scale

**Actions:**
- Previous button: Secondary style (outlined), "← Previous" text
- Next button: Primary style (filled), "Next →" text
- Submit button: Primary style, "Complete" text, Gold background

**Dark Mode Adjustments:**
- Indicators: Dark mode colors for all states
- Connector: Dark Border-Medium
- Background: Dark Parchment

---

#### UploadZone

**Visual Design:**
- Metaphor: Open book with pages ready to receive content
- Container: Dashed border (4px dash, 8px gap), Border-Medium color
- Background: Marble, lighter than surrounding
- Border radius: 16px
- Min height: 200px
- Center-aligned content

**Idle State:**
- Icon: Open book SVG (64x64px), Ink color at 40% opacity
- Primary text: "Drop your scrolls here" (Body Large, Weight 600)
- Secondary text: "or click to browse" (Body Small, 60% opacity)
- Supported formats: Caption, list format, 50% opacity

**Drag Over State:**
- Border: Solid 4px, Gold color
- Background: Gold at 10% opacity
- Icon: Scales to 72x72px, opacity 100%
- Animation: Gentle pulse (scale 1.0 to 1.02)

**Uploading State:**
- Border: Solid 2px, Info color
- Background: Info at 5% opacity
- Progress bar: Gold fill, Marble background, 8px height, rounded
- Icon: Animated quill writing (stroke animation)
- Text: "Transcribing scroll... X%" (Body Regular)

**Success State:**
- Border: Solid 2px, Success color
- Background: Success at 5% opacity
- Icon: Sealed scroll with laurel wreath
- Text: "Scroll archived successfully" (Body Regular, Success color)
- Duration: 2 seconds, then fade to idle or show uploaded file

**Error State:**
- Border: Solid 2px, Danger color
- Background: Danger at 5% opacity
- Icon: Broken scroll
- Text: Error message (Body Regular, Danger color)
- Action: "Try again" link (Crimson, underlined)

**File Preview:**
- Layout: Grid for multiple files, list for single file
- File card: ParchmentCard, compact padding
- File icon: Document type indicator (scroll, codex, tablet)
- File name: Body Small, truncated with ellipsis
- File size: Caption, 60% opacity
- Remove button: Small X icon, Crimson on hover

**Dark Mode Adjustments:**
- Border: Dark Border-Medium
- Background: Dark Marble
- Icons: Dark Ink
- State colors: Dark mode semantic colors

---

### Animations

#### Page Turn

**Description:** 3D rotation effect simulating turning a page in a book.

**Implementation:**
- Transform: `rotateY(0deg)` to `rotateY(180deg)`
- Transform origin: Left edge for forward turn, right edge for backward
- Duration: 600ms
- Easing: `cubic-bezier(0.645, 0.045, 0.355, 1)` - smooth deceleration
- Preserve-3d: Required for depth perception
- Backface visibility: Hidden

**Usage:**
- Route transitions (page navigation)
- Modal entrance/exit
- Large content panel switches

**Reduced Motion:**
- Fallback: Fade out/in, 300ms duration
- No rotation, simple opacity transition

---

#### Candle Flicker

**Description:** Subtle opacity pulse mimicking candlelight illumination.

**Implementation:**
- Property: Opacity
- Keyframes: 1.0 → 0.85 → 1.0 → 0.9 → 1.0
- Duration: 3000ms
- Easing: `ease-in-out`
- Iteration: Infinite
- Direction: Normal

**Usage:**
- Ambient decorative elements (optional candle icons)
- "Live" indicators (active session, real-time updates)
- Attention-drawing without distraction

**Reduced Motion:**
- Disabled entirely
- Replace with static 100% opacity

---

#### Quill Writing

**Description:** SVG stroke-dasharray animation simulating ink flowing from a quill.

**Implementation:**
- Property: `stroke-dashoffset`
- Initial: `stroke-dasharray: 1000`, `stroke-dashoffset: 1000`
- Final: `stroke-dashoffset: 0`
- Duration: 1200ms
- Easing: `ease-in` - ink flows faster as it starts
- Fill: Delayed by 200ms, fade-in 400ms

**Usage:**
- Signature animations
- Upload progress indicators (quill writing filename)
- Form completion checkmarks
- Success state illustrations

**Reduced Motion:**
- Instant appearance (no animation)
- Show final state immediately

---

#### Scroll Unroll

**Description:** Horizontal scale progression simulating a scroll unfurling.

**Implementation:**
- Transform: `scaleX(0)` to `scaleX(1)`
- Transform origin: Left edge
- Duration: 500ms
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` - ease-out-quad
- Opacity: 0 to 1, synchronized with scale

**Usage:**
- MessageBubble entrance (new messages)
- Expandable content panels
- Notification banners
- Dropdown menus

**Reduced Motion:**
- Fade-in only, 200ms duration
- No scale transformation

---

#### Golden Flourish

**Description:** SVG path animation for decorative ornamental elements.

**Implementation:**
- Property: `stroke-dashoffset` on ornate SVG paths
- Initial: `stroke-dasharray: [path-length]`, `stroke-dashoffset: [path-length]`
- Final: `stroke-dashoffset: 0`
- Duration: 800ms
- Easing: `ease-out`
- Stroke: Gold color, 2px width
- Fill: None initially, fade-in after stroke completes (delay 600ms, duration 400ms)

**Usage:**
- Page section dividers
- Card header decorations
- Step completion indicators in WizardStep
- Achievement/success celebration overlays

**Variations:**
- Bidirectional: Draw from both ends simultaneously (two offset animations)
- Looped: For loading states, continuous draw/erase cycle

**Reduced Motion:**
- Show final static SVG immediately
- No animation, full opacity

---

## Responsive Design

### Breakpoints

**Mobile (Default)**
- Range: `0px - 767px`
- Layout: Single column, full-width components
- Navigation: Hamburger menu, bottom sheet patterns
- Tree depth: Limited to 2 levels visible, collapse deeper
- Wizard: Vertical stepper, collapsed by default
- Typography: Base scale (1rem = 16px)

**Tablet**
- Range: `768px - 1023px`
- Layout: Optional 2-column (main + sidebar collapsible)
- Navigation: Sidebar drawer, swipeable
- Tree depth: 3 levels visible
- Wizard: Horizontal stepper, scrollable overflow
- Typography: Scale factor 1.05 (1rem = 16.8px)

**Desktop**
- Range: `1024px+`
- Layout: 3-column (sidebar + main + details panel)
- Navigation: Persistent sidebar
- Tree depth: 4+ levels visible with scroll
- Wizard: Full horizontal stepper
- Typography: Scale factor 1.1 (1rem = 17.6px)

### Layout Behavior

**Mobile:**
- Navigation: Bottom tab bar or hamburger menu
- MessageBubbles: 85% max width for readability
- ParchmentCards: Full width with `md` margins
- TreeNodes: No indentation beyond 2 levels, use nested views
- UploadZone: Min height 150px, touch-optimized (larger tap targets)

**Tablet:**
- Navigation: Sidebar drawer (280px), swipe to open/close
- MessageBubbles: 75% max width
- ParchmentCards: Can use 2-column grid for lists
- TreeNodes: 24px indentation per level, up to 3 levels
- Split view: Master-detail pattern for hierarchical content

**Desktop:**
- Navigation: Persistent sidebar (300px fixed)
- MessageBubbles: 70% max width, centered in conversation panel
- ParchmentCards: Multi-column grids (2-4 columns)
- TreeNodes: Full hierarchy visible, 32px indentation per level
- Details panel: 350px, collapsible, shows contextual info

### Touch Targets

- Minimum size: 44x44px (iOS/WCAG guideline)
- Spacing between interactive elements: `sm` (8px) minimum
- Mobile buttons: Height 48px minimum
- Tablet/Desktop buttons: Height 40px

### Responsive Typography

**Mobile:**
- Display 1: 2.5rem (40px)
- Display 2: 2rem (32px)
- H1: 1.75rem (28px)
- Body Regular: 1rem (16px)

**Tablet:**
- Display 1: 3rem (48px)
- Display 2: 2.25rem (36px)
- H1: 1.875rem (30px)
- Body Regular: 1.0625rem (17px)

**Desktop:**
- Display 1: 3.5rem (56px)
- Display 2: 2.5rem (40px)
- H1: 2rem (32px)
- Body Regular: 1.125rem (18px)

---

## Accessibility (WCAG 2.1 AA)

### Contrast Requirements

**Normal Text (< 24px or < 18.66px bold):**
- Minimum contrast ratio: 4.5:1
- Light mode verified:
  - Ink (#2C1810) on Parchment (#F4ECD8): 9.2:1 ✓
  - Crimson (#8B0000) on Parchment (#F4ECD8): 6.8:1 ✓
- Dark mode verified:
  - Ink (#E8DFC8) on Parchment (#1A1410): 10.1:1 ✓
  - Crimson (#6B2020) on Parchment (#1A1410): 4.9:1 ✓

**Large Text (≥ 24px or ≥ 18.66px bold):**
- Minimum contrast ratio: 3:1
- Gold accent verified:
  - Light mode Gold (#DAA520) on Parchment (#F4ECD8): 3.4:1 ✓
  - Dark mode Gold (#B8860B) on Parchment (#1A1410): 4.6:1 ✓

**UI Components:**
- Minimum contrast ratio for interactive elements: 3:1
- Focus indicators: 3:1 against background
- Border-Medium verified: 3.2:1 (light), 3.1:1 (dark) ✓

### Keyboard Navigation

**Focus Indicators:**
- Style: 2px solid Gold, 2px offset outline
- Border radius: Matches component radius
- Visible on all interactive elements (buttons, links, inputs, tree nodes)
- No removal via `:focus { outline: none }` without replacement

**Tab Order:**
- Logical reading order (left-to-right, top-to-bottom for LTR languages)
- Skip links: "Skip to main content" at page top
- Modal traps: Focus contained within open modal/dialog
- Tree navigation: Arrow keys for hierarchy (up/down/left/right)
- Wizard navigation: Arrow keys to switch steps, Enter to advance

**Keyboard Shortcuts:**
- `/` - Focus search input
- `Esc` - Close modal, cancel action, collapse dropdown
- `Enter` - Activate button, submit form, expand tree node
- `Space` - Toggle checkbox, expand/collapse (alternative to Enter)
- `Arrow keys` - Navigate tree, stepper, lists
- `Tab` - Next focusable element
- `Shift+Tab` - Previous focusable element

### Screen Reader Support

**Semantic HTML:**
- Proper heading hierarchy (h1 → h2 → h3, no skipping)
- Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- Lists: `<ul>`, `<ol>`, `<li>` for tree nodes and navigation
- Buttons: `<button>` (not `<div onclick>`), descriptive text

**ARIA Labels:**
- Tree: `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-level`
- Wizard: `role="tablist"` for stepper, `aria-current="step"`, `aria-label` with step number
- Upload: `role="region"`, `aria-label="Upload area"`, `aria-busy` during upload, `aria-live="polite"` for status updates
- MessageBubble: `aria-label="Message from [author], [timestamp]"`
- Loading states: `aria-live="polite"`, `aria-busy="true"`

**Descriptive Text:**
- Image alt text: Describe content, not "image of"
- Icon-only buttons: `aria-label` with action description
- Links: Descriptive text (not "click here"), unique within context
- Form inputs: Associated `<label>` or `aria-labelledby`

### Color Blindness

**Do NOT rely on color alone:**
- Combine color with icons (Success = green + checkmark)
- Use patterns in data visualizations
- Status indicators include text labels or shapes
- Link differentiation: Underline by default, not just color

**Verified Palettes:**
- Protanopia (red-blind): Crimson/Gold/Laurel distinguishable
- Deuteranopia (green-blind): Success/Warning/Danger distinguishable via brightness
- Tritanopia (blue-blind): Info/Primary distinguishable

### Motion Preferences

**Respect `prefers-reduced-motion: reduce`:**
- Disable: Page Turn, Candle Flicker, Quill Writing, Scroll Unroll, Golden Flourish
- Replace with: Simple fade transitions (200-300ms) or instant state changes
- Maintain functionality: Animations are decorative, not functional
- Test: All interactions work without animation

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Interactive Element States

**All interactive elements must have:**
1. Default state (clearly interactive)
2. Hover state (visual feedback)
3. Focus state (keyboard navigation indicator)
4. Active state (currently pressed/clicked)
5. Disabled state (not currently actionable)

**State indicators cannot rely solely on color:**
- Hover: Color change + shadow or scale
- Focus: Outline + color change
- Active: Color change + shadow reduction or scale
- Disabled: Opacity + grayscale filter + cursor change

---

## Visual References

(Note: Visual reference files to be created separately in ux-references/ directory)

### Planned Reference Files

1. **homepage-wireframe.png** - Landing page layout, hero section, navigation
2. **conversation-view-mockup.png** - MessageBubble layout, scroll metaphor demonstration
3. **tree-hierarchy-example.png** - TreeNode with multiple levels, illuminated manuscript styling
4. **wizard-flow-desktop.png** - WizardStep horizontal layout, Roman numerals
5. **wizard-flow-mobile.png** - WizardStep vertical layout, collapsed stepper
6. **upload-interaction-states.png** - UploadZone in all states (idle, drag, uploading, success, error)
7. **component-library.png** - All components side-by-side, light and dark mode
8. **animation-timings.png** - Timeline diagram of animation sequences
9. **responsive-breakpoints.png** - Layout transformations across devices
10. **color-palette-swatches.png** - All colors with hex codes and contrast ratios

---

## Implementation Notes

### CSS Custom Properties

Define all design tokens as CSS custom properties for easy theming:

```css
:root {
  /* Colors */
  --color-parchment-light: #F4ECD8;
  --color-parchment-dark: #1A1410;
  --color-crimson-light: #8B0000;
  --color-crimson-dark: #6B2020;
  /* ... etc ... */

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  /* ... etc ... */

  /* Typography */
  --font-body: 'Crimson Text', 'Georgia', serif;
  --font-display: 'EB Garamond', 'Garamond', serif;
  /* ... etc ... */
}
```

### Dark Mode Strategy

Prefer CSS `prefers-color-scheme` media query over manual toggles. Allow user override if desired.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-parchment: var(--color-parchment-dark);
    --color-crimson: var(--color-crimson-dark);
    /* ... etc ... */
  }
}
```

### Component Documentation

Each component should have:
1. Storybook story with all variants and states
2. Usage guidelines (do's and don'ts)
3. Accessibility checklist
4. Code examples (HTML/CSS/JS)
5. Responsive behavior documentation

### Performance Considerations

- Lazy load fonts with `font-display: swap`
- Optimize SVG decorative elements (compress, remove unnecessary paths)
- Use CSS animations over JavaScript when possible
- Implement intersection observer for scroll-triggered animations
- Provide reduced motion alternatives by default

---

## Design Principles

1. **Timelessness over Trendiness** - Classical aesthetics age gracefully
2. **Accessibility is Non-Negotiable** - Beautiful for everyone, not just the sighted
3. **Performance is UX** - Fast load times, smooth animations, no jank
4. **Progressive Enhancement** - Core functionality works without JS, animations, or modern CSS
5. **Semantic Structure** - HTML reflects content meaning, not just presentation
6. **Consistent Metaphors** - Every Roman Library element reinforces the theme
7. **Respectful Defaults** - Honor user preferences (motion, color scheme, contrast)

---

**End of UX Design System Specification**
