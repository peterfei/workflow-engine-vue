
# Workflow Engine Vue 

Production‑ready, modern workflow UX built with Vue 3 + Pinia + Tailwind. Design processes visually, manage forms, track instances, and analyze performance — all in one beautiful, responsive UI. [简体中文](README.zh-CN.md)

<div align="center">
<br/>
<p align="center">
  <a href="https://github.com/peterfei/workflow-engine-vue/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/peterfei/workflow-engine-vue?style=for-the-badge&logo=github"/></a>
  <a href="https://github.com/peterfei/workflow-engine-vue/network/members"><img alt="GitHub Forks" src="https://img.shields.io/github/forks/peterfei/workflow-engine-vue?style=for-the-badge&logo=github"/></a>
  <img alt="License" src="https://img.shields.io/badge/License-MIT-0ea5e9?style=for-the-badge"/>
  <img alt="Node" src="https://img.shields.io/badge/Node-%3E%3D16-3b82f6?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vue.js&logoColor=white"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-4.x-646cff?style=for-the-badge&logo=vite&logoColor=white"/>
  <img alt="Pinia" src="https://img.shields.io/badge/Pinia-3.x-facc15?style=for-the-badge"/>
</p>
</div>

![Dashboard](Thumbs/dashboard.png)



## Why this project

- **Self‑developed workflow engine** — built from scratch, production‑ready, commercially viable
- **Visual process designer** — drag‑drop nodes, real‑time validation, minimap navigation, undo/redo
- **Complete workflow management** — process list, instance tracking, form designer, analytics dashboard
- **Enterprise‑grade features** — data persistence, export/import, keyboard shortcuts, grid snapping, multi‑select

## Features

- Process Designer: drag‑drop nodes, connect, validate, export/import
- Forms: gallery with categories and quick actions
- My Work: inbox of pending/started/done, demo flow included
- Process List: filters, sorting, status badges, stats
- Instance Detail: status card, timeline, variables, metrics
- Reports: trends, distribution, hot processes, performance
- Responsive layout and accessible components

## Tech Stack

- Vue 3 (Composition API)
- Pinia (state management)
- Vue Router 4
- Tailwind CSS
- Vite

## Quick Start

Prerequisites: Node.js 16+, npm 8+

```bash
npm install
npm run dev
# open the URL printed by Vite (e.g. http://localhost:3001)
```

Build and Preview:

```bash
npm run build
npm run preview
```

## Screenshots

<p align="center"><img src="Thumbs/process-list.png" width="900" alt="Process List"/></p>
<p align="center"><img src="Thumbs/designer.png" width="900" alt="Designer"/></p>
<p align="center"><img src="Thumbs/forms.png" width="900" alt="Forms"/></p>
<p align="center"><img src="Thumbs/my-work.png" width="900" alt="My Work"/></p>
<p align="center"><img src="Thumbs/demo-instance-detail.png" width="900" alt="Instance Detail"/></p>

## Project Structure

```
src/
├─ assets/
├─ components/
├─ stores/
├─ views/
├─ router/
└─ utils/
```

## Roadmap

- Keyboard help panel (optional)
- Alignment guides and connection redraw (optional)
- Virtualization for huge canvases (>100 nodes) (optional)

## Contributing

PRs welcome! If you plan a larger change, please open an issue to discuss first. Keep PRs focused and small where possible.

## Community

- Issues: bug reports, feature ideas, questions are appreciated
- Stars: if this project helps you, please give it a star — it helps others discover it

## License

MIT © 2025 peterfei
