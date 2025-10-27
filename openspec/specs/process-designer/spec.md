# process-designer Specification

## Purpose
TBD - created by archiving change fix-designer-drag-drop. Update Purpose after archive.
## Requirements
### Requirement: Node Dragging
The system SHALL allow users to drag process nodes within the designer canvas.

#### Scenario: Drag node to new position
- **WHEN** user clicks and drags a node
- **THEN** the node moves to the new position on the canvas

### Requirement: Connection Creation
The system SHALL enable drawing connection lines between process nodes.

#### Scenario: Create connection between nodes
- **WHEN** user selects connection mode and clicks two nodes
- **THEN** a visual connection line is drawn between them

### Requirement: Form Binding Area
The system SHALL provide a form binding panel for configuring node properties.

#### Scenario: Bind form to node
- **WHEN** user selects a node
- **THEN** the form binding panel displays configuration options for that node

