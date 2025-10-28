# Process Designer Spec Deltas

## ADDED Requirements

### Requirement: Process Publishing
The system SHALL enable users to publish designed workflows to persistent storage.

#### Scenario: Publish valid workflow
- **GIVEN** user has created a workflow with at least one start and one end node
- **AND** workflow passes validation (no errors)
- **WHEN** user clicks the "发布流程" button
- **THEN** system displays a publish confirmation dialog
- **AND** dialog shows process name and description (editable)
- **WHEN** user confirms publication
- **THEN** system saves workflow to LocalStorage
- **AND** assigns unique process ID
- **AND** sets status to "published"
- **AND** records creation timestamp
- **AND** shows success notification
- **AND** navigates to Process List page

#### Scenario: Publish invalid workflow
- **GIVEN** user has created a workflow with validation errors
- **WHEN** user clicks the "发布流程" button
- **THEN** system displays validation error dialog
- **AND** shows list of validation issues (errors and warnings)
- **AND** does not save the workflow
- **AND** user remains in Designer to fix issues

#### Scenario: Update existing workflow
- **GIVEN** user is editing a previously published workflow
- **AND** workflow has been modified
- **WHEN** user clicks the "更新流程" button
- **THEN** system displays update confirmation dialog
- **AND** shows current process name and description (editable)
- **WHEN** user confirms update
- **THEN** system overwrites existing workflow data in LocalStorage
- **AND** updates the "updatedAt" timestamp
- **AND** increments version number
- **AND** shows success notification
- **AND** navigates to Process List page

### Requirement: Workflow Loading
The system SHALL enable users to load and edit previously published workflows.

#### Scenario: Load workflow for editing
- **GIVEN** a published workflow exists in LocalStorage
- **WHEN** user navigates to Designer with process ID (e.g., `/designer/:id`)
- **THEN** system loads workflow data from LocalStorage
- **AND** restores all nodes with correct positions and properties
- **AND** restores all connections with labels
- **AND** restores process configuration (name, description, form binding, field mapping)
- **AND** sets Designer context to "edit mode" (button shows "更新流程")

#### Scenario: Load non-existent workflow
- **GIVEN** user navigates to Designer with invalid or missing process ID
- **WHEN** system attempts to load workflow data
- **THEN** system shows error notification "流程不存在"
- **AND** initializes Designer with empty canvas
- **AND** sets Designer context to "create mode" (button shows "发布流程")

### Requirement: Process List Display
The system SHALL display all published workflows in the Process List page.

#### Scenario: View all published processes
- **GIVEN** multiple workflows have been published
- **WHEN** user navigates to Process List page
- **THEN** system loads all processes from LocalStorage
- **AND** displays each process with name, description, status, creator, update time
- **AND** shows process statistics (instance count, completed, running)
- **AND** supports existing filter, search, and sort functionality

#### Scenario: View empty process list
- **GIVEN** no workflows have been published
- **WHEN** user navigates to Process List page
- **THEN** system displays empty state message
- **AND** shows "创建流程" button to navigate to Designer

#### Scenario: Edit process from list
- **GIVEN** user is viewing Process List
- **WHEN** user clicks "编辑" button on a process card or row
- **THEN** system navigates to Designer with process ID
- **AND** loads workflow for editing (see "Load workflow for editing" scenario)

### Requirement: Process Status Management
The system SHALL manage workflow lifecycle through status transitions.

#### Scenario: New process starts as draft
- **GIVEN** user is creating a new workflow
- **WHEN** system saves the workflow (auto-save or publish)
- **THEN** initial status is set to "draft" if auto-saved
- **OR** status is set to "published" if published via button

#### Scenario: Status badge display
- **GIVEN** a workflow has a status value
- **WHEN** system displays the workflow in Process List
- **THEN** status is shown as a colored badge
- **AND** "published" status shows green badge
- **AND** "draft" status shows yellow badge
- **AND** "active" status shows blue badge
- **AND** "disabled" status shows gray badge

## MODIFIED Requirements

### Requirement: Canvas Export and Import
The system SHALL export and import workflow definitions including published status.

**Changes**: Extended to include process metadata for published workflows.

#### Scenario: Export published process
- **GIVEN** user has a published workflow loaded in Designer
- **WHEN** user selects "导出为JSON"
- **THEN** system exports JSON including nodes, connections, config, AND process metadata
- **AND** metadata includes process ID, name, description, status, timestamps

#### Scenario: Import process definition
- **GIVEN** user has a JSON file with process data
- **WHEN** user selects "从JSON导入"
- **THEN** system loads nodes, connections, and config
- **AND** preserves process metadata if present
- **AND** generates new process ID if importing as new process


