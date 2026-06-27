const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseCustomMinutes,
  shouldSyncCustomMinutes
} = require("../src/customDuration");

test("custom minutes accept only whole values from 1 through 180", () => {
  assert.equal(parseCustomMinutes("35"), 35);
  assert.equal(parseCustomMinutes("0"), null);
  assert.equal(parseCustomMinutes("181"), null);
  assert.equal(parseCustomMinutes("1.5"), null);
  assert.equal(parseCustomMinutes(""), null);
});

test("timer refresh preserves an edited value until its duration is confirmed", () => {
  assert.equal(shouldSyncCustomMinutes({
    isEditing: false,
    pendingMinutes: null,
    timerMinutes: 25
  }), true);
  assert.equal(shouldSyncCustomMinutes({
    isEditing: true,
    pendingMinutes: null,
    timerMinutes: 25
  }), false);
  assert.equal(shouldSyncCustomMinutes({
    isEditing: true,
    pendingMinutes: 35,
    timerMinutes: 25
  }), false);
  assert.equal(shouldSyncCustomMinutes({
    isEditing: true,
    pendingMinutes: 35,
    timerMinutes: 35
  }), true);
});
