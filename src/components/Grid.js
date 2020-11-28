/* eslint-disable no-func-assign */
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Cell } from "./Cell";

import { useAppDispatch, useWindowSize, useUndoRedo } from "../hooks";
import { withStateSlice } from "../HOC/withStateSlice";
import { cellSize } from "../constants";

function Grid({ state }) {

  const { undo, redo } = useUndoRedo();
  useHotkeys("cmd+z", () =>  undo(state.history, state.redoHistory), [state.history, state.redoHistory]);
  useHotkeys("cmd+shift+z", () => redo(state.redoHistory, state.history), [state.history, state.redoHistory]);
  const { grid, cols, rows } = state;
  const dispatch = useAppDispatch();
  const { width, height } = useWindowSize();
  const windowCols = Math.ceil(width / cellSize) || 100;
  const windowRows = Math.ceil(height / cellSize) || 100;

  React.useEffect(() => {
    dispatch({
      type: "WINDOW_SIZE_CHANGE",
      rows: windowRows,
      cols: windowCols,
    });
  }, [windowCols, windowRows, dispatch]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        overflow: "hidden",
        maxHeight: '100vh',
      }}
    >
      {grid && grid.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          const defaultBG =
            (rowIndex % 2 === 0 && colIndex % 2 === 0) ||
            (rowIndex % 2 === 1 && colIndex % 2 === 1)
              ? "#fff"
              : "lightgrey";
          const bg = cell.color ? cell.color : defaultBG;

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              bg={bg}
              row={rowIndex}
              column={colIndex}
            />
          );
        });
      })}
    </div>
  );
}

Grid = withStateSlice(Grid, (state) => ({
  grid: state.grid,
  rows: state.rows,
  cols: state.cols,
  history: state.history,
  redoHistory: state.redoHistory,
}));

export { Grid };
