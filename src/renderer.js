const {
  createTimer,
  selectDuration,
  startTimer,
  pauseTimer,
  resetTimer,
  tickTimer,
  registerFinishClick,
  getCircleVisual
} = window.timerLogic;
const { getCircleAction } = window.interaction;

const circle = document.getElementById("circle");
const timeText = document.getElementById("timeText");
const dismissText = document.getElementById("dismissText");

let timer = createTimer();
let lastTick = Date.now();
let dragStartPoint;
let dragged = false;

function render() {
  const visual = getCircleVisual(timer);
  circle.style.setProperty("--circle-opacity", String(visual.opacity));
  circle.classList.toggle("alerting", visual.isAlerting);
  timeText.textContent = visual.minutesText;
  dismissText.textContent = timer.status === "finished" ? `${timer.dismissClicks}/3` : "";
  window.pomodoro.sendTimerState({
    durationMinutes: timer.durationMinutes,
    status: timer.status,
    remainingText: visual.minutesText,
    dismissClicks: timer.dismissClicks
  });
}

function toggleTimer() {
  if (timer.status === "running") {
    timer = pauseTimer(timer);
  } else if (timer.status === "idle" || timer.status === "paused") {
    lastTick = Date.now();
    timer = startTimer(timer);
  }
  render();
}

function chooseDuration(minutes) {
  timer = selectDuration(timer, minutes);
  lastTick = Date.now();
  render();
}

function resetCurrentTimer() {
  timer = resetTimer(timer);
  lastTick = Date.now();
  render();
}

circle.addEventListener("click", () => {
  if (dragged) {
    dragged = false;
    return;
  }

  const action = getCircleAction(timer.status, "click");
  if (action === "finish-click") {
    timer = registerFinishClick(timer);
    render();
  }
});

circle.addEventListener("dblclick", () => {
  if (dragged) {
    return;
  }

  const action = getCircleAction(timer.status, "dblclick");
  if (action !== "toggle") {
    return;
  }
  toggleTimer();
});

circle.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return;
  }

  dragStartPoint = { x: event.screenX, y: event.screenY };
  dragged = false;
  circle.setPointerCapture(event.pointerId);
  window.pomodoro.startWindowDrag(dragStartPoint);
});

circle.addEventListener("pointermove", (event) => {
  if (!dragStartPoint) {
    return;
  }

  const point = { x: event.screenX, y: event.screenY };
  if (Math.hypot(point.x - dragStartPoint.x, point.y - dragStartPoint.y) > 3) {
    dragged = true;
  }
  window.pomodoro.moveWindowDrag(point);
});

circle.addEventListener("pointerup", (event) => {
  if (dragStartPoint) {
    window.pomodoro.endWindowDrag();
  }
  dragStartPoint = undefined;
  if (circle.hasPointerCapture(event.pointerId)) {
    circle.releasePointerCapture(event.pointerId);
  }
});

circle.addEventListener("pointercancel", () => {
  dragStartPoint = undefined;
  window.pomodoro.endWindowDrag();
});

window.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  window.pomodoro.showContextMenu();
});

window.pomodoro.onMenuCommand(({ command, value }) => {
  if (command === "duration") {
    chooseDuration(value);
  }
  if (command === "toggle") {
    toggleTimer();
  }
  if (command === "reset") {
    resetCurrentTimer();
  }
  if (command === "finish-click" && timer.status === "finished") {
    timer = registerFinishClick(timer);
    render();
  }
});

setInterval(() => {
  const now = Date.now();
  const elapsed = now - lastTick;
  lastTick = now;
  timer = tickTimer(timer, elapsed);
  render();
}, 250);

render();
