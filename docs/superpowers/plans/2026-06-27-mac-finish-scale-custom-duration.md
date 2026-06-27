# Mac Finish Scale And Custom Duration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the finished blue dot breathe up to three times its normal size without clipping and restore custom-duration editing in the Mac settings window.

**Architecture:** Add pure helpers for center-preserving window resizing and custom-minute parsing/synchronization. The Electron main process resizes the transparent window on finished-state transitions, while renderer CSS owns the animation and the settings renderer protects focused input from timer-state refreshes.

**Tech Stack:** Electron, browser JavaScript, CommonJS, CSS animations, `node:test`, electron-builder

---

### Task 1: Center-Preserving Alert Window

**Files:**
- Create: `src/alertWindow.js`
- Create: `test/alertWindow.test.js`
- Modify: `src/main.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing tests for resizing around the current center**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { resizeBoundsAroundCenter } = require("../src/alertWindow");

test("alert bounds expand around the existing center", () => {
  assert.deepEqual(
    resizeBoundsAroundCenter({ x: 100, y: 200, width: 112, height: 112 }, 336, 336),
    { x: -12, y: 88, width: 336, height: 336 }
  );
});

test("normal bounds restore around the current alert center", () => {
  assert.deepEqual(
    resizeBoundsAroundCenter({ x: -12, y: 88, width: 336, height: 336 }, 112, 112),
    { x: 100, y: 200, width: 112, height: 112 }
  );
});
```

- [ ] **Step 2: Run `node --test test/alertWindow.test.js` and confirm missing-module failure**

- [ ] **Step 3: Implement the pure bounds helper**

```js
function resizeBoundsAroundCenter(bounds, width, height) {
  return {
    x: Math.round(bounds.x + (bounds.width - width) / 2),
    y: Math.round(bounds.y + (bounds.height - height) / 2),
    width,
    height
  };
}

module.exports = { resizeBoundsAroundCenter };
```

- [ ] **Step 4: Run the focused test and confirm both cases pass**

- [ ] **Step 5: In `main.js`, resize from 112x112 to 336x336 on entry to `finished` and restore around the current center on exit**

```js
const { resizeBoundsAroundCenter } = require("./alertWindow");
const NORMAL_WINDOW_SIZE = 112;
const ALERT_WINDOW_SIZE = 336;

function setAlertWindowSize(isAlerting) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const targetSize = isAlerting ? ALERT_WINDOW_SIZE : NORMAL_WINDOW_SIZE;
  const bounds = mainWindow.getBounds();
  if (bounds.width === targetSize && bounds.height === targetSize) return;
  mainWindow.setBounds(resizeBoundsAroundCenter(bounds, targetSize, targetSize), false);
}
```

Call `setAlertWindowSize(true)` on the transition into `finished` and `setAlertWindowSize(false)` when leaving it. Change the `grow-alert` keyframe maximum from `scale(1.34)` to `scale(3)`.

### Task 2: Custom Duration Editing

**Files:**
- Create: `src/customDuration.js`
- Create: `test/customDuration.test.js`
- Modify: `src/settings.html`
- Modify: `src/settings.js`

- [ ] **Step 1: Write failing tests for valid minutes and focused-input synchronization**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { parseCustomMinutes, shouldSyncCustomMinutes } = require("../src/customDuration");

test("custom minutes accept only whole values from 1 through 180", () => {
  assert.equal(parseCustomMinutes("35"), 35);
  assert.equal(parseCustomMinutes("0"), null);
  assert.equal(parseCustomMinutes("181"), null);
  assert.equal(parseCustomMinutes("1.5"), null);
  assert.equal(parseCustomMinutes(""), null);
});

test("timer refresh does not overwrite a focused custom input", () => {
  assert.equal(shouldSyncCustomMinutes(true), false);
  assert.equal(shouldSyncCustomMinutes(false), true);
});
```

- [ ] **Step 2: Run `node --test test/customDuration.test.js` and confirm missing-module failure**

- [ ] **Step 3: Implement a browser/CommonJS helper exposing both functions**

`parseCustomMinutes` returns an integer only for values from 1 through 180. `shouldSyncCustomMinutes` returns the inverse of the focused state.

- [ ] **Step 4: Run the focused test and confirm both cases pass**

- [ ] **Step 5: Load the helper before `settings.js`, preserve focused input, and support Enter**

Track the latest valid `durationMinutes`. The Set button and Enter key call one shared `applyCustomDuration()` function. Invalid values restore the latest valid duration without sending IPC. `onTimerState` updates the input only when `document.activeElement !== customMinutes`.

### Task 3: Release Build

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Generate: `dist/暗淡蓝点-1.0.13-arm64.dmg`

- [ ] **Step 1: Run `npm test` and confirm the full suite passes**

- [ ] **Step 2: Run `npm version 1.0.13 --no-git-tag-version` and commit the version files**

- [ ] **Step 3: Build with `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/ npm run dist:mac`**

- [ ] **Step 4: Re-run `npm test`, run `hdiutil verify` on the DMG, and inspect packaged `package.json` plus `src/main.js` from `app.asar`**

- [ ] **Step 5: Merge the verified branch to `main`, copy the DMG into the main workspace `dist`, and open that directory**
