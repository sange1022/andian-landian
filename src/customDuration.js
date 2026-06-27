(function exposeCustomDuration(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.customDuration = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createApi() {
  function parseCustomMinutes(value) {
    const minutes = Number(value);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
      return null;
    }
    return minutes;
  }

  function shouldSyncCustomMinutes(isFocused) {
    return !isFocused;
  }

  return { parseCustomMinutes, shouldSyncCustomMinutes };
});
