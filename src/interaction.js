(function exposeInteraction(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.interaction = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createApi() {
  function getCircleAction(status, eventType) {
    if (status === "finished" && eventType === "click") {
      return "finish-click";
    }

    if ((status === "idle" || status === "paused" || status === "running") && eventType === "dblclick") {
      return "toggle";
    }

    return "none";
  }

  return {
    getCircleAction
  };
});
