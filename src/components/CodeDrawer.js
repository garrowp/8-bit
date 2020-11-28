/* eslint-disable no-func-assign */
import * as React from 'react'
import { motion } from 'framer-motion'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwlLight'
import useClipboard from 'react-use-clipboard'
import { GrCheckmark, GrCopy, GrCode } from 'react-icons/gr'
import { useToasts } from 'react-toast-notifications'

import { cellSize } from '../constants'
import { withStateSlice } from '../HOC/withStateSlice'

const titleColors = {
  jsx: '#7FB685',
  svg: '#FDDD9B',
  json: '#84C0C6',
}

const variants = {
  initial: {
    bottom: -250,
  },
  animate: {
    bottom: 0,
    transition: { duration: 0.1 },
  },
}

function CopyButton({ target, toastText }) {
  const { addToast } = useToasts()
  const [isCopied, setCopied] = useClipboard(target, { successDuration: 5000 })
  const handleClick = () => {
    setCopied()
    addToast(`Copied ${toastText} to clipboard.`, {
      appearance: 'success',
      autoDismiss: true,
    })
  }
  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '1em',
        right: 0,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        border: '1px solid lightgrey',
        borderRadius: '0 0 0 4px',
        padding: '2px 12px',
      }}
    >
      {isCopied ? <GrCheckmark size='1.5em' /> : <GrCopy size='1.5em' />}
    </button>
  )
}

function CodeBlockTitle({ title }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '.65em',
        left: '.5em',
        fontFamily: 'monospace',
        fontSize: '1.5em',
        padding: '2px 12px',
        backgroundColor: titleColors[title],
        border: '1px solid lightgrey',
        borderRadius: '0 0 4px 4px',
      }}
    >
      {title.toUpperCase()}
    </div>
  )
}

function CodeBlock({ language, code, title, toastText }) {
  return (
    <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CopyButton target={code} toastText={toastText} />
      <CodeBlockTitle title={title} />
      <Highlight
        {...defaultProps}
        theme={theme}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className}
            style={{
              ...style,
              overflow: 'scroll',
              padding: '0.5em',
              paddingTop: '2.5em',
              border: '1px solid lightgrey',
              height: 'calc(100% - 2em)',
            }}
          >
            {tokens.map((line, i) => (
              <div
                {...getLineProps({
                  line,
                  key: i,
                  style: { paddingRight: '1em' },
                })}
              >
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

CodeBlock = React.memo(CodeBlock)

function Component() {
  const code = `function SVGImage({ data, size }) {
  const height = data.height * size;
  const width = data.width * size;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg
        key={\`\${item.x}-\${item.y}\`}
        height={height}
        width={width}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        {data.items.map((item) => {
          return (
            <rect
              x={item.x * size}
              y={item.y * size}
              width={size}
              height={size}
              fill={item.fill}
            />
          );
        })}
      </svg>
    </div>
  );
}
  `

  return (
    <CodeBlock
      language='javascript'
      code={code}
      title='jsx'
      color='#FDDD9B'
      toastText={'React component'}
    />
  )
}

function SVGImage({ data, size = cellSize }) {
  const height = data.height * size
  const width = data.width * size

  const svgString = `<svg
  height="${height}px"
  width="${width}px"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
>
  ${data.items.map((item) => {
    return `<rect
        x="${item.x * size}px"
        y="${item.y * size}px"
        width="${size}px"
        height="${size}px"
        fill="${item.fill}"
      />`
  })}
</svg>`
  const imgSrc = `data:image/svg+xml;utf8,${svgString}`

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <img src={imgSrc} alt='SVG Preview' />
    </div>
  )
}

function JSONData({ data }) {
  const json = JSON.stringify(data, null, 2)

  return (
    <CodeBlock
      language='json'
      code={json}
      title={'json'}
      toastText='JSON data'
    />
  )
}

function SVGData({ data }) {
  const height = data.height * cellSize || 0
  const width = data.width * cellSize || 0
  const rects = data.items.map((item) => {
    return `<rect x={${item.x * cellSize}} y={${
      item.y * cellSize
    }} width={${cellSize}} height={${cellSize}} fill={${item.fill}} />`
  }).join(`
  `)
  const svg = `<svg height={${height}} width={${width}} version="1.1" xmlns="http://www.w3.org/2000/svg">
  ${rects}
</svg>`

  return (
    <CodeBlock language='svg' code={svg} title='svg' toastText='SVG code' />
  )
}

function OpenCodeDrawerButton(props) {
  return (
    <button
      style={{
        position: 'absolute',
        top: -52,
        right: 7,
        height: '45px',
        width: '45px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '-1px 0px 10px rgba(100,100,100,.5)',
        border: 'none',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
      }}
      {...props}
    >
      <GrCode size='2em' />
    </button>
  )
}

function CodeDrawer({ state: data, codeDrawerOpen, toggleCodeDrawer }) {
  return (
    <motion.div
      variants={variants}
      initial='initial'
      animate={codeDrawerOpen ? 'animate' : 'initial'}
      style={{
        position: 'absolute',
        width: '100%',
        height: 250,

        background: '#fff',
        boxShadow: '-1px 0px 10px rgba(100,100,100,.5)',
        padding: '0 1em',
      }}
    >
      <OpenCodeDrawerButton onClick={toggleCodeDrawer} />
      <div
        style={{
          width: '100%',
          height: '100%',

          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
          gap: '1em',

          overflowX: 'scroll'
        }}
      >
        <SVGImage data={data} size={10} />
        <JSONData data={data} />
        <SVGData data={data} />
        <Component />
      </div>
    </motion.div>
  )
}

CodeDrawer = withStateSlice(CodeDrawer, (state) => state.exportData)

export { CodeDrawer }
