import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { ToastProvider } from 'react-toast-notifications'

import './App.css'

import { AppProvider } from './context/AppProvider'
import { Grid } from './components/Grid'
import { ColorPicker } from './components/ColorPicker'
import { BentoMenu } from './components/BentoMenu'
import { Tools } from './components/Tools'
import { CodeDrawer } from './components/CodeDrawer'

export default function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [codeDrawerOpen, setCodeDrawerOpen] = React.useState(false)
  const toggleCodeDrawer = () => setCodeDrawerOpen(!codeDrawerOpen)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  useHotkeys(
    'escape',
    () => {
      if (menuOpen) {
        toggleMenu()
      }
      if (codeDrawerOpen) {
        toggleCodeDrawer()
      }
    },
    [menuOpen, codeDrawerOpen]
  )

  return (
    <ToastProvider
      autoDismiss
      autoDismissTimeout={3000}
      placement='bottom-center'
    >
      <div
        style={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <AppProvider>
          <Grid />
          <BentoMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
          <ColorPicker menuOpen={menuOpen} />
          <Tools menuOpen={menuOpen} />
          <CodeDrawer
            codeDrawerOpen={codeDrawerOpen}
            toggleCodeDrawer={toggleCodeDrawer}
          />
        </AppProvider>
      </div>
    </ToastProvider>
  )
}
