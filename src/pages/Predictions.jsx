import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { predictionsAtom, selectedTimeframeAtom, loadingAtom, errorAtom, isChildModeAtom } from '../store/atoms'
import PredictionCard from '../components/PredictionCard'
import { RefreshCw, AlertCircle, Brain, Clock } from 'lucide-react'
import { fetchPredictions } from '../services/api'
import clsx from 'clsx'

export default function Predictions() {
  const [predictions, setPredictions] = useAtom(predictionsAtom)
  const [selectedTimeframe, setSelectedTimeframe] = useAtom(selectedTimeframeAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [error, setError] = useAtom(errorAtom)
  const [isChildMode] = useAtom(isChildModeAtom)

  const timeframes = [
    { key: '1h', label: '1 Hour', childLabel: '1 Hour ⏰' },
    { key: '4h', label: '4 Hours', childLabel: '4 Hours ⏰' },
    { key: '1d', label: '1 Day', childLabel: '1 Day 📅' },
    { key: '1w', label: '1 Week', childLabel: '1 Week 📆' }
  ]

  useEffect(() => {
    loadPredictions()
  }, [selectedTimeframe])

  const loadPredictions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPredictions(selectedTimeframe)
      setPredictions(prev => ({ ...prev, [selectedTimeframe]: data }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentPredictions = predictions[selectedTimeframe] || {}

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary-500" />
            <span>{isChildMode ? '🔮 AI Predictions!' : 'AI Market Predictions'}</span>
          </h1>
          <p className="text-gray-600 mt-2">
            {isChildMode ? 
              'Our smart computer tries to guess where prices will go!' :
              'AI-powered predictions for market direction across different timeframes'
            }
          </p>
        </div>
        
        <button onClick={loadPredictions} className="btn-secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {isChildMode && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">🤖 How AI Predictions Work</h3>
          <p className="text-purple-700 text-sm">
            Our computer looks at lots of information about stocks and currencies, then makes smart guesses about 
            whether prices will go up or down. Remember, these are just guesses - nobody can predict the future perfectly!
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-6">
        <Clock className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {isChildMode ? 'Pick a time:' : 'Select Timeframe:'}
        </span>
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.key}
              onClick={() => setSelectedTimeframe(timeframe.key)}
              className={clsx(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedTimeframe === timeframe.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {isChildMode ? timeframe.childLabel : timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary-500" />
            <span className="text-gray-600">
              {isChildMode ? 'AI is thinking...' : 'Loading predictions...'}
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isChildMode ? 'Oops! AI is having trouble' : 'Error Loading Predictions'}
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={loadPredictions} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      ) : Object.keys(currentPredictions).length === 0 ? (
        <div className="text-center py-20">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">
            {isChildMode ? 'No predictions yet!' : 'No predictions available'}
          </h2>
          <p className="text-gray-500">
            {isChildMode ? 'Try refreshing to get new predictions!' : 'Try refreshing or select a different timeframe'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(currentPredictions).map(([symbol, prediction]) => (
            <div key={symbol}>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span>{symbol}</span>
                {isChildMode && <span className="text-sm text-gray-500">({prediction.friendlyName})</span>}
              </h3>
              <PredictionCard prediction={prediction} timeframe={selectedTimeframe} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && Object.keys(currentPredictions).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            {isChildMode ? '⚠️ Important Reminder!' : '⚠️ Disclaimer'}
          </h3>
          <p className="text-yellow-700 text-sm">
            {isChildMode ? 
              'These are just smart guesses! Real trading involves real money and can be risky. Always ask a grown-up before making any money decisions!' :
              'These predictions are for educational purposes only. Past performance does not guarantee future results. Always consult with a financial advisor before making investment decisions.'
            }
          </p>
        </div>
      )}
    </div>
  )
}