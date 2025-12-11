import { atom } from 'jotai'

// Market data atoms
export const marketDataAtom = atom({
  stocks: [],
  currencies: [],
  lastUpdated: null
})

// Predictions atoms
export const predictionsAtom = atom({
  '1h': {},
  '4h': {},
  '1d': {},
  '1w': {}
})

// UI state atoms
export const selectedAssetAtom = atom(null)
export const selectedTimeframeAtom = atom('1d')
export const isChildModeAtom = atom(false)

// Loading states
export const loadingAtom = atom(false)
export const errorAtom = atom(null)