/* eslint-disable no-func-assign */
import * as React from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";

import { getRGBAColor, getContrast } from "../utils";
import { withStateSlice } from "../HOC/withStateSlice";

const boxPositions = {
  "top-left": {
    x: "100%",
    y: "100%",
  },
  "top-right": {
    x: 0,
    y: "100%",
  },
  "bottom-left": {
    x: "100%",
    y: 0,
  },
  "bottom-right": {
    x: 0,
    y: 0,
  },
};

const boxVariants = {
  initial: {
    opacity: 1,
    height: "100%",
    width: "100%",
    x: 0,
    y: 0,
    transition: { duration: 0.1 },
  },
  animate: ({ pos }) => {
    return {
      opacity: 0,
      height: 0,
      width: 0,
      ...boxPositions[pos],
      transition: { duration: 0.1 },
    };
  },
};

const closeVariants = {
  initial: {
    opacity: 0,
    height: 0,
    width: 0,
  },
  animate: {
    opacity: 1,
    height: 35,
    width: 35,
    transition: { duration: 0.1, delay: 0.5 },
  },
};

const menuVariants = {
  initial: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  animate: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

function BentoMenuBox({ foreground, ...props }) {
  return (
    <motion.div
      style={{
        height: "100%",
        width: "100%",
        border: `2px solid ${foreground}`,
        borderRadius: "2px",
      }}
      {...props}
    />
  );
}

function BentoMenu({ state: color, menuOpen, toggleMenu }) {
  const background = color ? getRGBAColor(color) : 'white';
  const foreground = color ?  getContrast({ ...color }) : 'black';

  return (
    <motion.button
      variants={menuVariants}
      initial="initial"
      animate={menuOpen ? "animate" : "initial"}
      style={{
        position: "absolute",
        top: "7px",
        right: "7px",
        cursor: "pointer",

        height: "45px",
        width: "45px",
        borderRadius: "50%",
        backgroundColor: background,
        boxShadow: "-1px 0px 10px rgba(100,100,100,.5)",
        display: "grid",
        placeItems: "center",
        border: 'none'
      }}
      onClick={toggleMenu}
    >
      <motion.div
        variants={closeVariants}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "35px",
          width: "35px",
          display: "grid",
          placeItems: "center",
        }}
      >
        <MdClose color={foreground} size="100%" />
      </motion.div>
      <div
        style={{
          display: "grid",
          gap: "3px",
          gridTemplateColumns: "repeat(2, 10px)",
          gridTemplateRows: "repeat(2, 10px)",
        }}
      >
        <BentoMenuBox
          foreground={foreground}
          variants={boxVariants}
          custom={{ pos: "top-left" }}
        />
        <BentoMenuBox
          foreground={foreground}
          variants={boxVariants}
          custom={{ pos: "top-right" }}
        />
        <BentoMenuBox
          foreground={foreground}
          variants={boxVariants}
          custom={{ pos: "bottom-left" }}
        />
        <BentoMenuBox
          foreground={foreground}
          variants={boxVariants}
          custom={{ pos: "bottom-right" }}
        />
      </div>
    </motion.button>
  );
}

BentoMenu = withStateSlice(BentoMenu, (state) => state.color);

export { BentoMenu };
