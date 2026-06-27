function resizeBoundsAroundCenter(bounds, width, height) {
  return {
    x: Math.round(bounds.x + (bounds.width - width) / 2),
    y: Math.round(bounds.y + (bounds.height - height) / 2),
    width,
    height
  };
}

module.exports = { resizeBoundsAroundCenter };
