## Context
The Designer needs to evolve from a basic prototype to an enterprise-grade workflow editor. Current issues include unreliable drag mechanics and missing professional features that users expect in commercial tools like Visio or Draw.io.

## Goals / Non-Goals
- Goals: Reliable drag/pan, undo/redo, validation, export/import, professional UX
- Non-Goals: Full BPMN 2.0 compliance, collaboration features, advanced simulation

## Decisions
- Use a state management pattern (Pinia or Vuex) for undo/redo and complex state
- Implement custom canvas panning with transform CSS for performance
- Add keyboard event listeners globally for shortcuts
- Use SVG for connections with proper hit detection
- Store process data in normalized JSON structure for export
- Add new dependencies only if necessary (prefer vanilla JS)

## Risks / Trade-offs
- Adding state management increases bundle size - monitor performance
- Custom drag implementation vs library - more control but higher maintenance
- Extensive features may slow initial load - implement lazy loading
- Breaking changes to data structure - provide migration utilities

## Migration Plan
- Phase 1: Fix core drag/pan issues (immediate)
- Phase 2: Add undo/redo and shortcuts (week 1)
- Phase 3: Validation and export (week 2)
- Phase 4: UI polish and testing (week 3)
- Backward compatibility: Keep existing simple processes working

## Open Questions
- Should we integrate a library like Konva.js for canvas operations?
- How to handle large process graphs (1000+ nodes)?
- Backend integration points for save/load?
