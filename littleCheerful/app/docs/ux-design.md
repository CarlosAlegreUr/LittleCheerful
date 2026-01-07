# UX Design System - Little Cheerful

## Executive Summary

Little Cheerful is a learning assistant app designed around the metaphor of an **ancient Roman library** where a sentient oracle (manifested as an ancient book) guides learners through Socratic dialogue. The design philosophy emphasizes:

- **Immersive atmosphere**: Users feel transported to a scholar's sanctum
- **Warmth and wisdom**: The oracle is approachable, not intimidating
- **Visual hierarchy**: Ancient aesthetics with modern usability
- **Delight through detail**: Subtle animations bring the library to life

**Target Audience:** Learners of all ages seeking guided, conversational education
**Key Goal:** Make learning feel like an adventure in an enchanted library

---

## Design System

### Colors

#### Light Mode (Daylight Library)

**XAML Resource Format:**

```xml
<!-- Primary Background Colors -->
<Color x:Key="Parchment">#F4ECD8</Color>
<Color x:Key="ParchmentDark">#E8DCC4</Color>
<Color x:Key="ParchmentLight">#FAF5EA</Color>

<!-- Accent Colors - Crimson -->
<Color x:Key="Crimson">#8B0000</Color>
<Color x:Key="CrimsonLight">#B22222</Color>
<Color x:Key="CrimsonDark">#6B0000</Color>

<!-- Surface Colors - Marble -->
<Color x:Key="MarbleWhite">#F8F8FF</Color>
<Color x:Key="MarbleGray">#E8E8F0</Color>

<!-- Highlight Colors - Gold -->
<Color x:Key="GoldAccent">#DAA520</Color>
<Color x:Key="GoldLight">#FFD700</Color>
<Color x:Key="GoldDark">#B8860B</Color>

<!-- Text Colors -->
<Color x:Key="InkBlack">#1A1A1A</Color>
<Color x:Key="InkBrown">#3D2B1F</Color>

<!-- Semantic Colors -->
<Color x:Key="SuccessGold">#DAA520</Color>
<Color x:Key="ErrorInk">#4A0000</Color>
<Color x:Key="WarningAmber">#D4A017</Color>

<!-- Tag Colors -->
<Color x:Key="TagIntuitive">#6B8E23</Color>      <!-- Olive green -->
<Color x:Key="TagFormal">#4169E1</Color>         <!-- Royal blue -->
<Color x:Key="TagCanApply">#800080</Color>       <!-- Purple -->

<!-- Node Status Colors -->
<Color x:Key="NodeNotStarted">#C4B89E</Color>    <!-- Faded parchment -->
<Color x:Key="NodeInProgress">#DAA520</Color>    <!-- Gold -->
<Color x:Key="NodeStudied">#228B22</Color>       <!-- Forest green -->
```

#### Dark Mode (Nighttime Library)

```xml
<!-- Primary Background Colors -->
<Color x:Key="NightSky">#0D1B2A</Color>
<Color x:Key="NightSkyLight">#1B263B</Color>
<Color x:Key="NightSkyDark">#051015</Color>

<!-- Moonlight Accent -->
<Color x:Key="Moonlight">#C4D4E0</Color>
<Color x:Key="MoonlightBright">#E8F0F8</Color>
<Color x:Key="MoonlightDim">#8BA4B8</Color>

<!-- Warm Candlelight -->
<Color x:Key="Candlelight">#FFB347</Color>
<Color x:Key="CandlelightGlow">#FFD699</Color>
<Color x:Key="CandlelightDim">#CC8A30</Color>

<!-- Surface Colors - Night Marble -->
<Color x:Key="NightMarble">#1E2A3A</Color>
<Color x:Key="NightMarbleLight">#2A3A4A</Color>

<!-- Text Colors -->
<Color x:Key="MoonInk">#E8E8F0</Color>
<Color x:Key="MoonInkDim">#A8B8C8</Color>

<!-- Accent remains Crimson but lighter for contrast -->
<Color x:Key="CrimsonNight">#DC3545</Color>
<Color x:Key="CrimsonNightLight">#FF6B7A</Color>

<!-- Gold accents remain similar -->
<Color x:Key="GoldNight">#FFD700</Color>
```

**Color Usage Guidelines:**

| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page background | Parchment | NightSky |
| Card/Surface | MarbleWhite | NightMarble |
| Primary button | Crimson | CrimsonNight |
| Primary text | InkBlack | MoonInk |
| Secondary text | InkBrown | MoonInkDim |
| Success state | GoldAccent | GoldNight |
| Oracle speech | MarbleWhite | NightMarbleLight |
| User speech | ParchmentLight | NightSkyLight |

---

### Typography

**Font Families:**

```xml
<!-- Display Serif - For Titles and Oracle Speech -->
<OnPlatform x:Key="FontCinzel" x:TypeArguments="x:String">
    <On Platform="Android" Value="Cinzel-Regular.ttf#Cinzel" />
    <On Platform="iOS" Value="Cinzel" />
    <On Platform="WinUI" Value="Assets/Fonts/Cinzel-Regular.ttf#Cinzel" />
</OnPlatform>

<!-- Elegant Serif - For Body Text and Concepts -->
<OnPlatform x:Key="FontGaramond" x:TypeArguments="x:String">
    <On Platform="Android" Value="EBGaramond-Regular.ttf#EB Garamond" />
    <On Platform="iOS" Value="EB Garamond" />
    <On Platform="WinUI" Value="Assets/Fonts/EBGaramond-Regular.ttf#EB Garamond" />
</OnPlatform>

<!-- Readable Serif - For UI Labels -->
<OnPlatform x:Key="FontCrimsonText" x:TypeArguments="x:String">
    <On Platform="Android" Value="CrimsonText-Regular.ttf#Crimson Text" />
    <On Platform="iOS" Value="Crimson Text" />
    <On Platform="WinUI" Value="Assets/Fonts/CrimsonText-Regular.ttf#Crimson Text" />
</OnPlatform>
```

**Type Scale:**

| Style | Font | Size | Weight | Line Height | Use Case |
|-------|------|------|--------|-------------|----------|
| Display | Cinzel | 32sp | 600 | 1.2 | Page titles |
| H1 | Cinzel | 28sp | 600 | 1.25 | Section headers |
| H2 | Cinzel | 24sp | 500 | 1.3 | Card titles |
| H3 | EB Garamond | 20sp | 500 | 1.35 | Subsections |
| Body Large | EB Garamond | 18sp | 400 | 1.5 | Oracle messages |
| Body | EB Garamond | 16sp | 400 | 1.5 | General content |
| Body Small | EB Garamond | 14sp | 400 | 1.4 | Secondary text |
| Label | Crimson Text | 14sp | 500 | 1.3 | Button text |
| Caption | Crimson Text | 12sp | 400 | 1.2 | Tags, hints |

**XAML Style Definitions:**

```xml
<Style x:Key="DisplayText" TargetType="Label">
    <Setter Property="FontFamily" Value="{StaticResource FontCinzel}" />
    <Setter Property="FontSize" Value="32" />
    <Setter Property="FontAttributes" Value="Bold" />
    <Setter Property="TextColor" Value="{StaticResource InkBlack}" />
</Style>

<Style x:Key="OracleText" TargetType="Label">
    <Setter Property="FontFamily" Value="{StaticResource FontGaramond}" />
    <Setter Property="FontSize" Value="18" />
    <Setter Property="TextColor" Value="{StaticResource InkBrown}" />
    <Setter Property="LineBreakMode" Value="WordWrap" />
</Style>

<Style x:Key="ButtonText" TargetType="Label">
    <Setter Property="FontFamily" Value="{StaticResource FontCrimsonText}" />
    <Setter Property="FontSize" Value="14" />
    <Setter Property="FontAttributes" Value="Bold" />
    <Setter Property="TextColor" Value="{StaticResource MarbleWhite}" />
</Style>
```

---

### Spacing

**Base Unit:** 8dp

| Token | Value | Use Case |
|-------|-------|----------|
| xs | 4dp | Inline spacing, icon gaps |
| sm | 8dp | Tight padding, list items |
| md | 16dp | Standard padding, card content |
| lg | 24dp | Section spacing |
| xl | 32dp | Page margins |
| xxl | 48dp | Hero spacing |

**XAML Thickness Resources:**

```xml
<Thickness x:Key="PaddingXS">4</Thickness>
<Thickness x:Key="PaddingSM">8</Thickness>
<Thickness x:Key="PaddingMD">16</Thickness>
<Thickness x:Key="PaddingLG">24</Thickness>
<Thickness x:Key="PaddingXL">32</Thickness>
<Thickness x:Key="PaddingXXL">48</Thickness>

<Thickness x:Key="PageMargin">24,32,24,24</Thickness>
<Thickness x:Key="CardPadding">16</Thickness>
<Thickness x:Key="ChatBubblePadding">12,10</Thickness>
```

---

### Corner Radius

```xml
<CornerRadius x:Key="RadiusSM">4</CornerRadius>
<CornerRadius x:Key="RadiusMD">8</CornerRadius>
<CornerRadius x:Key="RadiusLG">12</CornerRadius>
<CornerRadius x:Key="RadiusXL">16</CornerRadius>
<CornerRadius x:Key="RadiusRound">24</CornerRadius>
```

---

### Shadows and Elevation

```xml
<!-- Card Shadow -->
<Shadow x:Key="CardShadow"
        Brush="{StaticResource InkBrown}"
        Offset="2,4"
        Radius="8"
        Opacity="0.15" />

<!-- Elevated Shadow (buttons, floating elements) -->
<Shadow x:Key="ElevatedShadow"
        Brush="{StaticResource InkBrown}"
        Offset="4,6"
        Radius="12"
        Opacity="0.2" />

<!-- Inner Glow (success states) -->
<Shadow x:Key="GoldenGlow"
        Brush="{StaticResource GoldLight}"
        Offset="0,0"
        Radius="16"
        Opacity="0.4" />
```

---

## Page Specifications

### 1. SurpriseKeenanPage

**Purpose:** Easter egg welcome screen shown only on first launch

**Layout:**

```
+------------------------------------------+
|                                          |
|                                          |
|         [Animated Book Opening]          |
|                                          |
|                                          |
|        "SURPRISE KEENAN!"                |
|         (Display style, gold)            |
|                                          |
|         [Sparkle particles]              |
|                                          |
|        "Your journey awaits..."          |
|         (Body style, fade in)            |
|                                          |
|         [Continue Button]                |
|                                          |
+------------------------------------------+
```

**Visual Elements:**

- Background: Deep parchment with radial gradient (darker at edges)
- Centered ancient book graphic that animates open
- Title in Cinzel font, GoldLight color, with subtle glow
- Floating sparkle/star particles animating around book
- Subtitle fades in after book opens

**Animations:**

1. Book cover flip animation (Y-axis rotation, 800ms)
2. Pages flutter open (sequential page turns, 200ms each)
3. Title scales up from 0 with spring effect (500ms)
4. Sparkles continuously float upward (particle system)
5. Subtitle fade-in (300ms, delayed 1000ms)

**States:**

- Initial: Book closed, no text
- After 500ms: Book opens
- After 1300ms: Title appears
- After 1600ms: Subtitle appears
- After 3000ms: Continue button fades in

---

### 2. OnboardingPage

**Purpose:** 6-step wizard to establish learner profile

**Layout:**

```
+------------------------------------------+
|  [Step Indicator: I  II  III  IV  V  VI] |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |  [Scroll Card - Current Step]      |  |
|  |                                    |  |
|  |  Step Title (H2)                   |  |
|  |  "How would you like me to..."     |  |
|  |                                    |  |
|  |  [ Option A - Radio/Card ]         |  |
|  |  [ Option B - Radio/Card ]         |  |
|  |  [ Option C - Radio/Card ]         |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  [Back]                     [Continue]   |
+------------------------------------------+
```

**Step Content:**

| Step | Roman | Title | Options |
|------|-------|-------|---------|
| 1 | I | Teaching Tone | Encouraging, Neutral, Challenging |
| 2 | II | Motivation Style | Praise, Curiosity, Goals |
| 3 | III | Source Depth | Simplified, Balanced, Detailed |
| 4 | IV | Terminology Level | Plain Language, Some Jargon, Technical |
| 5 | V | Example Preference | Real-world, Abstract, Code-like |
| 6 | VI | Language | English, Spanish, French, etc. |

**Visual Elements:**

- Step indicator uses Roman numerals in circles
- Active step: Gold fill, white text
- Completed step: Green check overlay
- Inactive step: Parchment fill, gray text
- Options presented as selectable scroll cards
- Selected option has gold border and subtle glow

**Transitions:**

- Horizontal slide between steps (300ms, ease-out)
- Scroll card unfurls when entering step (400ms)
- Selection causes option card to glow briefly (200ms)

---

### 3. HomePage

**Purpose:** Library entrance and navigation hub

**Layout:**

```
+------------------------------------------+
|                                          |
|  [Candle]                      [Candle]  |
|                                          |
|           [Oracle Book Image]            |
|                                          |
|     "The Oracle awaits your inquiry..."  |
|           (Cinzel, centered)             |
|                                          |
|  +------------------------------------+  |
|  | Current Goal:                      |  |
|  | "Learn Calculus Fundamentals"      |  |
|  | Progress: [=========>     ] 65%    |  |
|  +------------------------------------+  |
|                                          |
|     [Begin New Journey]                  |
|                                          |
|     [Continue Learning]  (if active)     |
|                                          |
|  [Materials]              [Settings]     |
|                                          |
+------------------------------------------+
```

**Visual Elements:**

- Animated candles in top corners (flicker effect)
- Oracle book image: ornate leather-bound tome
- Ambient particle effects (dust motes floating)
- Goal card only visible if active goal exists
- Progress bar styled as golden illuminated track

**States:**

- No active goal: Only "Begin New Journey" button
- Active goal: Goal card + both buttons visible
- First visit: Subtle tutorial overlay pointing to "Begin"

---

### 4. GoalCreationPage

**Purpose:** Define new learning goal

**Layout:**

```
+------------------------------------------+
|  [Back Arrow]           "Inscribe Goal"  |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |  [Scroll Unfurling Animation]      |  |
|  |                                    |  |
|  |  "What knowledge do you seek?"     |  |
|  |                                    |  |
|  |  +------------------------------+  |  |
|  |  |                              |  |  |
|  |  |  [Text Input Area]           |  |  |
|  |  |  "e.g., I want to learn..."  |  |  |
|  |  |                              |  |  |
|  |  +------------------------------+  |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|            [Inscribe Goal]               |
|            (Quill icon + text)           |
|                                          |
+------------------------------------------+
```

**Visual Elements:**

- Page appears with scroll unfurling from top
- Input area styled as parchment with ink-stained edges
- Placeholder text in italic, lighter ink color
- Submit button styled as crimson with quill icon
- Decorative quill and inkwell illustration nearby

**Validation:**

- Empty input: Button disabled, faded
- Valid input: Button enabled, subtle pulse animation
- Submitting: Quill writing animation, "Inscribing..." text

---

### 5. TreePage

**Purpose:** Visualize concept hierarchy and progress

**Layout:**

```
+------------------------------------------+
|  [Back]    "Knowledge Tree"    [Legend]  |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |        [Root Node]                 |  |
|  |            |                       |  |
|  |     +------+------+                |  |
|  |     |             |                |  |
|  | [Child 1]    [Child 2]             |  |
|  |     |             |                |  |
|  |  [Leaf]    +------+------+         |  |
|  |           |             |          |  |
|  |       [Leaf]        [Leaf]         |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  Tags: [intuitive] [formal] [can-apply]  |
|                                          |
|  [Current: "Derivatives"] [Go to Node]   |
|                                          |
+------------------------------------------+
```

**Visual Elements:**

- Background: Papyrus texture with subtle vine border
- Nodes styled as laurel leaves
- Connection lines: vine/branch appearance
- Node status indicated by color fill and icon:
  - NotStarted: Faded parchment, empty circle
  - InProgress: Gold fill, half-circle
  - Studied: Green fill, checkmark
- Tags appear as colored chips below node label
- Current node has golden glow border
- Collapsible branches with +/- toggle

**Interactions:**

- Tap node: Show detail popup or navigate to session
- Pinch zoom: Scale tree view
- Pan: Scroll large trees
- Double-tap: Center on node

**Legend Popup:**

```
Status:
  [Gray circle] Not Started
  [Gold half] In Progress
  [Green check] Studied

Tags:
  [Olive] Intuitive understanding
  [Blue] Formal definition
  [Purple] Can apply in practice
```

---

### 6. SessionPage

**Purpose:** Main Socratic dialogue interface

**Layout:**

```
+------------------------------------------+
|  [Back]    "Session"    [Tree] [End]     |
|                                          |
|  [Candle]                      [Candle]  |
|                                          |
|  +------------------------------------+  |
|  |  [Oracle Bubble - Left]            |  |
|  |  "Let us explore this concept..."  |  |
|  |                                    |  |
|  |            [User Bubble - Right]   |  |
|  |            "I think it means..."   |  |
|  |                                    |  |
|  |  [Oracle Bubble - Left]            |  |
|  |  "Interesting. But consider..."    |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | [Option Loop Panel - if active]    |  |
|  |                                    |  |
|  | "I noticed you're stuck. Choose:"  |  |
|  |                                    |  |
|  | [Think More] [Get Hint] [Explain]  |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | [Text Input] ............. [Send]  |  |
|  +------------------------------------+  |
+------------------------------------------+
```

**Visual Elements:**

- Reading alcove atmosphere: darker edges, warm center
- Animated candles in top corners
- Chat area scrollable, bottom-aligned
- Oracle bubbles: Marble white, left-aligned, serif font
- User bubbles: Light parchment, right-aligned, slightly smaller
- Option loop panel slides up when triggered
- Send button: Crimson circle with quill/feather icon

**Chat Bubble Details:**

- Oracle bubble:
  - Rounded corners (12dp)
  - Left tail indicator
  - MarbleWhite background
  - Subtle drop shadow
  - Max width: 80%

- User bubble:
  - Rounded corners (12dp)
  - Right tail indicator
  - ParchmentLight background
  - Max width: 75%

**Option Loop Panel:**

- Appears when oracle detects confusion/mistake
- Three options in horizontal row
- Each option is a RomanButton variant
- Selection dismisses panel and continues dialogue

**Loading State:**

- Quill writing animation (3 dots appear sequentially)
- Displayed in Oracle bubble position

---

### 7. MaterialsPage

**Purpose:** Upload and manage study materials

**Layout:**

```
+------------------------------------------+
|  [Back]         "Materials"              |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |     [Open Book Illustration]       |  |
|  |                                    |  |
|  |  +------------------------------+  |  |
|  |  |                              |  |  |
|  |  |  Drag files here or tap     |  |  |
|  |  |  to browse                   |  |  |
|  |  |                              |  |  |
|  |  |  [Book Icon]                 |  |  |
|  |  |                              |  |  |
|  |  +------------------------------+  |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  Materials Index:                        |
|  +------------------------------------+  |
|  | [PDF] calculus_notes.pdf      [x]  |  |
|  | [TXT] chapter_summary.txt     [x]  |  |
|  | [IMG] diagram.png             [x]  |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

**Visual Elements:**

- Header: Open book graphic spanning width
- Drop zone: Styled as blank book pages
- Dashed border when waiting for files
- Solid golden border when file dragged over
- File list styled as book index (indented, serif font)
- File type icons match aesthetic (scroll for PDF, quill for text)

**Animations:**

- Page turn effect when file uploads (Y-axis rotation)
- File appears in list with fade-in slide
- Delete shows ink blot over item before removal

**States:**

- Empty: "Your library is empty. Add materials..."
- Uploading: Page turn animation + progress
- Error: Ink blot overlay with error message
- Success: Golden glow pulse on new item

---

### 8. SettingsPage

**Purpose:** Profile and app configuration

**Layout:**

```
+------------------------------------------+
|  [Back]         "Settings"               |
|                                          |
|  +------------------------------------+  |
|  | Administrator's Desk Header       |  |
|  +------------------------------------+  |
|                                          |
|  Learning Profile                        |
|  +------------------------------------+  |
|  | Teaching Tone: Encouraging    [>]  |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Motivation: Praise-based      [>]  |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Source Depth: Balanced        [>]  |  |
|  +------------------------------------+  |
|  ... (more profile settings)             |
|                                          |
|  API Configuration                       |
|  +------------------------------------+  |
|  | API Key: ********             [>]  |  |
|  +------------------------------------+  |
|                                          |
|  Theme                                   |
|  +------------------------------------+  |
|  | [Day Library] [Night Library]      |  |
|  +------------------------------------+  |
|                                          |
|  [Reset Profile]  [Export Data]          |
|                                          |
+------------------------------------------+
```

**Visual Elements:**

- Header: Administrator's desk illustration (quill, inkwell, papers)
- Settings grouped in scroll cards
- Each setting row shows current value + chevron
- Theme toggle: Visual preview of day/night modes
- Danger buttons (Reset) use crimson with warning icon

**Interactions:**

- Tap setting row: Navigate to detail/edit page
- Theme toggle: Instant preview switch
- Reset: Confirmation dialog with ink blot overlay

---

## Custom Controls

### 1. ScrollCard

**Description:** Container styled as an aged parchment scroll with worn edges

**Visual Specifications:**

```
+--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--+
|  ~                                   ~  |
|                                         |
|     [Content Area]                      |
|                                         |
|  ~                                   ~  |
+--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--+
```

- Background: ParchmentLight
- Border: Subtle worn-edge texture (achieved via 9-slice image or shader)
- Corner radius: 4dp (slight, scrolls are mostly rectangular)
- Padding: 16dp internal
- Shadow: CardShadow

**States:**

| State | Visual Change |
|-------|---------------|
| Normal | Standard appearance |
| Selected | Gold border (2dp), GoldenGlow shadow |
| Disabled | Opacity 0.5, no shadow |

**XAML Structure:**

```xml
<Frame BackgroundColor="{StaticResource ParchmentLight}"
       BorderColor="Transparent"
       CornerRadius="4"
       Padding="16"
       HasShadow="True">
    <!-- Optional: worn-edge overlay image -->
    <ContentView>
        <!-- Content slot -->
    </ContentView>
</Frame>
```

---

### 2. RomanButton

**Description:** Primary action button with crimson fill and gold border

**Visual Specifications:**

```
+================================+
|                                |
|      BUTTON TEXT               |
|                                |
+================================+
```

- Background: Crimson
- Border: Gold (1.5dp)
- Corner radius: 8dp
- Height: 48dp (standard), 56dp (large)
- Text: Crimson Text font, white, uppercase, letter-spacing 1.5
- Shadow: ElevatedShadow

**States:**

| State | Background | Border | Shadow |
|-------|-----------|--------|--------|
| Normal | Crimson | GoldDark | ElevatedShadow |
| Hover/Focus | CrimsonLight | GoldAccent | ElevatedShadow enlarged |
| Pressed | CrimsonDark | GoldDark | No shadow (flat) |
| Disabled | Gray (#9E9E9E) | Gray | None |

**Variants:**

- **Primary:** Standard crimson
- **Secondary:** Transparent background, crimson border, crimson text
- **Danger:** Same as primary (crimson is already warning-appropriate)

**XAML Structure:**

```xml
<Button BackgroundColor="{StaticResource Crimson}"
        BorderColor="{StaticResource GoldDark}"
        BorderWidth="1.5"
        CornerRadius="8"
        HeightRequest="48"
        FontFamily="{StaticResource FontCrimsonText}"
        TextColor="{StaticResource MarbleWhite}"
        TextTransform="Uppercase"
        CharacterSpacing="1.5">
    <Button.Shadow>
        <Shadow ... />
    </Button.Shadow>
</Button>
```

---

### 3. ChatBubble

**Description:** Message container for dialogue, styled as parchment/marble scroll

**Visual Specifications:**

**Oracle Variant (Left):**

```
    +---------------------------+
   /                            |
  |  Oracle message text here   |
  |  with serif font styling    |
   \                            |
    +---------------------------+
```

- Background: MarbleWhite
- Corner radius: 12dp (except bottom-left: 4dp for tail)
- Alignment: Left
- Max width: 80%
- Font: EB Garamond, 18sp
- Text color: InkBrown
- Padding: 12dp horizontal, 10dp vertical

**User Variant (Right):**

```
+---------------------------+
|                            \
|   User message text here    |
|   with body font styling    |
|                            /
+---------------------------+
```

- Background: ParchmentLight
- Corner radius: 12dp (except bottom-right: 4dp for tail)
- Alignment: Right
- Max width: 75%
- Font: EB Garamond, 16sp
- Text color: InkBlack
- Padding: 12dp horizontal, 10dp vertical

**States:**

| State | Visual Change |
|-------|---------------|
| Normal | Standard appearance |
| Sending | Opacity 0.7, loading indicator |
| Error | Red border, retry icon |

---

### 4. OptionLoop

**Description:** 3-option choice panel for Socratic intervention

**Visual Specifications:**

```
+------------------------------------------+
|                                          |
|  "I notice you might need guidance."     |
|                                          |
|  [Think More]  [Get Hint]  [Explain]     |
|                                          |
+------------------------------------------+
```

- Background: ParchmentDark with marble texture overlay
- Border: Gold top border (2dp)
- Corner radius: 12dp top corners only (slides up from bottom)
- Padding: 16dp
- Shadow: Upward shadow (inverted ElevatedShadow)

**Button Specifications:**

- Three equal-width buttons in horizontal row
- Gap: 12dp between buttons
- Style: RomanButton secondary variant
- Icons: Thought bubble, Lightbulb, Book

**Animation:**

- Slides up from bottom (300ms, ease-out)
- Buttons fade in sequentially (100ms stagger)
- Selection causes button to pulse gold, then panel slides down

---

### 5. ConceptNode

**Description:** Tree node representing a concept, styled as laurel leaf

**Visual Specifications:**

```
    ___
   /   \
  / Txt \
  \     /
   \___/
```

- Shape: Pointed oval (leaf shape) or rounded rectangle with pointed ends
- Size: 80dp width minimum, height auto
- Background: Based on status (see colors)
- Border: InkBrown, 1dp
- Text: Crimson Text, 12sp, centered

**Status Indicators:**

| Status | Fill | Icon | Border |
|--------|------|------|--------|
| NotStarted | NodeNotStarted | Empty circle | InkBrown |
| InProgress | NodeInProgress (gold) | Half-filled circle | GoldDark |
| Studied | NodeStudied (green) | Checkmark | Green |

**Tags Display:**

- Small colored dots (6dp) below node text
- Colors: TagIntuitive, TagFormal, TagCanApply

**States:**

| State | Visual Change |
|-------|---------------|
| Normal | Standard appearance |
| Focused/Current | GoldenGlow border, scale 1.05 |
| Hover | Slight lift (shadow enlarges) |
| Collapsed | Opacity 0.6, expand icon |

---

### 6. TagChip

**Description:** Small labeled badge for concept categorization

**Visual Specifications:**

```
+------------+
| intuitive  |
+------------+
```

- Height: 24dp
- Padding: 8dp horizontal, 4dp vertical
- Corner radius: 12dp (pill shape)
- Font: Crimson Text, 11sp
- Text: White

**Variants:**

| Variant | Background | Use |
|---------|-----------|-----|
| Intuitive | TagIntuitive (olive) | Conceptual understanding |
| Formal | TagFormal (royal blue) | Formal definition |
| CanApply | TagCanApply (purple) | Practical application |

---

### 7. StepIndicator

**Description:** Roman numeral progress indicator for wizards

**Visual Specifications:**

```
  (I)  --  (II)  --  (III)  --  (IV)  --  (V)  --  (VI)
  [*]      [*]       [ ]        [ ]       [ ]       [ ]
```

- Circle size: 36dp diameter
- Font: Cinzel, 14sp
- Connection line: 2dp height, spans gap between circles

**Circle States:**

| State | Fill | Text Color | Border |
|-------|------|-----------|--------|
| Completed | NodeStudied | White | None |
| Active | GoldAccent | InkBlack | GoldDark (2dp) |
| Inactive | ParchmentLight | InkBrown | InkBrown (1dp) |

**Completed Overlay:**

- Small checkmark icon in bottom-right corner
- White on green background

---

### 8. CandleFlicker

**Description:** Decorative animated candle element

**Visual Specifications:**

```
    )
   (*)    <- Flame
    |
   [ ]    <- Candle body
```

- Candle body: Simple rectangle, cream/off-white
- Flame: Gradient orange to yellow
- Holder: Gold/brass colored base

**Animation:**

- Flame opacity oscillates: 0.7 to 1.0
- Duration: Random between 100ms and 300ms
- Timing: Randomized per candle (no sync)
- Subtle flame shape distortion (optional: scale Y 0.95-1.05)

---

### 9. FileDropZone

**Description:** Drag-and-drop area styled as open book pages

**Visual Specifications:**

```
+------------------+------------------+
|                  |                  |
|    [Left page]   |   [Right page]   |
|                  |                  |
|     Tap or       |    to add        |
|     drag files   |    materials     |
|                  |                  |
+------------------+------------------+
```

- Background: ParchmentLight
- Border: Dashed, InkBrown (2dp dash, 4dp gap)
- Spine: Vertical line with shadow in center
- Corner radius: 4dp outer corners only
- Content: Centered icon + instructional text

**States:**

| State | Visual Change |
|-------|---------------|
| Empty | Dashed border, book icon |
| Hover/DragOver | Solid gold border, background brightens |
| Uploading | Progress indicator, page turn animation |
| Error | Red border, ink blot overlay |

---

### 10. ProgressOrb

**Description:** Circular progress indicator with golden aesthetic

**Visual Specifications:**

```
    ____
   /    \
  | 65%  |
   \____/
```

- Size: 64dp diameter (standard), 48dp (compact)
- Track: ParchmentDark, 4dp width
- Progress: Gold gradient (GoldDark to GoldLight)
- Text: Cinzel, centered, InkBlack
- Shadow: Subtle GoldenGlow when progress > 0

**Animation:**

- Progress fills clockwise from top
- Duration: 500ms for changes
- Easing: ease-in-out
- At 100%: Golden pulse animation

---

## Animation Specifications

### 1. Candle Flicker

**Purpose:** Ambient life to the library atmosphere

```
Property: Opacity
From: 0.7
To: 1.0
Duration: Random(100ms, 300ms)
Easing: Linear
Repeat: Infinite, autoreverse
Randomization: Each candle instance has independent timing
```

**Implementation Notes:**

- Do not synchronize candles
- Consider reducing animation on low-power mode
- Flame position can also subtly shift (translateX: -1 to 1dp)

---

### 2. Page Turn

**Purpose:** Material upload, scroll transitions

```
Property: RotationY
From: 0
To: 180
Duration: 500ms
Easing: Ease-in-out
Perspective: 1000 (depth effect)
```

**Sequence:**

1. Page begins rotation (0-90deg): Current content visible
2. At 90deg: Switch content
3. Continue rotation (90-180deg): New content visible
4. Optional: Slight bounce at end

---

### 3. Golden Glow (Success)

**Purpose:** Positive feedback, selection confirmation

```
Property: Shadow.Radius and Shadow.Opacity
From: Radius 8, Opacity 0.2
To: Radius 20, Opacity 0.5
Duration: 300ms
Easing: Ease-out
Color: GoldLight
Repeat: Once (or pulse twice for emphasis)
```

---

### 4. Ink Blot (Error)

**Purpose:** Error indication with thematic consistency

```
Property: Opacity (of ink overlay)
From: 0
To: 0.8
Duration: 200ms
Easing: Ease-in

Visual: Dark ink splash SVG/image positioned over error source
```

**Sequence:**

1. Ink blot fades in rapidly
2. Holds for 2000ms with error message
3. Fades out (300ms) when dismissed

---

### 5. Quill Loading

**Purpose:** Indicate oracle is "writing" response

```
Three dots appearing sequentially:
  Dot 1: Opacity 0->1 (200ms)
  Delay: 200ms
  Dot 2: Opacity 0->1 (200ms)
  Delay: 200ms
  Dot 3: Opacity 0->1 (200ms)
  Then all reset to 0, repeat
```

**Alternative:** Single quill icon with writing motion (translateX oscillation)

---

### 6. Scroll Unfurl

**Purpose:** Reveal scroll content dramatically

```
Property: Height (or ScaleY)
From: 0 (or 0.0)
To: Auto (or 1.0)
Duration: 400ms
Easing: Ease-out
Origin: Top center
```

**Enhanced Version:**

1. Top edge appears and holds (100ms)
2. Content reveals downward (300ms)
3. Slight bounce at bottom (100ms)

---

### 7. Sparkle Particle

**Purpose:** Magical atmosphere on special screens

```
Property: TranslateY, Opacity, Scale
Motion: Float upward, fade out
Duration: 2000-4000ms (randomized)
Count: 10-20 particles
Spawn: Random positions within container
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Layout Adjustments |
|------------|-------|-------------------|
| Phone Portrait | < 600dp | Single column, stacked navigation |
| Phone Landscape | 600-800dp | Two-column where appropriate |
| Tablet | 800-1200dp | Side panel navigation, wider content |
| Desktop | > 1200dp | Fixed max-width content (1000dp), centered |

### Layout Adaptations

**SessionPage:**

- Phone: Full-width chat, input at bottom
- Tablet: Chat with side panel showing current concept
- Desktop: Three-column (tree | chat | concept detail)

**TreePage:**

- Phone: Vertical tree, scrollable, zoom controls
- Tablet/Desktop: Full canvas with pan/zoom

**OnboardingPage:**

- Phone: Full-screen steps
- Tablet: Card centered, decorative margins

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast Requirements

| Element | Foreground | Background | Ratio | Status |
|---------|-----------|-----------|-------|--------|
| Body text | InkBlack #1A1A1A | Parchment #F4ECD8 | 12.5:1 | Pass |
| Body text | InkBrown #3D2B1F | Parchment #F4ECD8 | 8.2:1 | Pass |
| Button text | MarbleWhite #F8F8FF | Crimson #8B0000 | 7.8:1 | Pass |
| Gold on Parchment | GoldDark #B8860B | Parchment #F4ECD8 | 3.1:1 | Pass (large) |
| Night mode text | MoonInk #E8E8F0 | NightSky #0D1B2A | 13.2:1 | Pass |

### Focus Indicators

- All interactive elements: 2dp gold border on focus
- High contrast mode: 3dp black border
- Focus visible on keyboard navigation
- Skip links for screen readers

### Screen Reader Support

- Semantic headings hierarchy (H1 > H2 > H3)
- Alt text for all decorative images
- ARIA labels for icon-only buttons
- Live regions for dynamic content (chat messages)
- Announcements for loading states

### Motion Considerations

```xml
<!-- Respect reduced motion preference -->
<Animation Duration="{OnIdiom
    Default=500,
    ReducedMotion=0}" />
```

- Provide option to disable decorative animations
- Keep functional animations (loading indicators) with reduced intensity
- No auto-playing video or flashing content

### Touch Targets

- Minimum 48dp x 48dp for all interactive elements
- 8dp minimum spacing between targets
- Buttons extend full width on phone where appropriate

### Text Scaling

- Support up to 200% text scaling
- Layouts adapt without horizontal scrolling
- Long text truncates with ellipsis where necessary

---

## Dark Mode Details

### Transition

- Instant switch (no animation)
- Persist preference in local storage
- Respect system preference as default

### Visual Adjustments

**Images and Icons:**

- Invert decorative parchment textures
- Candle flames remain warm (orange/yellow)
- Book illustrations gain subtle blue moonlight tint
- Shadow colors become lighter (subtle highlight effect)

**Elevation:**

- In light mode: Darker shadows below
- In dark mode: Lighter highlights above (simulating moonlight from above)

**Accent Colors:**

- Crimson becomes slightly lighter for visibility
- Gold remains similar (naturally high contrast)
- Success green shifts slightly bluer

### Automatic Switching

```xml
<!-- Optional: Time-based theme -->
<AppShell>
    <AppShell.Resources>
        <ResourceDictionary Source="{OnIdiom
            Default=LightTheme.xaml,
            SunsetToSunrise=DarkTheme.xaml}" />
    </AppShell.Resources>
</AppShell>
```

---

## Icon Library

### Required Icons (suggested style: outlined, elegant)

| Icon | Use | Style Notes |
|------|-----|-------------|
| Quill | Send button, input | Angled, flowing |
| Book (closed) | Oracle avatar | Ornate, leather-bound |
| Book (open) | Materials, learning | Spread pages |
| Scroll | Cards, messages | Rolled ends |
| Candle | Decoration | Simple, classic |
| Laurel | Tree nodes, success | Wreath or branch |
| Inkwell | Input areas | With quill |
| Thought bubble | Think option | Classic cloud shape |
| Lightbulb | Hint option | Oil lamp style |
| Checkmark | Completion | Elegant serif check |
| Arrow (back) | Navigation | Simple, thin |
| Chevron | List items | Right-pointing |
| Gear | Settings | Classic cog |
| Plus | Add actions | Simple cross |
| X (close) | Dismiss, delete | Elegant cross |

### Icon Sizing

| Context | Size |
|---------|------|
| Navigation | 24dp |
| Button inline | 20dp |
| List item | 24dp |
| Hero/decorative | 48-64dp |
| Tab bar | 28dp |

---

## Error States

### Patterns

**Inline Errors:**

- Text below input field
- Color: ErrorInk (#4A0000)
- Icon: Small ink blot or warning
- Text: Crimson Text, 12sp

**Toast Errors:**

- Slide in from bottom
- Background: ErrorInk with opacity
- Text: White
- Duration: 4000ms
- Dismissible

**Full-Screen Errors:**

- Ink blot illustration
- "Something went awry..." heading
- Descriptive message
- Retry button

### Error Messages (Thematic)

| Technical | Thematic |
|-----------|----------|
| Network error | "The oracle's connection has been disrupted..." |
| Validation error | "The inscription is incomplete..." |
| Server error | "The ancient texts are momentarily unavailable..." |
| Not found | "This scroll has not yet been written..." |
| Timeout | "The oracle ponders too long. Please try again..." |

---

## Loading States

### Skeleton Screens

- Parchment-colored rectangles
- Subtle shimmer animation (left to right)
- Match expected content layout

### Progress Indicators

- **Indeterminate:** Quill writing animation
- **Determinate:** ProgressOrb with percentage
- **Inline:** Three-dot sequence

### Full-Page Loading

```
+------------------------------------------+
|                                          |
|           [Candle animations]            |
|                                          |
|          [Animated book/scroll]          |
|                                          |
|        "Consulting the archives..."      |
|               ...                        |
|                                          |
+------------------------------------------+
```

---

## Appendix: Font Files Required

1. **Cinzel-Regular.ttf** - Google Fonts (free)
2. **Cinzel-Bold.ttf** - Google Fonts (free)
3. **EBGaramond-Regular.ttf** - Google Fonts (free)
4. **EBGaramond-Italic.ttf** - Google Fonts (free)
5. **CrimsonText-Regular.ttf** - Google Fonts (free)
6. **CrimsonText-Bold.ttf** - Google Fonts (free)

All fonts are available under SIL Open Font License.

---

## Appendix: Asset List

### Images

- `book_closed.png` - Oracle avatar (multiple sizes)
- `book_open.png` - Reading state
- `parchment_texture.png` - Tileable background
- `scroll_edges.9.png` - 9-slice for scroll cards
- `candle.png` - Static candle (for non-animated fallback)
- `inkblot_error.png` - Error overlay
- `laurel_leaf.png` - Tree node shape
- `quill_inkwell.png` - Decorative element
- `desk_header.png` - Settings page header

### Lottie Animations (Recommended)

- `candle_flicker.json` - Animated candle
- `page_turn.json` - Book page flip
- `quill_writing.json` - Loading animation
- `sparkles.json` - Magical particles
- `scroll_unfurl.json` - Scroll reveal

---

*Document Version: 1.0*
*Created: 2026-01-06*
*Author: UX Architect Agent*
