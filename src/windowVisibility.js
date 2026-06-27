function getWindowVisibilityMenuItem(isVisible) {
  return isVisible
    ? { label: "隐藏蓝点", action: "hide" }
    : { label: "显示蓝点", action: "show" };
}

module.exports = { getWindowVisibilityMenuItem };
