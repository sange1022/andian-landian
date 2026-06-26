const test = require("node:test");
const assert = require("node:assert/strict");

const { PRESET_DURATIONS } = require("../src/durations");

test("preset durations include 5, 25, and 45 minutes", () => {
  assert.deepEqual(PRESET_DURATIONS, [5, 25, 45]);
});
