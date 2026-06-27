# Hide Blue Dot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dynamic Mac context-menu command that hides or restores the desktop blue dot without interrupting its timer.

**Architecture:** Keep timer ownership in the existing renderer process and hide the existing `BrowserWindow` instead of destroying it. Put the visibility menu label and command selection in a small pure helper so both visible and hidden states are covered by unit tests, then let `main.js` perform the Electron window action.

**Tech Stack:** Electron, Node.js CommonJS, `node:test`, electron-builder

---

### Task 1: Visibility Menu State

**Files:**
- Create: `src/windowVisibility.js`
- Create: `test/windowVisibility.test.js`

- [ ] **Step 1: Write the failing test**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { getWindowVisibilityMenuItem } = require("../src/windowVisibility");

test("visible blue dot offers hide", () => {
  assert.deepEqual(getWindowVisibilityMenuItem(true), {
    label: "Hide Blue Dot",
    action: "hide"
  });
});

test("hidden blue dot offers show", () => {
  assert.deepEqual(getWindowVisibilityMenuItem(false), {
    label: "Show Blue Dot",
    action: "show"
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/windowVisibility.test.js`
Expected: FAIL with `Cannot find module '../src/windowVisibility'`.

- [ ] **Step 3: Write minimal implementation**

```js
function getWindowVisibilityMenuItem(isVisible) {
  return isVisible
    ? { label: "Hide Blue Dot", action: "hide" }
    : { label: "Show Blue Dot", action: "show" };
}

module.exports = { getWindowVisibilityMenuItem };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/windowVisibility.test.js`
Expected: 2 tests pass.

### Task 2: Electron Context Menu Integration

**Files:**
- Modify: `src/main.js`
- Modify: `README.md`

- [ ] **Step 1: Import `getWindowVisibilityMenuItem` and add a `toggleMainWindowVisibility` function**

```js
const { getWindowVisibilityMenuItem } = require("./windowVisibility");

function toggleMainWindowVisibility(action) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (action === "hide") mainWindow.hide();
  if (action === "show") {
    mainWindow.show();
    mainWindow.focus();
  }
}
```

- [ ] **Step 2: Build the dynamic menu entry before Settings**

```js
const visibilityItem = getWindowVisibilityMenuItem(
  Boolean(mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible())
);

return Menu.buildFromTemplate([
  {
    label: visibilityItem.label,
    click: () => toggleMainWindowVisibility(visibilityItem.action)
  },
  { label: "Settings", click: () => createSettingsWindow() },
  // existing menu items remain unchanged
]);
```

- [ ] **Step 3: Document the right-click behavior**

Add to the usage list: `- 右键菜单可隐藏桌面蓝点；隐藏后倒计时继续，可从状态栏右键恢复。`

- [ ] **Step 4: Run the full suite**

Run: `npm test`
Expected: all existing and new tests pass.

### Task 3: Mac Release Build

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Generate: `dist/暗淡蓝点-1.0.12-arm64.dmg`

- [ ] **Step 1: Bump patch version**

Run: `npm version 1.0.12 --no-git-tag-version`
Expected: both package files report `1.0.12`.

- [ ] **Step 2: Build the Mac installer**

Run: `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/ npm run dist:mac`
Expected: electron-builder creates `dist/暗淡蓝点-1.0.12-arm64.dmg`.

- [ ] **Step 3: Verify tests and artifact**

Run: `npm test && test -f 'dist/暗淡蓝点-1.0.12-arm64.dmg'`
Expected: tests pass and the artifact check exits successfully.
