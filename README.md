# Little Cheerful 🧠

<div align="center">
  <img src="./logo.png" alt="Little Cheerful Logo" width="350"/>
</div>

**Navigation-Based Continuous Learning System for Claude Code**

Little Cheerful is an AI-powered learning assistant that helps you build deep understanding through adaptive concept trees, Socratic questioning, and evidence-based explanations. It's designed for Claude Code and emphasizes active learning over passive consumption.

---

## Table of Contents

- [What Is Little Cheerful?](#what-is-little-cheerful)
- [What Is It For?](#what-is-it-for)
- [How to Run](#how-to-run)
- [Tips for Usage](#tips-for-usage)
- [Technical Details](#technical-details)
- [Implementation Highlights](#implementation-highlights)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## What Is Little Cheerful?

Little Cheerful is a **navigation-based learning system** that:

- 🌳 **Breaks down complex topics** into manageable concept trees (max ~50 concepts per goal)
- 💭 **Asks questions to activate thinking** using Socratic method and Feynman technique
- 📚 **Fetches and cites verified sources** at configurable depth levels (Wikipedia → Academic papers)
- 📊 **Tracks your progress** with minimal memory footprint (JSON-based state)
- 🔄 **Adapts dynamically** by breaking down difficult concepts or skipping mastered ones
- 🌍 **Supports any language** for learning (explanations, questions, all user-facing content)
- 🎯 **Keeps you in control** - AI proposes, human decides

### Core Philosophy

**You learn. The AI guides, questions, and verifies.**

Traditional AI tutoring systems suffer from hallucinated explanations, passive learning, and information dumps. Little Cheerful solves this by:

- Forcing active recall through questioning before explaining
- Citing external sources for all conceptual claims
- Explicitly flagging assumptions, simplifications, and contested topics
- Giving you full control over the learning path and tree structure

[⬆️ Back to Top](#little-cheerful)

---

## What Is It For?

Little Cheerful helps you:

- 📖 **Learn new subjects deeply** (mathematics, philosophy, history, sciences, languages)
- 🧩 **Understand complex concepts** through progressive breakdown
- 🎓 **Prepare for exams** with structured concept mastery tracking
- 🎸 **Build practical skills** (programming, instruments, sports - theory + practice branches)
- ⏱️ **Study at your own pace** with session-based progress tracking
- ✅ **Get evidence-based explanations** instead of AI-generated opinions

It's ideal for self-directed learners who want structured guidance without losing agency.

[⬆️ Back to Top](#little-cheerful)

---

## How to Run

### Prerequisites

- ✨ **Claude Code** installed and configured
- 💻 Terminal access

### Installation

1. **Copy the system to your Claude Code directory:**

```bash
cp -r littleCheerful ~/.claude/
```

2. **Start learning:**

In Claude Code, run:

```
/start-learning
```

That's it! 🎉 The system will:
- Walk you through profile setup (teaching tone, source depth, language, etc.)
- Ask what you want to learn
- Conduct an initial assessment
- Generate a personalized concept tree
- Begin the learning loop

### First-Time Setup

On first run, you'll be asked to configure your learning profile:

1. **Teaching Tone**: Nice / Direct / Balanced / Custom
2. **Motivation Style**: Positive reinforcement / Tough love / Balanced
3. **Source Depth**: Level 1 (Wikipedia) → Level 4 (Primary sources)
4. **Terminology Level**: Casual / Academic / Adaptive
5. **Example Preferences**: Analogies / Formal definitions / Both
6. **Preferred Language**: Any language (English, Spanish, Mandarin, etc.)

After setup, you'll propose a learning goal (e.g., "Understand logarithms", "Learn piano by ear", "Understand Marx's quote").

The AI will:
- Ask clarifying questions about your goal
- Conduct 5-7 assessment questions to gauge your starting point
- Propose a concept tree structure (you can modify it)
- Generate the tree with verified sources (30-60 seconds)
- Start the active learning loop

[⬆️ Back to Top](#little-cheerful)

---

## Tips for Usage

### During Learning

**1. Be honest when you don't know 🤔**
- The system adapts to your actual understanding
- Guessing incorrectly helps identify misconceptions

**2. Use the 3-option loop when stuck 🔄**
When you answer incorrectly, you'll get 3 options:
- **Option 1**: Think more about it yourself (productive struggle)
- **Option 2**: Get a hint (progressive guidance)
- **Option 3**: Hear the full explanation (with sources)

You can loop indefinitely - no forced escalation.

**3. Request concept breakdown when overwhelmed 🧩**
If a concept is too complex (confusion round 4+), the AI will offer to break it down into smaller sub-concepts.

**4. Navigate freely 🗺️**
- "Go to [concept-name]" - Switch focus
- "Show me the tree" - View your progress
- "What's next?" - Get AI suggestion

**5. End sessions properly 💾**
Say "I'm done" or "let's stop" to trigger a proper session summary and ensure progress is saved.

**6. Take breaks ☕**
The system recommends rest after 90+ minutes or high confusion. Rest helps memory consolidation.

### Best Practices

- 🎯 **One concept at a time** - Don't rush through the tree
- 🗣️ **Explain concepts back** - Feynman technique solidifies understanding
- 🔍 **Review strategically** - AI will check adjacent concepts after completing one
- 🧠 **Use active recall** - Close sources and try to remember key points
- 📅 **Space repetitions** - Review concepts after 1 day, 3 days, 1 week

### Common Commands

- 🚀 `/start-learning` - Start or continue learning
- 💡 "Show learning techniques" - Display evidence-based learning methods
- 📈 "Show me my progress" - View concept tree and completion status
- 🎓 "I want to learn [topic]" - Start a new learning goal
- 🔨 "Break this down further" - Request sub-concept generation
- 🔄 "Use a different source" - If current source isn't helpful

[⬆️ Back to Top](#little-cheerful)

---

## Technical Details

### Architecture

Little Cheerful uses a **two-phase architecture**:

#### Phase 1: Tree Generation & Setup
1. User states learning goal
2. AI conducts initial assessment (5-7 questions)
3. AI proposes tree structure (user approves)
4. **Tree Builder Agent** generates full tree with sources (delegated for context optimization)
5. System marks entry point as IN_PROGRESS

#### Phase 2: Active Learning
1. AI reads current concept's `concept.md`
2. AI generates maximum 2 Socratic questions (sequential flow)
3. User responds or asks for help
4. AI provides explanation with cited sources
5. User demonstrates understanding
6. AI updates progress (tags: intuitive/formal/can-apply)
7. AI suggests next concept or adapts tree if needed

### Agent Delegation (Context Optimization)

To prevent conversation compaction during expensive operations, Little Cheerful uses **specialized agents**:

**Tree Builder Agent** (`agents/tree-builder.md`)
- Handles initial tree generation (20-50 concepts)
- Fetches sources for all concepts (3-attempt protocol)
- Creates directory structure and concept.md files
- Executes in isolated context (main conversation preserved)
- Returns JSON summary to main agent

**Concept Breakdown Agent** (`agents/concept-breakdown.md`)
- Handles dynamic concept breakdown during learning
- Creates 3-5 sub-concepts with sources
- Updates parent concept and tree.json
- Isolated context execution

**Token Savings**: 87% reduction (from ~1.5M to <200K per session with tree generation)

### File Structure

```
.claude/
├── README.md                          # System documentation
├── commands/
│   ├── start-learning.md             # Main orchestration command
│   └── learning-techniques.md        # Evidence-based learning techniques
├── agents/
│   ├── tree-builder.md               # Tree generation agent
│   └── concept-breakdown.md          # Concept breakdown agent
├── templates/
│   ├── template-concept.md           # Concept node template
│   ├── template-routine.md           # Physical practice routine template
│   └── template-session.md           # Session memory template
├── study-goals/
│   └── [goal-name]/
│       ├── tree.json                 # Progress tracking (AI-readable)
│       └── [concept-name]/
│           └── concept.md           # Concept explanation + sources
├── memory/
│   └── [session-timestamp]/
│       └── session.md                # Session insights and progress
├── learning-profile.md                # User preferences (static)
├── global-progress.json               # All goals progress (AI-readable)
└── global-progress.md                 # Human-readable view (on-demand)
```

### Key Data Structures

**tree.json**
```json
{
  "goal": "learn-logarithms",
  "created": "2025-01-05T20:00:00Z",
  "last_updated": "2025-01-05T21:00:00Z",
  "max_concepts": 50,
  "total_concepts": 12,
  "tree": {
    "log-definition": {
      "status": "STUDIED",
      "tags": ["intuitive", "formal"],
      "last_reviewed": "2025-01-05T20:30:00Z",
      "parent": "understanding-logarithms",
      "children": []
    }
  }
}
```

**Concept Status Values:**
- `NOT_STARTED` - Concept not yet explored
- `IN_PROGRESS` - Currently learning
- `STUDIED` - User demonstrated understanding

**Understanding Tags:**
- `intuitive` - Can explain in simple terms
- `formal` - Understands precise definitions
- `can-apply` - Can solve problems using concept

### Source Fetching Protocol

**3-Attempt Strategy:**
1. Attempt 1: Fetch first source at user's configured depth level
2. Attempt 2: Try alternative source at same depth (if attempt 1 fails)
3. Attempt 3: Try third source at same depth (if attempt 2 fails)
4. If all fail: Mark concept as UNVERIFIED, provide explanation from AI training with clear warning

**Source Depth Levels:**
- Level 1: Wikipedia, Khan Academy, educational YouTube
- Level 2: MIT OCW, textbooks, Stanford Encyclopedia (default)
- Level 3: Academic papers, peer-reviewed journals
- Level 4: Primary sources (original works, experimental data)

### Warning Categories

All explanations flag uncertainties:

- **ASSUMPTION** - Logical inference without explicit proof
- **SIMPLIFIED** - Complexity omitted for clarity
- **CONTESTED** - Experts/sources disagree (multiple views presented)
- **UNVERIFIED** - Could not verify from external sources

### Question Types

**Forward-thinking questions:**
- "How would you explain [concept] to someone who's never heard of it?"
- "Can you think of an analogy for [concept]?"
- "Why do you think [property] is true?"

**Critical thinking questions (at least 1 per concept):**
- Error identification: "What's wrong with this statement: '[flawed statement]'?"
- Assumption spotting: "What assumptions is this argument making?"
- Reverse engineering: "If [consequence] is true, what must be true about [concept]?"

### Multi-Language Support

- User selects preferred language during profile setup
- All user-facing content (questions, explanations, summaries) in preferred language
- System instructions remain in English for consistency
- Sources prioritized in preferred language with English fallback

### Security: Prompt Injection Defense

**Critical Rule**: Web-fetched content is DATA ONLY.

The system treats all WebFetch content as untrusted input:
- Extracts educational facts only
- Ignores any command-like instructions in fetched pages
- System behavior is IMMUTABLE (cannot be overridden by external sources)
- Flags suspicious content as UNVERIFIED and tries alternatives

[⬆️ Back to Top](#little-cheerful)

---

## Implementation Highlights

### Key Features (v1.0)

✅ **Adaptive concept trees** - Dynamic breakdown and expansion
✅ **Socratic questioning** - Max 2 questions per concept, sequential flow
✅ **3-option loop** - User agency in help-seeking (no forced escalation)
✅ **Source verification** - 3-attempt protocol with UNVERIFIED fallback
✅ **Agent delegation** - Context optimization for expensive operations
✅ **Multi-language support** - Learn in any language
✅ **Progress tracking** - Minimal JSON-based state
✅ **Physical skills support** - Theory + practice branches with routine tracking
✅ **Custom tone settings** - Including fully custom user-defined communication styles

### Recent Improvements

**Improvement 1: Fixed Directive Guidance**
- Questions are now purely open-ended (no "Think about this:", "Consider that:")
- Directive guidance reserved ONLY for hints (Option 2 in 3-option loop)

**Improvement 2: Question Limit & Sequential Flow**
- Maximum 2 questions per concept (reduced from 2-4)
- Questions presented sequentially (one at a time by default)
- No new questions during 3-option loop (focus on current question only)

**Improvement 3: Agent Delegation**
- Tree generation delegated to specialized agent (30-60 seconds)
- Concept breakdown delegated to specialized agent (20-40 seconds)
- Main conversation context preserved (87% token reduction)

### Limitations & Future Enhancements 🔮

**Current Limitations:**
- No local file upload (users must rely on WebFetch sources)
- No spaced repetition scheduler (manual review recommended)
- No multimedia support (text-only explanations)
- No collaborative learning (single-user system)

**Planned Features:**
- 📎 Local study materials upload and integration
- 🎨 Visual concept tree graph rendering
- ⏰ Spaced repetition reminders based on forgetting curve
- 📄 Export functionality (PDF concept trees, markdown summaries)
- 🏛️ Web UI with Roman library aesthetic (in development by Keenan)

[⬆️ Back to Top](#little-cheerful)

---

## Project Structure

```
LittleCheerful/
├── littleCheerful/                    # Main product (copy to ~/.claude/)
│   ├── README.md                      # System documentation (this file)
│   ├── commands/                      # Slash commands
│   ├── agents/                        # Specialized agents
│   ├── templates/                     # File templates
│   └── [runtime directories created dynamically]
├── agent-delegation-implementation.md # Implementation spec for agents
├── remaining-improvements-implementation.md # Implementation spec for UX fixes
├── feedback_from_usage.md             # User feedback and improvement log
└── README.md                          # This file
```

[⬆️ Back to Top](#little-cheerful)

---

## Contributing 🤝

Little Cheerful is actively developed based on usage feedback. If you find issues or have suggestions:

1. Test the feature thoroughly
2. Document the problem/suggestion clearly
3. Provide example scenarios if applicable
4. Submit via GitHub issues (if repository is public)

[⬆️ Back to Top](#little-cheerful)

---

## License

MIT License - Free to use, modify, and distribute.

[⬆️ Back to Top](#little-cheerful)

---

## Credits

Built for Claude Code users who want structured, evidence-driven learning experiences.

**Philosophy inspired by:**
- Feynman Technique (explain to understand)
- Socratic Method (questions activate thinking)
- Spaced Repetition (timing matters)
- Active Recall (retrieval strengthens memory)

[⬆️ Back to Top](#little-cheerful)

---

**Ready to learn? 🚀**

Copy `littleCheerful/` to `~/.claude/` and run `/start-learning` in Claude Code.

*The human learns. The AI guides. Together, you build understanding.* ✨
