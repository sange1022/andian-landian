const test = require("node:test");
const assert = require("node:assert/strict");

const { getDraggedWindowPosition } = require("../src/windowDrag");

test("dragged window position follows pointer delta", () => {
  assert.deepEqual(
    getDraggedWindowPosition([100, 200], { x: 20, y: 30 }, { x: 45, y: 80 }),
    [125, 250]
  );
});

