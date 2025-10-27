# Project Context

## Purpose
Workflow Engine Platform - Vue.js 3.0 version. A frontend application for process/workflow management, reconstructed from HTML prototype to Vue.js, providing features like dashboard, process designer, user management, and reporting.

## Tech Stack
- Vue.js 3.3.0 - Progressive JavaScript framework
- Vue Router 4.2.0 - Official routing manager
- Tailwind CSS 3.3.0 - Utility-first CSS framework
- Vite 4.3.0 - Fast build tool
- Font Awesome 6.4.0 - Icon library
- ESLint 8.39.0 - Code linting

## Project Conventions

### Code Style
- Use Vue 3 Composition API
- Single file components (.vue)
- PascalCase for component names
- camelCase for props
- ESLint for code checking
- Follow Vue.js official style guide

### Architecture Patterns
- Component-based architecture with reusable common components (StatCard, InfoCard, TabNav, etc.)
- Responsive design with Tailwind CSS
- Page-based routing with Vue Router
- Scoped styles for component isolation

### Testing Strategy
- Self-testing checklists in README for manual verification
- Automated test scripts for style validation (e.g., test-button-styles.js, test-card-styles.js)
- Manual UI/UX validation against HTML prototype

### Git Workflow
[To be defined - standard branching strategy recommended]

## Domain Context
Workflow/process management platform for business process automation. Features include process design, execution monitoring, user management, and reporting. Domain concepts: processes, instances, tasks, forms, users, roles.

## Important Constraints
- Must maintain 1:1 fidelity with HTML prototype design
- Responsive design for desktop/tablet/mobile
- Performance optimization for typical workflow loads

## External Dependencies
- Font Awesome for icons
- No backend APIs specified yet (frontend-only reconstruction)
