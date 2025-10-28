# Proposal: Add Process Publish Functionality

## Why
Currently, the "发布流程" (Publish Process) button in the Designer exists but has no functionality. Users cannot save designed workflows or view them in the Process List page. Process data is currently hardcoded in `ProcessList.vue`, making the system non-functional for real workflow management.

## What Changes
- Implement publish button handler to save workflow to LocalStorage
- Store complete workflow data (nodes, connections, config, metadata)
- Update ProcessList to read from LocalStorage instead of hardcoded data
- Add process status management (draft → published)
- Support both new process creation and updates to existing processes
- Provide unique process ID generation
- Store publish timestamp and version info
- Enable navigation from ProcessList to Designer for editing

**BREAKING**: ProcessList data source changes from hardcoded array to LocalStorage-backed dynamic data.

## Impact
- Affected specs: `process-designer`
- Affected code:
  - `src/views/Designer.vue` (publish button handler)
  - `src/views/ProcessList.vue` (data source)
  - `src/stores/designer.js` (process state management)
  - New file: `src/utils/processStorage.js` (LocalStorage management)
- Dependencies: Requires form binding and field mapping features to be complete
- User impact: Users can now save and manage their designed workflows


