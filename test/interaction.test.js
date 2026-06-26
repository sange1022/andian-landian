const test = require("node:test");
const assert = require("node:assert/strict");

const { getCircleAction } = require("../src/interaction");

test("single click does not start or pause an active timer state", () => {
  assert.equal(getCircleAction("idle", "click"), "none");
  assert.equal(getCircleAction("running", "click"), "none");
  assert.equal(getCircleAction("paused", "click"), "none");
});

test("double click toggles start and pause for active timer states", () => {
  assert.equal(getCircleAction("idle", "dblclick"), "toggle");
  assert.equal(getCircleAction("running", "dblclick"), "toggle");
  assert.equal(getCircleAction("paused", "dblclick"), "toggle");
});

test("finished timer still uses single clicks for three-click dismissal", () => {
  assert.equal(getCircleAction("finished", "click"), "finish-click");
});

