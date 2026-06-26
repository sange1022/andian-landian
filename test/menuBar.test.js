const test = require("node:test");
const assert = require("node:assert/strict");

const { getMenuBarTitle } = require("../src/menuBar");

test("menu bar title shows remaining minutes while app is active", () => {
  assert.equal(getMenuBarTitle({ remainingText: "25", status: "idle" }), "25");
  assert.equal(getMenuBarTitle({ remainingText: "4", status: "running" }), "4");
  assert.equal(getMenuBarTitle({ remainingText: "0", status: "finished" }, true), "0");
});

test("menu bar title blinks blank during finished alert", () => {
  assert.equal(getMenuBarTitle({ remainingText: "0", status: "finished" }, false), "");
});
