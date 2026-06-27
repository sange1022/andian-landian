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

test("timer refresh does not overwrite a focused custom input", () => {
  assert.equal(shouldSyncCustomMinutes(true), false);
  assert.equal(shouldSyncCustomMinutes(false), true);
});
