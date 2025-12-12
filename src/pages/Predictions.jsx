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
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-ios-purple to-ios-pink rounded-ios-lg shadow-ios">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-ios-gray-900">
              {isChildMode ? 'AI Predictions!' : 'AI Market Predictions'}
            </h1>
            {isChildMode && <span className="text-3xl">🔮</span>}
          </div>
          <p className="text-ios-gray-600 text-lg">
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
        <div className="bg-gradient-to-r from-ios-purple/10 to-ios-pink/10 border-2 border-ios-purple/20 rounded-ios-xl p-6 shadow-ios">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">🤖</span>
            <h3 className="font-bold text-ios-purple text-lg">How AI Predictions Work</h3>
          </div>
          <p className="text-ios-purple/80 font-medium">
            Our computer looks at lots of information about stocks and currencies, then makes smart guesses about 
            whether prices will go up or down. Remember, these are just guesses - nobody can predict the future perfectly!
          </p>
        </div>
      )}

      <div className="card-glass">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-ios-blue to-ios-purple rounded-ios shadow-ios">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-ios-gray-700">
            {isChildMode ? 'Pick a time:' : 'Select Timeframe:'}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.key}
              onClick={() => setSelectedTimeframe(timeframe.key)}
              className={clsx(
                'px-4 py-3 rounded-ios text-sm font-bold transition-all duration-200 shadow-ios',
                selectedTimeframe === timeframe.key
                  ? 'bg-ios-blue text-white scale-105'
                  : 'bg-ios-gray-100 text-ios-gray-700 hover:bg-ios-gray-200 hover:scale-105'
              )}
            >
              {isChildMode ? timeframe.childLabel : timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="card-glass max-w-md mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-ios-purple to-ios-pink rounded-full">
                <RefreshCw className="h-6 w-6 animate-spin text-white" />
              </div>
            </div>
            <span className="text-ios-gray-700 font-medium">
              {isChildMode ? 'AI is thinking...' : 'Loading predictions...'}
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="card-glass max-w-md mx-auto text-center">
            <div className="p-4 bg-ios-red/10 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="h-12 w-12 text-ios-red" />
            </div>
            <h2 className="text-xl font-bold text-ios-gray-900 mb-2">
              {isChildMode ? 'Oops! AI is having trouble' : 'Error Loading Predictions'}
            </h2>
            <p className="text-ios-gray-600 mb-6">{error}</p>
            <button onClick={loadPredictions} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      ) : Object.keys(currentPredictions).length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="card-glass max-w-md mx-auto text-center">
            <div className="p-4 bg-ios-gray-100 rounded-full w-fit mx-auto mb-4">
              <Brain className="h-12 w-12 text-ios-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-ios-gray-600 mb-2">
              {isChildMode ? 'No predictions yet!' : 'No predictions available'}
            </h2>
            <p className="text-ios-gray-500">
              {isChildMode ? 'Try refreshing to get new predictions!' : 'Try refreshing or select a different timeframe'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(currentPredictions).map(([symbol, prediction]) => (
            <div key={symbol} className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-ios-gray-600 to-ios-gray-700 rounded-ios shadow-ios">
                  <span className="text-white font-bold text-sm">{symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-ios-gray-900">{symbol}</h3>
                  {isChildMode && (
                    <p className="text-sm text-ios-gray-500 font-medium">
                      {prediction.friendlyName}
                    </p>
                  )}
                </div>
              </div>
              <PredictionCard prediction={prediction} timeframe={selectedTimeframe} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && Object.keys(currentPredictions).length > 0 && (
        <div className="bg-gradient-to-r from-ios-yellow/10 to-ios-orange/10 border-2 border-ios-yellow/20 rounded-ios-xl p-6 shadow-ios">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-bold text-ios-orange text-lg">
              {isChildMode ? 'Important Reminder!' : 'Disclaimer'}
            </h3>
          </div>
          <p className="text-ios-orange/80 font-medium">
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