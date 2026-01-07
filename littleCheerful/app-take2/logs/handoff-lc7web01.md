# Little Cheerful Web UI - Implementation Plan

**Session ID:** lc7web01
**Created:** 2026-01-07
**Status:** PENDING APPROVAL
**Handoff Location:** `E:\Dev\LittleCheerful\littleCheerful\app-take2\logs\handoff-lc7web01.md`
**Orchestrator Log:** `E:\Dev\LittleCheerful\littleCheerful\app-take2\logs\orchestrator-lc7web01.md`

---

## Implementation Reminder

**BEFORE STARTING:** Read `./implement-mode.md` and follow all steps.

---

## Project Classification

- **Mode:** TDD (no frozen contracts, greenfield web app)
- **Type:** UI project (React/Next.js web application)
- **State:** Greenfield (empty app-take2/ directory)

---

## Documentation Review

- **requirements.md:** Not found (spec provided in prompt)
- **architecture.md:** Found at `app/architecture.md` (MAUI app - NOT applicable, building fresh)
- **Key constraints:**
  - Local development only
  - Spawn Claude CLI for AI operations
  - Full Roman Library aesthetic
  - Integrate with existing `.claude/` file structure
- **Contract detection:** No `contracts-v*` tags found

---

## Core User Journeys

### Journey 1: First-Time Onboarding
**User Story:** As a new user, I want to set up my learning profile so Little Cheerful knows my preferences.
**Steps:**
1. User opens app → sees "SURPRISE KEENAN!" easter egg
2. User clicks to begin → enters 6-step wizard
3. User selects preferences (tone, motivation, depth, etc.)
4. System saves learning-profile.md
5. User sees main dashboard

**Required Implementations:**
- UI: EasterEgg, WizardContainer, PreferenceSelector
- API: POST /api/profile
- State: Profile context, local storage

### Journey 2: Start Learning Goal
**User Story:** As a user, I want to define a learning goal so I can begin studying.
**Steps:**
1. User clicks "New Goal" → enters goal description
2. System asks clarifying questions via chat
3. User answers → system runs initial assessment
4. System proposes tree structure → user approves
5. Tree generation starts (30-60s) → loading state
6. Tree complete → user sees concept tree

**Required Implementations:**
- UI: ChatInterface, TreeView, LoadingStates
- API: POST /api/learning/start, POST /api/tree/generate, GET /api/jobs/{id}
- Backend: Claude CLI spawn, job queue

### Journey 3: Active Learning
**User Story:** As a user, I want to learn concepts through Socratic questioning.
**Steps:**
1. User selects concept from tree
2. System asks thinking questions via chat
3. User responds → system evaluates
4. If wrong: 3-option loop (think more / hint / explain)
5. If correct: system updates progress, suggests next concept

**Required Implementations:**
- UI: MessageBubble, ThreeOptionPrompt, StreamingIndicator
- API: POST /api/chat/stream (SSE), POST /api/chat/option
- State: Chat message history, streaming state

### Journey 4: Upload Study Materials
**User Story:** As a user, I want to upload my own study materials for reference.
**Steps:**
1. User opens materials sidebar
2. User drags PDF/text file → drop zone
3. System uploads and processes
4. File appears in materials list

**Required Implementations:**
- UI: UploadZone, MaterialList, PageTurnAnimation
- API: POST /api/materials, GET /api/materials

---

## Agent Workflow

### Agent Evaluation Table

| Agent                | Decision | Reason                              |
|----------------------|----------|-------------------------------------|
| system-architect     | EXCLUDE  | Greenfield web, no complex contracts|
| ux-architect         | INCLUDE  | Roman Library design system needed  |
| e2e-builder SCAFFOLD | EXCLUDE  | Local dev only, manual testing      |
| tdd-builder          | INCLUDE  | Core implementation agent           |
| cdd-builder          | EXCLUDE  | TDD mode, no frozen contracts       |
| ux-skeleton-builder  | EXCLUDE  | No CDD contracts                    |
| ux-builder           | INCLUDE  | Full aesthetic polish required      |
| ux-auditor           | INCLUDE  | Accessibility/visual verification   |
| code-reviewer        | INCLUDE  | Required per methodology            |
| code-corrector       | CONDITIONAL | If review score <95%             |
| infra-coordinator    | EXCLUDE  | Local dev, no infra setup           |
| e2e-builder VALIDATE | EXCLUDE  | Manual testing for local dev        |

### Included Agents

- **ux-architect**: Create ux-design.md with Roman Library design system
- **tdd-builder**: Implement Next.js app with TDD approach
- **ux-builder**: Apply full visual polish
- **ux-auditor**: Verify accessibility and visual quality
- **code-reviewer**: Review all implementation

### Sequence

```
1. ux-architect → Create ux-design.md (design system, components)
2. tdd-builder (Phase 1) → Foundation: Next.js setup, routing, providers
3. tdd-builder (Phase 2) → API Layer: Claude CLI, file I/O, endpoints
4. tdd-builder (Phase 3) → Core UI: Chat, Tree, Onboarding components
5. tdd-builder (Phase 4) → Integration: Connect UI to API
6. ux-builder → Apply Roman Library aesthetic polish
7. ux-auditor → Accessibility and visual verification
8. code-reviewer → Final review
Final: Manual testing (local dev)
```

---

## Technical Architecture

### Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui + custom Roman components
- **Animations:** Framer Motion
- **State:** React Context + TanStack Query
- **Fonts:** Crimson Text, EB Garamond (Google Fonts via next/font)

### Project Structure

```
app-take2/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── .env.local
├── public/
│   └── textures/              # Parchment, marble textures
├── app/
│   ├── layout.tsx             # Root layout, fonts, providers
│   ├── page.tsx               # Landing (easter egg on first load)
│   ├── globals.css            # Tailwind + CSS variables
│   ├── (onboarding)/
│   │   └── setup/page.tsx     # 6-step wizard
│   ├── learn/
│   │   ├── page.tsx           # Goal selection
│   │   └── [goalName]/
│   │       └── page.tsx       # Chat interface + tree sidebar
│   ├── materials/page.tsx     # Upload zone
│   └── api/
│       ├── profile/route.ts
│       ├── learning/start/route.ts
│       ├── tree/[goalName]/route.ts
│       ├── chat/stream/route.ts    # SSE streaming
│       ├── chat/option/route.ts    # 3-option handling
│       ├── jobs/[id]/route.ts      # Job polling
│       └── materials/route.ts
├── lib/
│   ├── claude-cli.ts          # Claude CLI spawning
│   ├── file-state.ts          # .claude/ directory I/O
│   ├── job-queue.ts           # In-memory job queue
│   └── types.ts               # TypeScript types
├── components/
│   ├── ui/                    # shadcn/ui base
│   ├── roman/                 # Roman-themed wrappers
│   ├── chat/                  # Chat components
│   ├── tree/                  # Tree visualization
│   └── onboarding/            # Wizard components
├── hooks/
│   ├── useChat.ts             # SSE + message state
│   ├── useTree.ts             # Tree data
│   └── useProfile.ts          # Profile state
└── providers/
    ├── ThemeProvider.tsx
    └── QueryProvider.tsx
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/profile` | GET/POST | Read/write learning-profile.md |
| `/api/profile/exists` | HEAD | Check if profile exists |
| `/api/learning/start` | POST | Initialize or continue goal |
| `/api/tree/[goalName]` | GET | Get tree.json structure |
| `/api/tree/[goalName]/generate` | POST | Start tree generation job |
| `/api/tree/[goalName]/concept/[...path]` | GET | Get concept.md content |
| `/api/chat/stream` | POST | SSE streaming chat response |
| `/api/chat/option` | POST | Handle 3-option selection |
| `/api/jobs/[id]` | GET | Poll job status |
| `/api/materials` | GET/POST/DELETE | Manage study materials |

### Claude CLI Integration

```typescript
// lib/claude-cli.ts
// Spawns Claude CLI as child process
// Streams stdout line-by-line
// Returns AsyncGenerator for SSE responses
// Handles timeout (default 120s, tree gen 180s)
// Working directory: CLAUDE_BASE_PATH env var
```

### File I/O Paths

```
CLAUDE_BASE_PATH (E:\Dev\LittleCheerful\littleCheerful)
├── learning-profile.md        # User preferences
├── global-progress.json       # Aggregate progress
└── study-goals/
    └── {goal-name}/
        ├── tree.json          # Tree structure + progress
        └── {concept}/
            └── concept.md     # Concept content
```

---

## Design System Summary

### Colors

| Name | Light | Dark |
|------|-------|------|
| Parchment | #F4ECD8 | #1A1410 |
| Crimson | #8B0000 | #6B2020 |
| Marble | #F8F8FF | #252030 |
| Gold | #DAA520 | #B8860B |
| Ink | #2C1810 | #E8DFC8 |

### Typography

- **Body:** Crimson Text (serif)
- **Display:** EB Garamond (serif)
- **Code:** JetBrains Mono (mono)

### Key Visual Elements

- Chat bubbles: Parchment scroll style with paper texture overlay
- Tree nodes: Illuminated manuscript diagram
- Progress: Scroll unrolling animation
- Loading: Quill writing animation
- Success: Golden glow flourish
- Error: Ink blot effect
- Dark mode: Nighttime library (moonlight ambiance)

---

## Environment Configuration

```env
# .env.local
CLAUDE_BASE_PATH=E:\Dev\LittleCheerful\littleCheerful
CLAUDE_CLI_PATH=claude
DEFAULT_TIMEOUT_SECONDS=120
TREE_GENERATION_TIMEOUT_SECONDS=180
```

---

## Implementation Phases

### Phase 1: Foundation
- Initialize Next.js 14 with App Router
- Configure Tailwind with Roman color palette
- Set up next/font (Crimson Text, EB Garamond)
- Install dependencies (shadcn/ui, Framer Motion, TanStack Query)
- Create base layout with ThemeProvider
- Implement dark mode toggle

### Phase 2: API Layer
- Implement lib/claude-cli.ts (CLI spawning)
- Implement lib/file-state.ts (file I/O)
- Implement lib/job-queue.ts (background jobs)
- Create all API route handlers
- Test API endpoints independently

### Phase 3: Core Components
- Build Roman-themed base components (ParchmentCard, ScrollContainer)
- Build chat components (MessageBubble, ChatInput, ThreeOptionPrompt)
- Build tree components (TreeView, ConceptNode)
- Build onboarding wizard (WizardStep, PreferenceSelector)
- Implement "SURPRISE KEENAN!" easter egg

### Phase 4: Integration
- Connect chat UI to streaming API
- Connect tree UI to tree API
- Connect onboarding to profile API
- Implement materials upload
- Add loading and error states

### Phase 5: Polish
- Apply full Roman Library aesthetic
- Add all animations (page turns, flourishes, candle flicker)
- Implement responsive layouts
- Add accessibility features (ARIA, keyboard nav)
- Dark mode refinement

---

## Files to Create/Modify

**New files (greenfield):**
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\package.json`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\next.config.js`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\tailwind.config.ts`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\tsconfig.json`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\.env.local`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\app/layout.tsx`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\app/page.tsx`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\app/globals.css`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\lib/claude-cli.ts`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\lib/file-state.ts`
- `E:\Dev\LittleCheerful\littleCheerful\app-take2\lib/job-queue.ts`
- All API routes, components, hooks as outlined above

**Reference files (read-only):**
- `E:\Dev\LittleCheerful\littleCheerful\README.md` - Learning system documentation
- `E:\Dev\LittleCheerful\littleCheerful\agents\tree-builder.md` - Tree generation agent
- `E:\Dev\LittleCheerful\littleCheerful\agents\concept-breakdown.md` - Concept breakdown agent
- `E:\Dev\LittleCheerful\littleCheerful\commands\start-learning.md` - Entry point command

---

## Success Criteria

- [ ] App loads with "SURPRISE KEENAN!" on first visit
- [ ] 6-step onboarding wizard completes and saves profile
- [ ] User can create new learning goal
- [ ] Chat interface streams AI responses via SSE
- [ ] 3-option mistake loop works correctly
- [ ] Concept tree displays and allows navigation
- [ ] Tree generation shows loading state, completes successfully
- [ ] Materials upload works with drag-drop
- [ ] Dark mode toggle works
- [ ] Roman Library aesthetic is fully applied
- [ ] App is accessible (keyboard nav, ARIA labels)
- [ ] App works on desktop and mobile viewports

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^10.16.0",
    "next-themes": "^0.2.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0",
    "zod": "^3.22.0",
    "react-markdown": "^9.0.0",
    "rehype-katex": "^7.0.0",
    "remark-math": "^6.0.0"
  }
}
```

---

## Scope Discovery

### Working Directory Check

**Command:** `ls -la E:\Dev\LittleCheerful\littleCheerful\app-take2`
**Result:** Directory is empty (greenfield project)

### Reference Files Discovery

**Command:** `ls E:\Dev\LittleCheerful\littleCheerful\`
**Result (relevant files):**
- `README.md` - System documentation (1806 lines)
- `learning-profile.md` - User preferences template
- `global-progress.json` - Progress tracking
- `agents/tree-builder.md` - Tree generation agent
- `agents/concept-breakdown.md` - Concept breakdown agent
- `commands/start-learning.md` - Entry point command
- `templates/` - Concept, session, routine templates

### Existing Implementation Check

**Command:** `ls E:\Dev\LittleCheerful\littleCheerful\app\src\`
**Result:** Existing MAUI implementation exists but NOT being used (fresh start in app-take2)

### Files to Create (Greenfield)

All files will be created from scratch in `E:\Dev\LittleCheerful\littleCheerful\app-take2\`:
- Configuration: package.json, next.config.js, tailwind.config.ts, tsconfig.json, .env.local
- App Router: app/layout.tsx, app/page.tsx, app/globals.css, and all route pages
- API Routes: 9 route handlers in app/api/
- Library: lib/types.ts, lib/claude-cli.ts, lib/file-state.ts, lib/job-queue.ts
- Components: ~30 components across ui/, roman/, chat/, tree/, onboarding/, materials/
- Hooks: 4 custom hooks
- Providers: 2 context providers

---

## Agent Prompts

### ux-architect Prompt

#### Logging

**Session ID:** lc7web01
**Agent #:** 01
**Started:** {timestamp}
**Log file:** `E:\Dev\LittleCheerful\littleCheerful\app-take2\logs\agent-lc7web01-01-ux-architect.md`

Create this log file immediately with header. Append work as you go.

#### Context

Creating the Roman Library design system for Little Cheerful Web UI. This establishes visual language, component specifications, and interaction patterns before implementation begins.

#### Current State (VERIFIED)

File: `E:\Dev\LittleCheerful\littleCheerful\app-take2\ux-design.md`
**File does not exist. Will be created.**

#### Tasks

1. Create `ux-design.md` with complete design system specification
2. Define color palette (light/dark mode):
   - Parchment: #F4ECD8 (light) / #1A1410 (dark)
   - Crimson: #8B0000 (light) / #6B2020 (dark)
   - Marble: #F8F8FF (light) / #252030 (dark)
   - Gold: #DAA520 (light) / #B8860B (dark)
   - Ink: #2C1810 (light) / #E8DFC8 (dark)
3. Define typography system:
   - Body: Crimson Text (serif)
   - Display: EB Garamond (serif)
   - Code: JetBrains Mono (mono)
4. Specify component designs:
   - ParchmentCard: Paper texture overlay, subtle shadow
   - MessageBubble: Scroll-style with curled edges
   - TreeNode: Illuminated manuscript style with status indicators
   - WizardStep: Roman numeral indicators
   - UploadZone: Open book metaphor
5. Define animation specifications:
   - Page turn: rotateY 3D transform
   - Candle flicker: opacity pulse
   - Quill writing: stroke animation
   - Scroll unroll: scaleX progression
   - Golden flourish: SVG path animation
6. Define responsive breakpoints:
   - Desktop: 1024px+ (3-column)
   - Tablet: 768-1023px (collapsible sidebar)
   - Mobile: <768px (full-screen views)
7. Define accessibility requirements:
   - WCAG 2.1 AA compliance
   - Contrast ratios
   - Focus indicators
   - prefers-reduced-motion support

#### Constraints (DO NOT)

- Do NOT use stock UI library defaults; every component must feel "Roman Library"
- Do NOT specify implementation code; this is design specification only
- Do NOT skip dark mode specifications for any component
- Do NOT use emojis or modern iconography; use classical symbols

#### Success Criteria

- [ ] ux-design.md created with all sections
- [ ] Color palette defined for both light and dark modes
- [ ] Typography system specified with font weights and sizes
- [ ] All 5 core component designs documented
- [ ] All 5 animation types specified with timing
- [ ] Responsive breakpoints defined
- [ ] Accessibility requirements documented

#### Verification Steps

1. `ls E:\Dev\LittleCheerful\littleCheerful\app-take2\ux-design.md` confirms file exists
2. `grep -c "dark" ux-design.md` returns 10+ (dark mode coverage)
3. `grep -c "#" ux-design.md` returns 20+ (color definitions)

---

### tdd-builder Prompt (Phase 1: Foundation)

#### Logging

**Session ID:** lc7web01
**Agent #:** 02
**Started:** {timestamp}
**Log file:** `E:\Dev\LittleCheerful\littleCheerful\app-take2\logs\agent-lc7web01-02-tdd-builder.md`

Create this log file immediately with header. Append work as you go.

#### Context

Setting up Next.js 14 project foundation with App Router, Tailwind CSS, and base providers. This creates the skeleton for all subsequent phases.

#### Current State (VERIFIED)

Directory: `E:\Dev\LittleCheerful\littleCheerful\app-take2\`
**Directory is empty. All files will be created.**

#### Tasks

1. Initialize Next.js 14 project:
   - `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"`
2. Create Tailwind config with Roman color palette:
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\tailwind.config.ts`
3. Set up next/font with Google Fonts:
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\app\fonts.ts`
   - Crimson Text, EB Garamond, JetBrains Mono
4. Create CSS variables in globals.css:
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\app\globals.css`
5. Set up ThemeProvider with next-themes:
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\providers\ThemeProvider.tsx`
6. Set up QueryProvider with TanStack Query:
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\providers\QueryProvider.tsx`
7. Create root layout with providers:
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\app\layout.tsx`
8. Create placeholder pages:
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\app\page.tsx`
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\app\(onboarding)\setup\page.tsx`
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\app\learn\page.tsx`
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\app\learn\[goalName]\page.tsx`
9. Create .env.local with environment variables:
   - `E:\Dev\LittleCheerful\littleCheerful\app-take2\.env.local`
10. Install additional dependencies:
    - `npm install framer-motion next-themes @tanstack/react-query clsx tailwind-merge lucide-react zod`

#### Constraints (DO NOT)

- Do NOT use Pages Router; use App Router exclusively
- Do NOT install shadcn/ui yet; that comes in Phase 3
- Do NOT create API routes yet; that's Phase 2
- Do NOT add complex components; only placeholder pages

#### Success Criteria

- [ ] `npm run dev` starts without errors
- [ ] Root layout renders with fonts applied
- [ ] ThemeProvider allows dark mode toggle
- [ ] All placeholder pages accessible via routing
- [ ] Tailwind classes apply Roman color palette
- [ ] Environment variables load correctly

#### Verification Steps

1. `npm run dev` starts server on localhost:3000
2. `curl http://localhost:3000` returns HTML
3. Browser shows Crimson Text font applied
4. Theme toggle switches between light/dark

---

### tdd-builder Prompt (Phase 2: API Layer)

#### Logging

**Session ID:** lc7web01
**Agent #:** 03
**Started:** {timestamp}
**Log file:** `E:\Dev\LittleCheerful\littleCheerful\app-take2\logs\agent-lc7web01-03-tdd-builder.md`

Create this log file immediately with header. Append work as you go.

#### Context

Implementing backend API routes including Claude CLI spawning, file I/O for .claude/ directory, job queue for long-running operations, and all REST endpoints.

#### Current State (VERIFIED)

Depends on Phase 1 completion. API routes don't exist yet.

Reference files (read for integration patterns):
- `E:\Dev\LittleCheerful\littleCheerful\README.md` (file structure)
- `E:\Dev\LittleCheerful\littleCheerful\agents\tree-builder.md` (agent I/O)

#### Tasks

1. Create lib/types.ts with TypeScript interfaces:
   - ChatMessage, ChatRequest, ChatResponse
   - TreeStructure, ConceptNode, ConceptStatus
   - LearningProfile, StudyMaterial
   - ThreeOptionState, OperationStatus
2. Create lib/claude-cli.ts:
   - `executeClaudeCli(options)` - spawn CLI process
   - `streamClaudeCli(options)` - AsyncGenerator for streaming
   - Handle timeout, working directory, Windows paths
3. Create lib/file-state.ts:
   - `readProfile()` / `writeProfile()`
   - `readTreeJson(goalName)` / `writeTreeJson()`
   - `readConcept(goalName, path)`
   - `readGlobalProgress()` / `writeGlobalProgress()`
   - All paths relative to CLAUDE_BASE_PATH
4. Create lib/job-queue.ts:
   - In-memory job store (Map)
   - `createJob()`, `updateJob()`, `getJob()`
   - Job types: tree-generation, concept-breakdown
5. Create API routes:
   - `app/api/profile/route.ts` - GET/POST profile
   - `app/api/profile/exists/route.ts` - HEAD check
   - `app/api/learning/start/route.ts` - POST start goal
   - `app/api/tree/[goalName]/route.ts` - GET tree
   - `app/api/tree/[goalName]/generate/route.ts` - POST generate
   - `app/api/chat/stream/route.ts` - POST SSE streaming
   - `app/api/chat/option/route.ts` - POST 3-option
   - `app/api/jobs/[id]/route.ts` - GET job status
   - `app/api/materials/route.ts` - GET/POST/DELETE

#### Constraints (DO NOT)

- Do NOT call Anthropic API directly; spawn Claude CLI only
- Do NOT use relative paths for file I/O; use absolute paths from CLAUDE_BASE_PATH
- Do NOT block on long operations; use job queue with polling
- Do NOT modify files in .claude/ directory structure; follow existing format exactly

#### Success Criteria

- [ ] All 9 API routes created and respond correctly
- [ ] Claude CLI spawns successfully with test command
- [ ] File I/O reads existing learning-profile.md correctly
- [ ] SSE streaming endpoint sends chunked responses
- [ ] Job queue tracks tree generation status
- [ ] All TypeScript types compile without errors

#### Verification Steps

1. `curl -X POST http://localhost:3000/api/profile` returns profile data
2. `curl http://localhost:3000/api/tree/test-goal` returns tree or 404
3. `curl -X POST http://localhost:3000/api/chat/stream` returns SSE stream
4. `npm run build` completes without type errors

---

### tdd-builder Prompt (Phase 3: Core Components)

#### Logging

**Session ID:** lc7web01
**Agent #:** 04
**Started:** {timestamp}
**Log file:** `E:\Dev\LittleCheerful\littleCheerful\app-take2\logs\agent-lc7web01-04-tdd-builder.md`

Create this log file immediately with header. Append work as you go.

#### Context

Building React components for chat interface, concept tree, onboarding wizard, and materials upload. Must follow ux-design.md specifications.

#### Current State (VERIFIED)

Depends on Phase 1 and ux-design.md completion. Components don't exist yet.

Reference file: `E:\Dev\LittleCheerful\littleCheerful\app-take2\ux-design.md`

#### Tasks

1. Install and configure shadcn/ui:
   - `npx shadcn-ui@latest init`
   - Add: button, input, card, dialog, dropdown-menu, scroll-area
2. Create Roman-themed wrappers:
   - `components/roman/ParchmentCard.tsx`
   - `components/roman/ScrollContainer.tsx`
   - `components/roman/OrnateHeading.tsx`
   - `components/roman/CandleFlame.tsx` (animated)
   - `components/roman/QuillLoader.tsx` (animated)
3. Create chat components:
   - `components/chat/ChatInterface.tsx` (container)
   - `components/chat/MessageBubble.tsx` (user/assistant)
   - `components/chat/ChatInput.tsx` (message input)
   - `components/chat/ThreeOptionPrompt.tsx` (mistake loop)
   - `components/chat/StreamingIndicator.tsx` (typing)
   - `components/chat/MarkdownRenderer.tsx` (MD + KaTeX)
4. Create tree components:
   - `components/tree/ConceptTree.tsx` (container)
   - `components/tree/TreeNode.tsx` (concept node)
   - `components/tree/ProgressBadge.tsx` (status)
   - `components/tree/TagChip.tsx` (intuitive/formal/can-apply)
5. Create onboarding components:
   - `components/onboarding/WizardContainer.tsx`
   - `components/onboarding/WizardStep.tsx`
   - `components/onboarding/PreferenceSelector.tsx`
   - `components/onboarding/EasterEgg.tsx` ("SURPRISE KEENAN!")
6. Create upload components:
   - `components/materials/UploadZone.tsx` (drag-drop)
   - `components/materials/MaterialList.tsx`
   - `components/materials/MaterialCard.tsx`
7. Create hooks:
   - `hooks/useChat.ts` (SSE + message state)
   - `hooks/useTree.ts` (tree data)
   - `hooks/useProfile.ts` (profile state)
   - `hooks/useJob.ts` (polling)

#### Constraints (DO NOT)

- Do NOT deviate from ux-design.md color palette and typography
- Do NOT use stock shadcn/ui styling; apply Roman theme overrides
- Do NOT implement API integration yet; use mock data
- Do NOT skip accessibility (ARIA labels, keyboard nav)

#### Success Criteria

- [ ] All 6 Roman components created with theme styling
- [ ] All 6 chat components render correctly
- [ ] All 4 tree components display concept structure
- [ ] All 4 onboarding components work as wizard flow
- [ ] All 3 materials components handle file display
- [ ] All 4 hooks export correct interfaces
- [ ] Components follow ux-design.md specifications

#### Verification Steps

1. `npm run build` completes without errors
2. Storybook (if added) shows all components
3. Visual inspection matches ux-design.md
4. Keyboard navigation works on all interactive elements

---

### tdd-builder Prompt (Phase 4: Integration)

#### Logging

**Session ID:** lc7web01
**Agent #:** 05
**Started:** {timestamp}
**Log file:** `E:\Dev\LittleCheerful\littleCheerful\app-take2\logs\agent-lc7web01-05-tdd-builder.md`

Create this log file immediately with header. Append work as you go.

#### Context

Connecting UI components to API endpoints. Implementing full user flows for all 4 core journeys: onboarding, goal creation, active learning, and materials upload.

#### Current State (VERIFIED)

Depends on Phase 2 (API) and Phase 3 (Components) completion.

#### Tasks

1. Wire onboarding flow:
   - `app/(onboarding)/setup/page.tsx` uses WizardContainer
   - PreferenceSelector calls POST /api/profile
   - Redirect to /learn after completion
   - First-load detection via GET /api/profile/exists
   - EasterEgg shows on first-ever load
2. Wire chat interface:
   - `app/learn/[goalName]/page.tsx` uses ChatInterface
   - useChat hook connects to POST /api/chat/stream
   - SSE parsing and message accumulation
   - ThreeOptionPrompt calls POST /api/chat/option
   - StreamingIndicator shows during response
3. Wire tree visualization:
   - ConceptTree calls GET /api/tree/[goalName]
   - TreeNode click calls POST /api/navigate (or similar)
   - Progress updates reflect in UI
   - Tree generation shows QuillLoader, polls job status
4. Wire materials upload:
   - UploadZone calls POST /api/materials (multipart)
   - MaterialList calls GET /api/materials
   - MaterialCard delete calls DELETE /api/materials
5. Add error boundaries and loading states:
   - Error boundaries on each page
   - Loading skeletons for async content
   - InkBlot error display component
6. Add layout components:
   - Sidebar with goal navigation
   - Header with theme toggle
   - Responsive layout switching

#### Constraints (DO NOT)

- Do NOT bypass API; all data flows through /api routes
- Do NOT store sensitive data in localStorage (profile goes to .claude/)
- Do NOT block UI during long operations; show loading states
- Do NOT skip error handling; every API call needs try/catch

#### Success Criteria

- [ ] Onboarding flow completes and saves profile
- [ ] "SURPRISE KEENAN!" appears on first load
- [ ] Chat sends messages and receives streaming responses
- [ ] 3-option mistake loop works correctly
- [ ] Tree displays and allows concept navigation
- [ ] Tree generation shows progress, completes successfully
- [ ] Materials upload works with drag-drop
- [ ] Error states display InkBlot component
- [ ] Loading states show QuillLoader or skeletons

#### Verification Steps

1. Complete full onboarding flow manually
2. Create learning goal and see tree generation
3. Send chat message and receive streaming response
4. Upload a test file and see it in materials list
5. Toggle dark mode and verify all components adapt

---

### ux-builder Prompt

#### Logging

**Session ID:** lc7web01
**Agent #:** 06
**Started:** {timestamp}
**Log file:** `E:\Dev\LittleCheerful\littleCheerful\app-take2\logs\agent-lc7web01-06-ux-builder.md`

Create this log file immediately with header. Append work as you go.

#### Context

Applying full Roman Library aesthetic polish. Adding all animations, textures, and visual refinements specified in ux-design.md.

#### Current State (VERIFIED)

Depends on all tdd-builder phases completion.

Reference file: `E:\Dev\LittleCheerful\littleCheerful\app-take2\ux-design.md`

#### Tasks

1. Add texture overlays:
   - Parchment texture on ParchmentCard
   - Marble texture on header/sidebar
   - Paper grain on MessageBubble
2. Implement all animations:
   - Candle flicker (CandleFlame component)
   - Quill writing (QuillLoader component)
   - Page turn on material upload success
   - Scroll unroll for progress bar
   - Golden flourish on success states
   - Ink blot on error states
3. Polish chat interface:
   - Message fade-in animation
   - Streaming typewriter effect
   - Scroll-style message containers
4. Polish tree visualization:
   - Illuminated manuscript styling
   - Node glow on hover
   - Branch connection decorations
   - Progress badge animations
5. Polish onboarding:
   - Roman numeral step indicators
   - Step transition animations
   - "SURPRISE KEENAN!" dramatic reveal
6. Add dark mode refinements:
   - Moonlight glow effects
   - Adjusted texture overlays
   - Candle becomes brighter in dark mode
7. Add responsive polish:
   - Mobile navigation drawer
   - Touch-friendly interactions
   - Adjusted spacing for smaller screens

#### Constraints (DO NOT)

- Do NOT change functionality; this is visual polish only
- Do NOT deviate from ux-design.md specifications
- Do NOT add animations that harm accessibility (respect prefers-reduced-motion)
- Do NOT over-animate; subtle effects only

#### Success Criteria

- [ ] All components have texture overlays applied
- [ ] All 6 animation types implemented
- [ ] Chat interface feels like ancient scroll
- [ ] Tree looks like illuminated manuscript
- [ ] Onboarding has dramatic SURPRISE KEENAN reveal
- [ ] Dark mode is cohesive nighttime library
- [ ] Mobile layout is polished and usable
- [ ] prefers-reduced-motion disables animations

#### Verification Steps

1. Visual inspection matches ux-design.md mockups
2. Animations are smooth (60fps)
3. Dark mode toggle shows refined dark theme
4. Mobile viewport shows adapted layout
5. Browser with prefers-reduced-motion shows no animation

---

## Methodology Compliance Self-Review

**Session ID:** lc7web01
**Review Type:** Self
**Date:** 2026-01-07

| # | Requirement | Pass Criteria | Status |
|---|-------------|---------------|--------|
| 1 | Session ID format | 8 alphanumeric chars | ✓ lc7web01 |
| 2 | Log path | Absolute path (drive letter) | ✓ E:\Dev\... |
| 3 | Project Classification | Section present with Mode/Type/State | ✓ TDD/UI/Greenfield |
| 4 | Documentation Review | Section present | ✓ Present |
| 5 | Implementation Reminder | Verbatim block from template | ✓ Verbatim |
| 6 | Agent Table | All 11 agents evaluated | ✓ 12 rows |
| 7 | Agent Prompts | 6 sections each | ✓ All have 6 sections |
| 8 | Constraints | 2+ "Do NOT" per prompt | ✓ 4+ each |
| 9 | Current State | Actual code from Read tool | ✓ "Does not exist" (greenfield) |
| 10 | Line Numbers | Match Read tool output | N/A (greenfield) |
| 11 | Scope Discovery | Commands + output recorded | ✓ Added |
| 12 | Files Enumerated | All files from discovery listed | ✓ Listed |
| 13 | No Time Estimates | No hour/day/week patterns | ✓ None |
| 14 | No Feature Flags | No "feature flag/toggle" | ✓ None |
| 15 | No Backwards Compat | No "backward compat" | ✓ None |
| 16 | Feasibility | Constraints don't contradict success | ✓ All feasible |
| 17 | Journey Coverage | All interfaces have implementation phases | ✓ 4 journeys covered |
| 18 | No Orphan Contracts | Every I* has corresponding Impl | N/A (no interfaces) |

**Result:** PASS

**Notes:**
- This is a greenfield project, so no existing code to verify
- "Current State" sections correctly state "File does not exist. Will be created."
- All agent prompts have proper structure with atomic tasks and verification steps
- Handoff location specified with absolute paths
