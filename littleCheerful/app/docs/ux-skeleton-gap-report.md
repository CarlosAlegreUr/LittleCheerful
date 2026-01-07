# UX Skeleton Gap Report

**Date:** 2026-01-06
**Contracts Analyzed:** 6
**STATUS:** COMPLETE

## Summary

All 6 contracts have been validated against the skeleton UI. Every contract interface has at least one ViewModel that will consume it. No gaps were found.

## Contract Coverage Matrix

| Contract | ViewModel(s) | Status |
|----------|-------------|--------|
| IChatService | SessionViewModel | Covered |
| ITreeService | HomeViewModel, TreeViewModel, GoalCreationViewModel, SessionViewModel | Covered |
| IProfileService | HomeViewModel, OnboardingViewModel, SettingsViewModel | Covered |
| IStudyMaterialsService | GoalCreationViewModel, MaterialsViewModel | Covered |
| IClaudeCliService | (Internal - API only) | N/A |
| IFileStateService | (Internal - API only) | N/A |

## View-to-Contract Mapping

### HomePage
- **Purpose:** Dashboard showing current goals and learning progress
- **Contracts Used:**
  - IProfileService.ProfileExistsAsync - Check if onboarding needed
  - ITreeService.GetCurrentTreeAsync - Display learning goals

### OnboardingPage
- **Purpose:** First-time user profile creation
- **Contracts Used:**
  - IProfileService.SaveProfileAsync - Create initial profile

### GoalCreationPage
- **Purpose:** Create new learning goal with optional materials
- **Contracts Used:**
  - ITreeService.GenerateTreeAsync - Generate concept tree
  - IStudyMaterialsService.UploadMaterialAsync - Upload study materials

### TreePage
- **Purpose:** Navigate concept tree, select concepts to study
- **Contracts Used:**
  - ITreeService.GetCurrentTreeAsync - Display tree structure
  - ITreeService.GetConceptAsync - Get concept details
  - ITreeService.NavigateToConceptAsync - Navigate to concept

### SessionPage
- **Purpose:** Active learning session with AI tutor
- **Contracts Used:**
  - IChatService.SendMessageAsync - Send messages
  - IChatService.StreamMessageAsync - Receive streaming responses
  - IChatService.HandleMistakeOptionAsync - Three-option flow
  - ITreeService.GetConceptAsync - Current concept context

### MaterialsPage
- **Purpose:** Manage uploaded study materials
- **Contracts Used:**
  - IStudyMaterialsService.GetMaterialsAsync - List materials
  - IStudyMaterialsService.UploadMaterialAsync - Upload new material
  - IStudyMaterialsService.DeleteMaterialAsync - Remove material

### SettingsPage
- **Purpose:** View and update learning preferences
- **Contracts Used:**
  - IProfileService.GetProfileAsync - Load current profile
  - IProfileService.SaveProfileAsync - Update profile

### SurpriseKeenanPage
- **Purpose:** Easter egg / special feature
- **Contracts Used:** None (standalone UI)

## CRITICAL GAPS (Missing Contracts)

None identified.

## UNREACHABLE CONTRACTS

None identified. All public contract methods have corresponding UI access points.

## AMBIGUOUS CONTRACTS

None identified. All contract method signatures are clear and complete.

## Internal-Only Contracts

The following contracts are intentionally internal (API-only) and do not require UI access:

1. **IClaudeCliService** - Internal API service for executing Claude CLI commands
2. **IFileStateService** - Internal API service for file-based persistence

These contracts are implementation details that other services depend on but are not directly consumed by the UI.

## Shell Navigation Structure

### TabBar (Always Visible)
1. Home - `/home`
2. Tree - `/tree`
3. Materials - `/materials`
4. Settings - `/settings`

### Registered Routes (Navigate to)
1. Onboarding - `/onboarding`
2. Goal Creation - `/goalcreation`
3. Session - `/session`
4. Surprise - `/surprise`

## Build Verification

```
dotnet build LittleCheerful.sln
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

## Phase 1 Complete

The skeleton UI successfully validates that:
1. All 6 contracts are structurally complete
2. Every public contract method has a UI consumer
3. The navigation structure supports all user flows
4. The solution builds without errors

Ready for Phase 2 (implementation with real services) after cdd-builder completes service implementations.
