## Why
The Designer page at /designer lacks core functionality for process design. Users cannot drag nodes, create connections between them, or bind forms to nodes, making the process designer unusable for workflow creation.

## What Changes
- Implement drag-and-drop functionality for process nodes
- Add connection/line drawing between nodes
- Create form binding area for node properties configuration
- Ensure responsive canvas and proper event handling

## Impact
- Affected specs: process-designer (new capability)
- Affected code: src/views/Designer.vue, potentially new drag-drop components
- Requires decision on drag-drop implementation (library vs custom)
