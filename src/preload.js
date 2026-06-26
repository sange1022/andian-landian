const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pomodoro", {
  showContextMenu: () => ipcRenderer.send("show-context-menu"),
  startWindowDrag: (point) => ipcRenderer.send("start-window-drag", point),
  moveWindowDrag: (point) => ipcRenderer.send("move-window-drag", point),
  endWindowDrag: () => ipcRenderer.send("end-window-drag"),
  sendTimerState: (state) => ipcRenderer.send("timer-state", state),
  sendSettingsCommand: (payload) => ipcRenderer.send("settings-command", payload),
  onMenuCommand: (handler) => {
    ipcRenderer.on("menu-command", (_event, payload) => handler(payload));
  },
  onTimerState: (handler) => {
    ipcRenderer.on("timer-state", (_event, payload) => handler(payload));
  }
});
