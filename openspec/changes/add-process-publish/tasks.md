# Implementation Tasks

## 1. Core Storage Layer
- [ ] 1.1 Create `src/utils/processStorage.js` with LocalStorage utilities
- [ ] 1.2 Implement `saveProcess(processData)` function
- [ ] 1.3 Implement `getAllProcesses()` function
- [ ] 1.4 Implement `getProcessById(id)` function
- [ ] 1.5 Implement `updateProcess(id, processData)` function
- [ ] 1.6 Implement `deleteProcess(id)` function
- [ ] 1.7 Add unique ID generation utility

## 2. Designer Publish Feature
- [ ] 2.1 Add publish handler in `Designer.vue`
- [ ] 2.2 Validate workflow before publishing (use existing validator)
- [ ] 2.3 Show confirmation dialog with process name/description
- [ ] 2.4 Generate process metadata (ID, timestamps, version)
- [ ] 2.5 Save complete workflow state to LocalStorage
- [ ] 2.6 Show success/error notifications
- [ ] 2.7 Navigate to ProcessList after successful publish
- [ ] 2.8 Handle update vs create scenarios (draft editing)

## 3. Process List Integration
- [ ] 3.1 Update `ProcessList.vue` to load from LocalStorage
- [ ] 3.2 Replace hardcoded processes array with dynamic data
- [ ] 3.3 Maintain existing filter/search/sort functionality
- [ ] 3.4 Update process card display with real data
- [ ] 3.5 Update process table display with real data
- [ ] 3.6 Handle empty state when no processes exist
- [ ] 3.7 Add "Edit" button handler to load process in Designer
- [ ] 3.8 Update process counts and statistics dynamically

## 4. Designer Load Feature
- [ ] 4.1 Add route parameter support for editing existing process
- [ ] 4.2 Implement `loadProcess(id)` in Designer
- [ ] 4.3 Restore nodes, connections, and config from saved data
- [ ] 4.4 Update UI to show "Update" vs "Publish" based on context
- [ ] 4.5 Handle missing or invalid process ID gracefully

## 5. Status Management
- [ ] 5.1 Add process status field (draft, published, active, disabled)
- [ ] 5.2 Implement status transitions
- [ ] 5.3 Update UI badges and filters based on status
- [ ] 5.4 Save draft functionality (auto-save or manual)

## 6. Testing
- [ ] 6.1 Test publish new process workflow (MCP)
- [ ] 6.2 Test edit existing process workflow (MCP)
- [ ] 6.3 Test ProcessList displays published processes (MCP)
- [ ] 6.4 Test filter/search with real data (MCP)
- [ ] 6.5 Test validation before publish (MCP)
- [ ] 6.6 Test LocalStorage persistence across page reloads (MCP)
- [ ] 6.7 Test navigation between Designer and ProcessList (MCP)


