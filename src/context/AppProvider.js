import * as React from 'react'

import { useWindowSize } from '../hooks/useWindowSize'
import { getRGBAColor } from '../utils'
import { cellSize } from '../constants'
import { exportData } from '../export-data'

const generateRandomColor = () => Math.floor(Math.random() * 255)

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()

function fillGrid(originalGrid, initialRow, initialCol, color, targetColor) {
  const stringifiedGrid = JSON.stringify(originalGrid)
  const grid = JSON.parse(stringifiedGrid)

  const floodFill = (row, col, color, targetColor) => {
    const q = []
    q.push({ row, col })
    while (q.length > 0) {
      const { row, col } = q.shift()
      let w = col
      let e = col
      while (grid[row][w - 1] && grid[row][w - 1].color === targetColor) {
        w--
      }
      while (grid[row][e + 1] && grid[row][e + 1].color === targetColor) {
        e++
      }

      for (let i = w; i < e + 1; i++) {
        grid[row][i].color = color
        if (grid[row - 1] && grid[row - 1][i].color === targetColor) {
          q.push({ row: row - 1, col: i })
        }
        if (grid[row + 1] && grid[row + 1][i].color === targetColor) {
          q.push({ row: row + 1, col: i })
        }
      }
    }
  }

  floodFill(initialRow, initialCol, color, targetColor)

  return grid
}

function makeGrid(rows, cols) {
  return new Array(rows).fill(
    new Array(cols).fill({
      color: null,
    })
  )
}

function paintGridCell(grid, color, toolType, { row, column }) {
  const rgbaColor = getRGBAColor(color)
  if (toolType === 'fill') {
    return fillGrid(grid, row, column, rgbaColor, grid[row][column].color)
  }
  return grid.map((cells, rI) => {
    if (rI === row) {
      return cells.map((cell, cI) => {
        if (cI === column) {
          if (toolType === 'eraser') {
            return { ...cell, color: null }
          }
          return { ...cell, color: rgbaColor }
        }
        return cell
      })
    }
    return cells
  })
}

function pushToHistory(history, grid) {
  const stringifiedGrid = JSON.stringify(grid)
  const parsedGrid = JSON.parse(stringifiedGrid)
  return [...history, parsedGrid]
}

function popFromHistoryToRedoHistory(history, redoHistory) {
  if (history.length === 1) {
    return {}
  }
  const newHistory = [...history]
  const lastItemInHistory = newHistory.pop()
  const newGrid = newHistory[newHistory.length - 1]
  const newData = exportData(newGrid)
  return {
    grid: newGrid,
    history: newHistory,
    redoHistory: [...redoHistory, lastItemInHistory],
    exportData: newData,
  }
}

function propFromRedoHistoryToHistory(history, redoHistory) {
  if (redoHistory.length === 0) {
    return {}
  }

  const newRedoHistory = [...redoHistory]
  const lastItemInRedoHistory = newRedoHistory.pop()
  const newGrid = lastItemInRedoHistory
  const newData = exportData(newGrid)
  return {
    grid: newGrid,
    history: [...history, lastItemInRedoHistory],
    redoHistory: newRedoHistory,
    data: newData,
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'PAINT_GRID_CELL': {
      if (state.clicked) {
        const newGrid = paintGridCell(
          state.grid,
          state.color,
          state.toolType,
          action
        )
        // const newData = exportData(newGrid)
        return {
          ...state,
          grid: newGrid,
          // exportData: newData,
        }
      }
      return state
    }
    case 'MOUSE_DOWN': {
      return {
        ...state,
        clicked: true,
      }
    }
    case 'MOUSE_UP': {
      const newData = exportData(state.grid)
      return {
        ...state,
        clicked: false,
        history: pushToHistory(state.history, state.grid),
        redoHistory: [],
        exportData: newData,
      }
    }
    case 'UNDO': {
      return {
        ...state,
        ...popFromHistoryToRedoHistory(state.history, state.redoHistory),
      }
    }
    case 'REDO': {
      return {
        ...state,
        ...propFromRedoHistoryToHistory(state.history, state.redoHistory),
      }
    }
    case 'CHANGE_COLOR': {
      return {
        ...state,
        color: action.color,
      }
    }
    case 'NEW_EXPORT_DATA': {
      return {
        ...state,
        exportData: action.data,
      }
    }
    case 'SET_TOOL_TYPE': {
      return {
        ...state,
        toolType: action.toolType,
      }
    }
    case 'CLEAR_GRID': {
      const initialGrid = makeGrid(state.rows, state.cols)
      const newData = exportData(initialGrid)
      console.log({ newData })
      return {
        ...state,
        grid: initialGrid,
        history: pushToHistory(state.history, initialGrid),
        redoHistory: [],
        exportData: newData,
      }
    }
    case 'WINDOW_SIZE_CHANGE': {
      const newGrid = makeGrid(action.rows, action.cols)
      return {
        ...state,
        rows: action.rows,
        cols: action.cols,
        grid: newGrid,
        history: [newGrid],
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({ children }) {
  const { width, height } = useWindowSize()
  const cols = Math.ceil(width / cellSize) || 100
  const rows = Math.ceil(height / cellSize) || 100
  const initialGrid = makeGrid(rows, cols)
  const initialColor = {
    r: generateRandomColor(),
    g: generateRandomColor(),
    b: generateRandomColor(),
    a: 1,
  }
  const [state, dispatch] = React.useReducer(appReducer, {
    grid: initialGrid,
    color: initialColor,
    rows: rows,
    cols: cols,
    clicked: false,
    history: [initialGrid],
    redoHistory: [],
    exportData: {
      height: 0,
      width: 0,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      items: [],
    },
    toolType: 'pencil',
  })

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export { AppProvider, AppDispatchContext, AppStateContext }
