## MODIFIED Requirements
### Requirement: Node Dragging
The system SHALL allow users to drag process nodes within the designer canvas with smooth, reliable movement and visual feedback.

#### Scenario: Drag node to new position
- **WHEN** user clicks and drags a node
- **THEN** the node moves smoothly with the cursor
- **AND** visual feedback indicates the drag operation

#### Scenario: Drag with snapping
- **WHEN** user drags near grid lines or other nodes
- **THEN** node snaps to alignment guides

### Requirement: Canvas Panning
The system SHALL allow users to pan the canvas view by dragging the background area.

#### Scenario: Pan canvas view
- **WHEN** user clicks and drags empty canvas area
- **THEN** entire canvas view moves with the drag

### Requirement: Undo/Redo Operations
The system SHALL provide undo and redo functionality for all editing operations.

#### Scenario: Undo node creation
- **WHEN** user creates a node then presses Ctrl+Z
- **THEN** the node is removed from canvas

#### Scenario: Redo after undo
- **WHEN** user undoes an action then presses Ctrl+Y
- **THEN** the action is reapplied

### Requirement: Process Validation
The system SHALL validate process structure and highlight errors in real-time.

#### Scenario: Invalid process detection
- **WHEN** process lacks required start/end nodes
- **THEN** validation errors are displayed with visual indicators

### Requirement: Process Export/Import
The system SHALL support exporting and importing process definitions in standard formats.

#### Scenario: Export to JSON
- **WHEN** user clicks export button
- **THEN** process definition is downloaded as JSON file

#### Scenario: Import from JSON
- **WHEN** user imports a valid JSON file
- **THEN** process is loaded and displayed on canvas

## ADDED Requirements
### Requirement: Keyboard Shortcuts
The system SHALL support common keyboard shortcuts for efficient editing.

#### Scenario: Delete selected items
- **WHEN** user selects items and presses Delete key
- **THEN** selected items are removed

### Requirement: Multi-Selection
The system SHALL allow selecting multiple nodes and connections simultaneously.

#### Scenario: Select multiple with Ctrl+click
- **WHEN** user holds Ctrl and clicks multiple nodes
- **THEN** all clicked nodes are selected

### Requirement: Zoom Controls
The system SHALL provide zoom in/out functionality for canvas navigation.

#### Scenario: Zoom with mouse wheel
- **WHEN** user scrolls mouse wheel over canvas
- **THEN** canvas zooms in or out centered on cursor position
