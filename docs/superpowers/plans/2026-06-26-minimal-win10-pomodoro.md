# Minimal Win10 Pomodoro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a directly installable Windows 10 minimalist floating pomodoro app with only 25 and 45 minute modes.

**Architecture:** Electron owns the transparent always-on-top floating window and native context menu. Pure timer logic lives in `src/timerLogic.js` and is tested with Node's built-in test runner. The renderer displays the black circle, minute text, opacity progression, and finish dismissal count.

**Tech Stack:** Electron, electron-builder NSIS, Node test runner, vanilla HTML/CSS/JavaScript.

---

## File Structure

- `package.json`: npm scripts, Electron dependency, electron-builder Windows installer config.
- `src/timerLogic.js`: pure timer calculations and finite-state transitions.
- `test/timerLogic.test.js`: unit tests for supported durations, progress opacity, finish behavior, and three-click dismissal.
- `src/main.js`: Electron entry point, transparent window, always-on-top behavior, native context menu.
- `src/preload.js`: safe IPC bridge from Electron to renderer.
- `src/renderer.js`: UI state, ticking loop, click handling, menu event handling.
- `src/index.html`: single floating circle markup.
- `src/styles.css`: minimal black-circle visual design and finish grow animation.
- `build/icon.svg`: simple source icon for packaging metadata.
- `README.md`: install/build/run instructions.

## Tasks

- [ ] Create package metadata and install dependencies.
- [ ] Write failing timer logic tests.
- [ ] Implement minimal timer logic until tests pass.
- [ ] Add Electron main/preload/renderer files.
- [ ] Add minimal HTML/CSS circle UI.
- [ ] Add README and icon.
- [ ] Run tests.
- [ ] Run mac build verification.
- [ ] Attempt Windows installer build with `npm run dist:win`.

## Verification Commands

- `npm test`
- `npm run pack`
- `npm run dist:win`

## Self-Review

- Spec coverage: the plan includes duration limits, opacity progress, finish growth, three-click dismissal, floating window, context menu, and installer configuration.
- Placeholder scan: no TBD/TODO placeholders are present.
- Type consistency: `timerLogic.js` is the single shared behavior module referenced by tests and renderer.

