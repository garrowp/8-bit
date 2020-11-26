/* eslint-disable no-func-assign */
import { useAppDispatch } from "../hooks";
import { withStateSlice } from "../HOC/withStateSlice";
import { cellSize } from "../constants";

function Cell({ state, bg, row, column, ...props }) {
  const dispatch = useAppDispatch();

  return (
    <div
      onMouseDown={() => {
        dispatch({ type: "MOUSE_DOWN", row, column });
        dispatch({ type: "PAINT_GRID_CELL", row, column });
      }}
      onMouseUp={() => dispatch({ type: "MOUSE_UP" })}
      onMouseOver={() => dispatch({ type: "PAINT_GRID_CELL", row, column })}
      style={{
        height: cellSize,
        width: cellSize,
        display: "grid",
        placeItems: "center",
        backgroundColor: bg,
      }}
      {...props}
    />
  );
}

Cell = withStateSlice(
  Cell,
  (state, { row, column }) => state.grid[row][column]
);

export { Cell };
