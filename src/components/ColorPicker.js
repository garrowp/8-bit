import * as React from 'react'
import { SketchPicker } from "react-color";
import { motion } from "framer-motion";

import { useAppState, useAppDispatch } from "../hooks";

const variants = {
  initial: {
    top: "-100%",
    transition: { duration: 0.4 },
  },
  animate: {
    top: 0,
    transition: { duration: 0.4 },
  },
};

const MemoSketchPicker = React.memo(SketchPicker)

function ColorPicker({ menuOpen }) {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const { color } = state;
  const changeColor = (newColor) =>
    dispatch({ type: "CHANGE_COLOR", color: newColor.rgb });
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate={menuOpen ? "animate" : "initial"}
      style={{
        display: `grid`,
        position: "absolute",
        top: 0,
        right: 50,
        padding: "1em",
      }}
    >
      <div style={{ placeSelf: `center` }}>
        <MemoSketchPicker color={color} onChange={changeColor} />
      </div>
    </motion.div>
  );
}

export { ColorPicker };
