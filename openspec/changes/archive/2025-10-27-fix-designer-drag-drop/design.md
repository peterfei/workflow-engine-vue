## Context
The Designer page currently shows a static canvas with placeholder elements. To enable process design, we need interactive drag-and-drop, connections, and form binding.

## Goals / Non-Goals
- Goals: Enable dragging nodes, drawing connections, configuring node properties
- Non-Goals: Advanced features like auto-layout, undo/redo, multi-selection (future enhancements)

## Decisions
- Use HTML5 Drag and Drop API for node dragging (no external libraries to minimize bundle size)
- Implement custom SVG-based connection lines for better control and styling
- Create a side panel for form binding and node properties
- Support mouse and touch events for responsive design

## Risks / Trade-offs
- HTML5 Drag API has browser quirks - may need fallbacks for older browsers
- Custom connection drawing increases complexity vs using a library
- Touch support requires additional event handling

## Migration Plan
None - this is a new feature implementation.

## Open Questions
- Should we support keyboard navigation for accessibility?
