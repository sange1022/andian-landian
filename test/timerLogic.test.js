const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createTimer,
  selectDuration,
  startTimer,
  tickTimer,
  registerFinishClick,
  getCircleVisual
} = require("../src/timerLogic");

test("25, 45, and custom whole-minute durations are accepted", () => {
  assert.equal(selectDuration(createTimer(), 25).durationMinutes, 25);
  assert.equal(selectDuration(createTimer(), 45).durationMinutes, 45);
  assert.equal(selectDuration(createTimer(), 30).durationMinutes, 30);
  assert.equal(selectDuration(createTimer(), 30).remainingMs, 30 * 60 * 1000);
  assert.throws(() => selectDuration(createTimer(), 0), /between 1 and 180/);
  assert.throws(() => selectDuration(createTimer(), 181), /between 1 and 180/);
  assert.throws(() => selectDuration(createTimer(), 1.5), /whole minutes/);
});

test("circle is opaque when idle and stays translucent while running", () => {
  const idle = selectDuration(createTimer(), 25);
  const timer = startTimer(selectDuration(createTimer(), 25));

  const idleVisual = getCircleVisual(idle);
  const startVisual = getCircleVisual(timer);
  const halfVisual = getCircleVisual(tickTimer(timer, 12.5 * 60 * 1000));

  assert.equal(idleVisual.opacity, 1);
  assert.equal(startVisual.opacity, 0.36);
  assert.equal(halfVisual.opacity, 0.36);
  assert.equal(startVisual.color, "#002FA7");
});

test("timer enters finished state at zero remaining time", () => {
  const timer = startTimer(selectDuration(createTimer(), 25));
  const finished = tickTimer(timer, 25 * 60 * 1000);

  assert.equal(finished.status, "finished");
  assert.equal(finished.remainingMs, 0);
  assert.equal(getCircleVisual(finished).isAlerting, true);
});

test("finished alert requires three consecutive clicks to dismiss", () => {
  const timer = tickTimer(startTimer(selectDuration(createTimer(), 25)), 25 * 60 * 1000);

  const first = registerFinishClick(timer);
  const second = registerFinishClick(first);
  const third = registerFinishClick(second);

  assert.equal(first.dismissClicks, 1);
  assert.equal(first.status, "finished");
  assert.equal(second.dismissClicks, 2);
  assert.equal(second.status, "finished");
  assert.equal(third.dismissClicks, 0);
  assert.equal(third.status, "idle");
  assert.equal(third.remainingMs, 25 * 60 * 1000);
});
