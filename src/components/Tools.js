/* eslint-disable no-func-assign */
import * as React from 'react'
import {
  GrUndo,
  GrRedo,
  GrPaint,
  GrEdit,
  GrErase,
  GrTrash,
} from 'react-icons/gr'
import { motion } from 'framer-motion'

import { useAppDispatch, useAppState, useUndoRedo } from '../hooks'
import { getRGBAColor } from '../utils'

const toolsVariants = {
  initial: {
    width: 0,
    right: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.1,
    },
  },
  animate: {
    width: 35,
    right: 10,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
}

const toolVariant = {
  initial: {
    right: -50,
    transition: { duration: 0.1 },
  },
  animate: {
    right: 0,
    transition: { duration: 0.1 },
  },
}

function Tool({ Icon, style, ...props }) {
  const { color: originalColor } = useAppState()
  const color = originalColor ? getRGBAColor(originalColor) : 'green'
  return (
    <motion.button
      variants={toolVariant}
      style={{
        position: 'relative',
        width: 35,
        height: 35,
        display: 'grid',
        placeItems: 'center',
        background: '#fff',
        borderRadius: 10,
        boxShadow: '-1px 0px 10px rgba(100,100,100,.5)',
        cursor: 'pointer',
        borderColor: color,
        borderStyle: 'solid',
        borderWidth: 0,
        outlineColor: color,
        ...style,
      }}
      {...props}
    >
      {Icon}
    </motion.button>
  )
}

function UndoTool() {
  const state = useAppState()
  const { history } = state
  const { undo } = useUndoRedo()

  const emptyHistory = history.length === 1
  const color = emptyHistory ? 'lightgrey' : null

  return (
    <Tool
      Icon={<GrUndo color={color} size='1.5em' />}
      onClick={React.useCallback(() => undo(history), [history, undo])}
      disabled={emptyHistory}
    />
  )
}

function RedoTool() {
  const state = useAppState()
  const { redoHistory } = state
  const { redo } = useUndoRedo()

  const emptyRedoHistory = redoHistory && redoHistory.length === 0
  const color = emptyRedoHistory ? 'lightgrey' : null

  return (
    <Tool
      Icon={<GrRedo color={color} size='1.5em' />}
      onClick={React.useCallback(() => redo(redoHistory), [redoHistory, redo])}
      disabled={emptyRedoHistory}
    />
  )
}

function FillTool({ toolType, color }) {
  const dispatch = useAppDispatch()

  return (
    <Tool
      Icon={<GrPaint size='1.5em' />}
      onClick={() => dispatch({ type: 'SET_TOOL_TYPE', toolType: 'fill' })}
      style={
        toolType === 'fill'
          ? { borderWidth: 2, borderStyle: 'solid' }
          : { borderWidth: 0, borderStyle: 'none' }
      }
    />
  )
}

function PencilTool({ toolType, color }) {
  const dispatch = useAppDispatch()

  return (
    <Tool
      Icon={<GrEdit size='1.5em' />}
      onClick={() => dispatch({ type: 'SET_TOOL_TYPE', toolType: 'pencil' })}
      style={
        toolType === 'pencil'
          ? { borderWidth: 2, borderStyle: 'solid' }
          : { borderWidth: 0, borderStyle: 'none' }
      }
    />
  )
}

function EraserTool({ toolType, color }) {
  const dispatch = useAppDispatch()

  return (
    <Tool
      Icon={<GrErase size='1.5em' />}
      onClick={() => dispatch({ type: 'SET_TOOL_TYPE', toolType: 'eraser' })}
      style={
        toolType === 'eraser'
          ? { borderWidth: 2, borderStyle: 'solid' }
          : { borderWidth: 0, borderStyle: 'none' }
      }
    />
  )
}

function TrashTool() {
  const dispatch = useAppDispatch()

  return (
    <Tool
      Icon={<GrTrash size='1.5em' />}
      onClick={() => dispatch({ type: 'CLEAR_GRID' })}
    />
  )
}

function Tools({ menuOpen }) {
  const { toolType } = useAppState()

  return (
    <motion.div
      variants={toolsVariants}
      initial='initial'
      animate={menuOpen ? 'animate' : 'initial'}
      style={{
        display: 'grid',
        gridTemplateColumns: 35,
        gap: '5px',
        position: 'absolute',
        top: 70,
      }}
    >
      <UndoTool />
      <RedoTool />
      <FillTool toolType={toolType} />
      <PencilTool toolType={toolType} />
      <EraserTool toolType={toolType} />
      <TrashTool />
    </motion.div>
  )
}

export { Tools }
