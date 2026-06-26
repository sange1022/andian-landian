function getMenuBarTitle(timerState, blinkVisible = true) {
  if (timerState.status === "finished" && !blinkVisible) {
    return "";
  }

  return String(timerState.remainingText);
}

module.exports = {
  getMenuBarTitle
};
