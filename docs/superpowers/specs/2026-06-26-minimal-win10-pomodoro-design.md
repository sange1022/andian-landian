# Minimal Win10 Pomodoro Design

## Goal

Build a directly installable Windows 10 desktop pomodoro app with the TomatoBar-like minimalist behavior requested by the user.

## Product Behavior

- The app appears as a small always-on-top floating black circle on the desktop.
- The visible circle style is option A: a black circular button with only the remaining minutes shown.
- The only selectable durations are 25 minutes and 45 minutes.
- Progress is represented by opacity: the circle starts very light/transparent, becomes gray during the session, and approaches black near the end.
- When the countdown reaches zero, the circle repeatedly grows larger to draw attention.
- The finished alert cannot be dismissed by one accidental click. The user must click the circle three times consecutively to cancel it.
- The app stays minimal: no landing page, no dashboard, no settings screen, no account, no extra timers.

## Interaction

- Left click toggles start/pause when a timer is selected and not finished.
- Right click opens a compact native menu with `25 minutes`, `45 minutes`, `Start/Pause`, `Reset`, and `Quit`.
- The window can be dragged by dragging the circle.
- At finish state, left clicks increment a visible `1/3`, `2/3`, `3/3` dismissal count. The third click stops the alert and resets the timer to the selected duration.

## Architecture

- Use Electron for a directly installable Windows app with a transparent, frameless, always-on-top window.
- Keep timer state in shared pure JavaScript functions so it can be tested without launching Electron.
- Keep Electron main-process behavior small: create the floating window, provide the context menu, and bridge menu commands to the renderer.
- Use `electron-builder` with NSIS to produce a Windows installer.

## Testing

- Unit test timer math, opacity progression, finish transition, and three-click dismissal logic with Node's built-in test runner.
- Run an Electron packaging command to verify the Windows installer configuration can be generated from the project.

## Scope Notes

- The target deliverable is an installable Windows package. The current machine is macOS, so local Windows installer generation depends on available cross-build support. If local cross-build is blocked, the project will still include the exact `npm run dist:win` command for building on Win10 or CI.

