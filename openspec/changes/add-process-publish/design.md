# Design: Process Publish and Management

## Context
The workflow engine platform needs to persist user-designed workflows and display them in the Process List page. Currently, the Designer allows creating workflows but cannot save them, and the Process List shows only hardcoded mock data. This design establishes the storage layer, publish workflow, and integration between Designer and Process List.

## Goals / Non-Goals

### Goals
- Enable users to publish workflows from Designer
- Persist workflows to LocalStorage for client-side storage
- Display published workflows in Process List
- Support editing existing workflows
- Provide basic status management (draft, published, active, disabled)
- Maintain all existing Designer features (validation, export, etc.)

### Non-Goals
- Backend API integration (future work)
- Multi-user collaboration or conflict resolution
- Workflow versioning history (only current version stored)
- Process execution engine (publish only, not run)
- Complex permission or access control

## Decisions

### Storage Strategy: LocalStorage
**Decision**: Use browser LocalStorage as the persistence layer.

**Rationale**:
- Project currently has no backend APIs (per `openspec/project.md`)
- Simple, synchronous API suitable for frontend-only prototype
- Adequate for demo and testing purposes
- Easy to migrate to backend API later

**Alternatives Considered**:
- IndexedDB: More complex API, overkill for current needs
- In-memory only: Would lose data on page refresh
- Mock backend: Adds unnecessary complexity at this stage

### Data Structure
```javascript
// LocalStorage key: 'workflow_processes'
// Value: JSON array of process objects
{
  id: string,                    // Unique identifier (e.g., 'process_<timestamp>')
  name: string,                  // Process name from config
  description: string,           // Process description from config
  status: 'draft'|'published'|'active'|'disabled',
  category: string,              // Process category
  boundFormId: string|null,      // Linked form ID
  fieldMapping: object,          // Form field mappings
  nodes: array,                  // Designer nodes
  connections: array,            // Designer connections
  creator: string,               // Hardcoded or placeholder for now
  createdAt: string,             // ISO timestamp
  updatedAt: string,             // ISO timestamp
  version: string,               // Simple version (e.g., 'v1.0')
  icon: string,                  // Font Awesome icon class
  iconBg: string,                // Background gradient
  instanceCount: number,         // Mock value initially (0)
  completedCount: number,        // Mock value initially (0)
  runningCount: number           // Mock value initially (0)
}
```

### Publish Workflow
1. User clicks "发布流程" button
2. System validates workflow (reuse existing `flowValidator.js`)
3. If invalid, show error dialog with issues
4. If valid, show publish dialog:
   - Pre-filled with process name and description from config
   - User can edit before publishing
   - Confirm or cancel
5. On confirm:
   - Generate unique ID if new process
   - Collect all workflow data (nodes, connections, config)
   - Add metadata (timestamps, version, status)
   - Save to LocalStorage
   - Show success notification
   - Navigate to Process List

### Edit Workflow
1. User clicks "Edit" button in Process List
2. Navigate to Designer with process ID in route: `/designer/:id`
3. Designer loads process data from LocalStorage
4. Restore nodes, connections, and config to store
5. Button text changes to "更新流程" instead of "发布流程"
6. Save updates existing process record

### Process List Integration
- Replace hardcoded `processes` array with dynamic load from LocalStorage
- Maintain all existing features: search, filter, sort, view modes
- Display actual workflow data (name, description, status)
- Calculate statistics from stored data
- Handle empty state when no processes exist

## Risks / Trade-offs

### Risk: LocalStorage Size Limit
- **Mitigation**: LocalStorage has ~5-10MB limit per domain, sufficient for dozens of workflows. If limit reached, show error and suggest export/delete.

### Risk: Data Loss
- **Mitigation**: Encourage users to export workflows as JSON backups. Future enhancement: sync to backend.

### Risk: Concurrent Tabs
- **Mitigation**: No synchronization across tabs. If user edits in multiple tabs, last save wins (acceptable for current scope).

### Trade-off: No Version History
- **Rationale**: Simplifies implementation. Workflows are overwritten on update. Users can export snapshots manually if needed.

### Trade-off: Mock Statistics
- **Rationale**: Instance counts (running, completed) are initially mock values (0). Future work: implement actual process execution and tracking.

## Migration Plan

### Existing Data
- Current ProcessList has 3 hardcoded processes (订单处理流程, 审批流程, 通知流程)
- Option 1: Discard on first load (clean start)
- Option 2: Seed LocalStorage with hardcoded data as samples
- **Recommendation**: Option 1 (clean start), but provide a "Load Sample Processes" button for demo purposes

### Rollback
- Users can clear LocalStorage to reset
- Export/import functionality already exists for backup/restore

## Open Questions
1. Should we add auto-save drafts feature, or only manual publish?
   - **Recommendation**: Start with manual publish only. Auto-save can be added later.
2. Should process name be unique constraint?
   - **Recommendation**: No constraint initially. Allow duplicate names (IDs are unique).
3. How to handle process icon and color?
   - **Recommendation**: Auto-assign based on category or use default icon. Future: let user customize.


