function getDraggedWindowPosition(startWindowPosition, startPointer, pointer) {
  return [
    Math.round(startWindowPosition[0] + pointer.x - startPointer.x),
    Math.round(startWindowPosition[1] + pointer.y - startPointer.y)
  ];
}

module.exports = {
  getDraggedWindowPosition
};

