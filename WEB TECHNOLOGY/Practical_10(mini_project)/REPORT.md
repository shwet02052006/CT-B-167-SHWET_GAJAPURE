# Simple Task Manager — Brief Project Report

Date: 2025-11-03

## Overview
A small single-page web app to add, complete, delete, and filter tasks. Tasks persist locally in the browser via localStorage. The app emphasizes simplicity, accessibility, and no external dependencies.

## Features
- Add tasks via form submit (Enter or button)
- Toggle complete, delete tasks
- Filter: All / Pending / Completed (selection is persisted)
- Local persistence (localStorage)
- Accessible UI: semantic HTML, labeled controls, aria-live updates, clear focus styles, reduced motion support

## Tech Stack
- HTML5
- CSS3 (vanilla)
- JavaScript (vanilla, no frameworks)

## Architecture
- `index.html`: Semantic structure with `<main>`, form for input, filter controls, list, stats, and live regions.
- `style.css`: Layout, component styles, `.sr-only` utility, `:focus-visible` outlines, reduced motion media query.
- `script.js`: State management and DOM updates; event delegation for list actions; persistence layer (localStorage).

## Data Model & Persistence
- Task shape: `{ id: number, text: string, completed: boolean, createdAt: ISOString }`
- Storage keys: `tasks` (array of tasks), `taskFilter` (current filter)

## Key Improvements Implemented
- Semantic & a11y: moved to `<main>`, form submit flow, offscreen label, `aria-live` updates, `aria-pressed` for filters, stronger focus outlines
- UX: inline status messages instead of alerts; filter remembered across reloads
- Security: render with `textContent` and DOM APIs (avoid HTML injection)
- Performance/maintainability: event delegation for list interactions
- Progressive enhancement: `noscript` notice and reduced motion support

## Usage
- Open `index.html` in any modern browser. No build step or server required.

## Future Enhancements (Optional)
- Inline edit task text (save with Enter, cancel with Esc)
- Clear completed / Mark all completed
- Keyboard-accessible reordering
- Dark mode (`prefers-color-scheme`)
- Basic unit tests for core logic
