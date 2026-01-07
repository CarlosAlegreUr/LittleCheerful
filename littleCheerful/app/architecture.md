# Little Cheerful - Architecture

**Version:** 1.0
**Status:** FROZEN
**Created:** 2026-01-06

---

## System Overview

Little Cheerful is a navigation-based learning system that uses AI-powered tutoring to guide users through structured learning trees. The system consists of three main components:

1. **LittleCheerful.Contracts** - Shared interfaces and DTOs (this layer)
2. **LittleCheerful.Api** - ASP.NET Core Web API (backend)
3. **LittleCheerful.Maui** - Windows MAUI desktop application (frontend)

### Architecture Diagram

```
+----------------------+     HTTP/REST     +----------------------+
|                      | <---------------> |                      |
|  LittleCheerful.Maui |                   |  LittleCheerful.Api  |
|  (Windows Desktop)   |                   |  (ASP.NET Core)      |
|                      |                   |                      |
+----------------------+                   +----------+-----------+
                                                      |
                                                      | Process spawn
                                                      v
                                           +----------------------+
                                           |                      |
                                           |     Claude CLI       |
                                           |   (AI Operations)    |
                                           |                      |
                                           +----------------------+
```

---

## Contracts Layer

### Service Interfaces

#### **IChatService**

Provides chat-based learning interactions with the AI tutor.

| Method | Purpose |
|--------|---------|
| `SendMessageAsync` | Send a message and receive complete response |
| `StreamMessageAsync` | Send a message and stream response chunks |
| `HandleMistakeOptionAsync` | Handle three-option mistake flow selection |

**Consumer:** MAUI client via HTTP
**Provider:** API controllers

---

#### **ITreeService**

Manages the learning tree structure and concept navigation.

| Method | Purpose |
|--------|---------|
| `GetCurrentTreeAsync` | Get tree structure for a goal |
| `GenerateTreeAsync` | Generate new tree using AI (long-running) |
| `GetConceptAsync` | Get specific concept details |
| `NavigateToConceptAsync` | Navigate to concept, update progress |

**Consumer:** MAUI client via HTTP
**Provider:** API controllers

---

#### **IProfileService**

Manages the user's learning profile and preferences.

| Method | Purpose |
|--------|---------|
| `GetProfileAsync` | Get current profile |
| `SaveProfileAsync` | Save or update profile |
| `ProfileExistsAsync` | Check if profile exists |

**Consumer:** MAUI client via HTTP
**Provider:** API controllers

---

#### **IStudyMaterialsService**

Manages study materials uploaded by the user.

| Method | Purpose |
|--------|---------|
| `UploadMaterialAsync` | Upload a study material file |
| `GetMaterialsAsync` | Get all materials for a goal |
| `DeleteMaterialAsync` | Delete a material |

**Consumer:** MAUI client via HTTP
**Provider:** API controllers

---

#### **IClaudeCliService** (Internal)

Executes Claude CLI commands for AI-powered operations.

| Method | Purpose |
|--------|---------|
| `ExecuteAsync` | Execute CLI command |
| `ExecuteWithTimeoutAsync` | Execute with specific timeout |

**Consumer:** API services
**Provider:** API infrastructure (process spawning)

**Note:** This service is internal to the API and not exposed to clients.

---

#### **IFileStateService** (Internal)

Manages file-based state persistence for learning data.

| Method | Purpose |
|--------|---------|
| `ReadTreeAsync` | Read tree structure from file |
| `WriteTreeAsync` | Write tree structure to file |
| `ReadProfileAsync` | Read profile from file |
| `WriteProfileAsync` | Write profile to file |
| `ReadConceptAsync` | Read concept content from file |

**Consumer:** API services
**Provider:** API infrastructure (file I/O)

**Note:** This service is internal to the API and not exposed to clients.

---

### Data Models

#### Chat Domain

| Model | Purpose |
|-------|---------|
| `ChatMessage` | Single message in conversation |
| `ChatRequest` | Request to send chat message |
| `ChatResponse` | Response from chat service |
| `ChatStreamChunk` | Chunk of streamed response |
| `ThreeOptionState` | State of mistake handling flow |
| `ThreeOptionResponse` | Response after option selection |

#### Tree Domain

| Model | Purpose |
|-------|---------|
| `TreeStructure` | Complete tree for a learning goal |
| `ConceptNode` | Single concept in the tree |
| `ConceptSource` | Source of truth for a concept |
| `TreeGenerationRequest` | Request to generate new tree |

#### Profile Domain

| Model | Purpose |
|-------|---------|
| `LearningProfile` | User's learning preferences |

#### Materials Domain

| Model | Purpose |
|-------|---------|
| `StudyMaterial` | Uploaded study material |

#### Operations Domain

| Model | Purpose |
|-------|---------|
| `OperationStatus` | Status of long-running operation |
| `ClaudeResponse` | Response from Claude CLI |

---

### Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `ConceptStatus` | NotStarted, InProgress, Studied | Learning status of concept |
| `ConceptTag` | None, Intuitive, Formal, CanApply | Mastery tags (flags) |
| `MessageType` | User, Assistant, System | Type of chat message |
| `TeachingTone` | Nice, Direct, Balanced, Other | Teaching tone preference |
| `MotivationStyle` | PositiveReinforcement, ToughLove, Balanced | Motivation preference |
| `TerminologyLevel` | Casual, Academic, Adaptive | Terminology preference |
| `ExamplePreference` | Analogies, FormalDefinitions, Both | Example style preference |
| `OperationState` | Queued, Running, Completed, Failed | Long-running operation state |

---

## Design Decisions

### D1: Immutable DTOs with Records

**Decision:** All DTOs are implemented as C# records with init-only properties.

**Rationale:**
- Thread safety without synchronization
- Predictable behavior in async contexts
- Built-in equality and ToString
- Encourages functional programming patterns

**Trade-offs:**
- Requires creating new instances for modifications
- Slightly more memory allocation

---

### D2: ImmutableArray for Collections

**Decision:** All collection properties use `ImmutableArray<T>` instead of `List<T>`.

**Rationale:**
- Guaranteed immutability
- Efficient iteration
- Clear API contract (no modification surprises)
- JSON serialization works correctly

**Trade-offs:**
- Requires `using System.Collections.Immutable`
- Slightly different API than List

---

### D3: CancellationToken on All Async Methods

**Decision:** Every async method accepts a `CancellationToken` parameter.

**Rationale:**
- Graceful cancellation of long operations
- Required for HTTP request lifecycle integration
- Prevents resource leaks on abandoned requests

**Trade-offs:**
- Slightly more verbose signatures
- Must be propagated through call chains

---

### D4: Nullable Reference Types

**Decision:** All files use `#nullable enable` with explicit nullability annotations.

**Rationale:**
- Compile-time null safety
- Clear API contracts for optional values
- Reduced NullReferenceException risk

**Trade-offs:**
- Must handle nullable values explicitly
- Some learning curve for team

---

### D5: Internal vs Client Services

**Decision:** Services are split into client-facing (IChatService, ITreeService, IProfileService, IStudyMaterialsService) and internal (IClaudeCliService, IFileStateService).

**Rationale:**
- Clear separation of concerns
- Client services are HTTP API contracts
- Internal services are implementation details
- Prevents leaking internal concerns to clients

**Trade-offs:**
- More interfaces to maintain
- Must ensure internal services aren't accidentally exposed

---

### D6: Three-Option Mistake Handling

**Decision:** Mistakes trigger a three-option flow: try again, get hint, get full answer.

**Rationale:**
- Encourages active learning
- Gradual hint escalation
- Matches pedagogical best practices
- Session-based state tracking

**Trade-offs:**
- More complex state management
- Requires session persistence

---

### D7: Long-Running Operations via OperationStatus

**Decision:** Operations like tree generation return OperationStatus for polling.

**Rationale:**
- AI operations can take significant time
- HTTP requests shouldn't block for minutes
- Progress tracking enables better UX
- Standard pattern for async operations

**Trade-offs:**
- Client must implement polling logic
- More complex than simple request/response

---

## Project Structure

```
app/
├── LittleCheerful.sln
└── src/
    └── LittleCheerful.Contracts/
        ├── LittleCheerful.Contracts.csproj
        ├── Contracts/
        │   ├── IChatService.cs
        │   ├── IClaudeCliService.cs
        │   ├── IFileStateService.cs
        │   ├── IProfileService.cs
        │   ├── IStudyMaterialsService.cs
        │   └── ITreeService.cs
        ├── Enums/
        │   ├── ConceptStatus.cs
        │   ├── ConceptTag.cs
        │   ├── ExamplePreference.cs
        │   ├── MessageType.cs
        │   ├── MotivationStyle.cs
        │   ├── OperationState.cs
        │   ├── TeachingTone.cs
        │   └── TerminologyLevel.cs
        └── Models/
            ├── ChatMessage.cs
            ├── ChatRequest.cs
            ├── ChatResponse.cs
            ├── ChatStreamChunk.cs
            ├── ClaudeResponse.cs
            ├── ConceptNode.cs
            ├── ConceptSource.cs
            ├── LearningProfile.cs
            ├── OperationStatus.cs
            ├── StudyMaterial.cs
            ├── ThreeOptionResponse.cs
            ├── ThreeOptionState.cs
            ├── TreeGenerationRequest.cs
            └── TreeStructure.cs
```

---

## Implementation Phases (for CDD builders)

### Phase 1: LittleCheerful.Api

1. Implement IFileStateService
2. Implement IClaudeCliService
3. Implement IProfileService
4. Implement ITreeService
5. Implement IStudyMaterialsService
6. Implement IChatService
7. Create API controllers for client-facing services

### Phase 2: LittleCheerful.Maui

1. Create HTTP client services implementing contracts
2. Build UI pages for each feature
3. Wire up navigation and state management

---

## Contract Freeze Notice

These contracts are **FROZEN** as of 2026-01-06.

Any changes to interfaces or DTOs require:
1. Architecture review
2. Version increment
3. Backward compatibility analysis
4. Update to this document

**Tag:** contracts-v1.0
