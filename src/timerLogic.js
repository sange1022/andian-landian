(function exposeTimerLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.timerLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createApi() {
  const KLEIN_BLUE = "#002FA7";
  const RUNNING_OPACITY = 0.36;

  function durationToMs(minutes) {
    return minutes * 60 * 1000;
  }

  function createTimer() {
    return {
      durationMinutes: 25,
      durationMs: durationToMs(25),
      remainingMs: durationToMs(25),
      status: "idle",
      dismissClicks: 0
    };
  }

  function selectDuration(timer, minutes) {
    if (!Number.isInteger(minutes)) {
      throw new Error("Duration must be set in whole minutes.");
    }
    if (minutes < 1 || minutes > 180) {
      throw new Error("Duration must be between 1 and 180 minutes.");
    }

    return {
      ...timer,
      durationMinutes: minutes,
      durationMs: durationToMs(minutes),
      remainingMs: durationToMs(minutes),
      status: "idle",
      dismissClicks: 0
    };
  }

  function startTimer(timer) {
    if (timer.status === "finished") {
      return timer;
    }

    return {
      ...timer,
      status: "running",
      dismissClicks: 0
    };
  }

  function pauseTimer(timer) {
    if (timer.status !== "running") {
      return timer;
    }

    return {
      ...timer,
      status: "paused"
    };
  }

  function resetTimer(timer) {
    return {
      ...timer,
      remainingMs: timer.durationMs,
      status: "idle",
      dismissClicks: 0
    };
  }

  function tickTimer(timer, elapsedMs) {
    if (timer.status !== "running") {
      return timer;
    }

    const remainingMs = Math.max(0, timer.remainingMs - elapsedMs);

    return {
      ...timer,
      remainingMs,
      status: remainingMs === 0 ? "finished" : "running",
      dismissClicks: 0
    };
  }

  function registerFinishClick(timer) {
    if (timer.status !== "finished") {
      return timer;
    }

    const dismissClicks = timer.dismissClicks + 1;
    if (dismissClicks >= 3) {
      return resetTimer(timer);
    }

    return {
      ...timer,
      dismissClicks
    };
  }

  function getCircleVisual(timer) {
    const opacity = timer.status === "running" ? RUNNING_OPACITY : 1;

    return {
      color: KLEIN_BLUE,
      opacity,
      minutesText: String(Math.ceil(timer.remainingMs / 60000)),
      isAlerting: timer.status === "finished"
    };
  }

  return {
    createTimer,
    selectDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
    registerFinishClick,
    getCircleVisual
  };
});
