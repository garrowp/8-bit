export function exportData(grid) {
  const originalItems = []
  let minX = null
  let maxX = null
  let minY = null
  let maxY = null

  grid.forEach((cells, rI) => {
    cells.forEach((cell, cI) => {
      const cellIsColored = Boolean(cell.color)

      if (cellIsColored) {
        if (minX === null || cI < minX) {
          minX = cI
        }

        if (maxX === null || cI > maxX) {
          maxX = cI
        }

        if (minY === null || rI < minY) {
          minY = rI
        }

        if (minY === null || rI > maxY) {
          maxY = rI
        }

        originalItems.push({
          x: cI,
          y: rI,
          fill: cell.color,
        })
      }
    })
  })

  const modifiedItems = originalItems.map((item) => ({
    ...item,
    x: item.x - minX,
    y: item.y - minY,
  }))

  const data = {
    maxX,
    maxY,
    minX,
    minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    items: modifiedItems,
  }

  return data
}
