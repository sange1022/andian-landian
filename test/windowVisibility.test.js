const test = require("node:test");
const assert = require("node:assert/strict");

const { getWindowVisibilityMenuItem } = require("../src/windowVisibility");

test("visible blue dot offers hide", () => {
  assert.deepEqual(getWindowVisibilityMenuItem(true), {
    label: "隐藏蓝点",
    action: "hide"
  });
});

test("hidden blue dot offers show", () => {
  assert.deepEqual(getWindowVisibilityMenuItem(false), {
    label: "显示蓝点",
    action: "show"
  });
});
