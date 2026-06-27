const time = document.getElementById("time");
const state = document.getElementById("state");
const duration5 = document.getElementById("duration5");
const duration25 = document.getElementById("duration25");
const duration45 = document.getElementById("duration45");
const customMinutes = document.getElementById("customMinutes");
const {
  parseCustomMinutes,
  shouldSyncCustomMinutes
} = window.customDuration;

let currentDuration = 25;
let isCustomEditing = false;
let pendingCustomMinutes = null;

function command(commandName, value) {
  window.pomodoro.sendSettingsCommand({ command: commandName, value });
}

function setDurationButton(minutes) {
  duration5.classList.toggle("active", minutes === 5);
  duration25.classList.toggle("active", minutes === 25);
  duration45.classList.toggle("active", minutes === 45);
}

function choosePresetDuration(minutes) {
  isCustomEditing = false;
  pendingCustomMinutes = null;
  command("duration", minutes);
}

duration5.addEventListener("click", () => choosePresetDuration(5));
duration25.addEventListener("click", () => choosePresetDuration(25));
duration45.addEventListener("click", () => choosePresetDuration(45));

customMinutes.addEventListener("input", () => {
  isCustomEditing = true;
  pendingCustomMinutes = null;
});

function applyCustomDuration() {
  const minutes = parseCustomMinutes(customMinutes.value);
  if (minutes === null) {
    customMinutes.value = String(currentDuration);
    isCustomEditing = false;
    pendingCustomMinutes = null;
    return;
  }
  isCustomEditing = true;
  pendingCustomMinutes = minutes;
  command("duration", minutes);
}

document.getElementById("setCustom").addEventListener("click", applyCustomDuration);
customMinutes.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }
  event.preventDefault();
  applyCustomDuration();
});
document.getElementById("toggle").addEventListener("click", () => command("toggle"));
document.getElementById("reset").addEventListener("click", () => command("reset"));
document.getElementById("quit").addEventListener("click", () => command("quit"));

window.pomodoro.onTimerState((timerState) => {
  currentDuration = timerState.durationMinutes;
  time.textContent = timerState.remainingText;
  state.textContent = timerState.status;
  if (shouldSyncCustomMinutes({
    isEditing: isCustomEditing,
    pendingMinutes: pendingCustomMinutes,
    timerMinutes: timerState.durationMinutes
  })) {
    customMinutes.value = String(timerState.durationMinutes);
    isCustomEditing = false;
    pendingCustomMinutes = null;
  }
  setDurationButton(timerState.durationMinutes);
});

setDurationButton(25);
