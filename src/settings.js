const time = document.getElementById("time");
const state = document.getElementById("state");
const duration5 = document.getElementById("duration5");
const duration25 = document.getElementById("duration25");
const duration45 = document.getElementById("duration45");
const customMinutes = document.getElementById("customMinutes");

function command(commandName, value) {
  window.pomodoro.sendSettingsCommand({ command: commandName, value });
}

function setDurationButton(minutes) {
  duration5.classList.toggle("active", minutes === 5);
  duration25.classList.toggle("active", minutes === 25);
  duration45.classList.toggle("active", minutes === 45);
}

duration5.addEventListener("click", () => command("duration", 5));
duration25.addEventListener("click", () => command("duration", 25));
duration45.addEventListener("click", () => command("duration", 45));
document.getElementById("setCustom").addEventListener("click", () => {
  const minutes = Number(customMinutes.value);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
    customMinutes.value = "25";
    return;
  }
  command("duration", minutes);
});
document.getElementById("toggle").addEventListener("click", () => command("toggle"));
document.getElementById("reset").addEventListener("click", () => command("reset"));
document.getElementById("quit").addEventListener("click", () => command("quit"));

window.pomodoro.onTimerState((timerState) => {
  time.textContent = timerState.remainingText;
  state.textContent = timerState.status;
  customMinutes.value = String(timerState.durationMinutes);
  setDurationButton(timerState.durationMinutes);
});

setDurationButton(25);
