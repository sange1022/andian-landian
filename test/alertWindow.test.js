const test = require("node:test");
const assert = require("node:assert/strict");

const { resizeBoundsAroundCenter } = require("../src/alertWindow");

test("alert bounds expand around the existing center", () => {
  assert.deepEqual(
    resizeBoundsAroundCenter({ x: 100, y: 200, width: 112, height: 112 }, 336, 336),
    { x: -12, y: 88, width: 336, height: 336 }
  );
});

test("normal bounds restore around the current alert center", () => {
  assert.deepEqual(
    resizeBoundsAroundCenter({ x: -12, y: 88, width: 336, height: 336 }, 112, 112),
    { x: 100, y: 200, width: 112, height: 112 }
  );
});
