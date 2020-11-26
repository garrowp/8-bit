import * as React from 'react'

import { useAppDispatch } from './useAppDispatch'
import { exportData } from '../export-data'

export function useExportData(grid) {
  const dispatch = useAppDispatch()

  const updateExportData = React.useCallback(() => {
    const newData = exportData(grid)
    dispatch({ type: 'NEW_EXPORT_DATA', data: newData })
  }, [grid, dispatch])

  return { updateExportData }
}
