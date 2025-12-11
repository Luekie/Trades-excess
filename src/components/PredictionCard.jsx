import { useAtom } from 'jotai'
import { isChildModeAtom } from '../store/atoms'
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react'
import clsx from 'clsx'

export default function PredictionCard({ prediction, timeframe }) {
  const [isChildMode] = useAtom(isChildModeAtom)
  
  const isPositive = prediction.direction === 'up'
  const confidenceColor = prediction.confidence >= 80 ? 'green' : 
                         prediction.confidence >= 60 ? 'yellow' : 'red'

  const timeframeLabels = {
    '1h': '1 Hour',
    '4h': '4 Hours', 
    '1d': '1 Day',
    '1w': '1 Week'
  }

  return (
    <div className={clsx(
      'card',
      isChildMode && 'border-2 border-dashed border-purple-300 bg-purple-50'
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">
            {timeframeLabels[timeframe]}
          </span>
        </div>
        
        <div className={clsx(
          'flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium',
          isPositive 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        )}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{isChildMode ? (isPositive ? 'Up!' : 'Down!') : prediction.direction.toUpperCase()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">
              {isChildMode ? 'How sure we are:' : 'Confidence'}
            </span>
            <span className={clsx(
              'text-sm font-medium',
              confidenceColor === 'green' && 'text-green-600',
              confidenceColor === 'yellow' && 'text-yellow-600',
              confidenceColor === 'red' && 'text-red-600'
            )}>
              {prediction.confidence}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={clsx(
                'h-2 rounded-full transition-all',
                confidenceColor === 'green' && 'bg-green-500',
                confidenceColor === 'yellow' && 'bg-yellow-500',
                confidenceColor === 'red' && 'bg-red-500'
              )}
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {isChildMode ? 'Price Target:' : 'Target Price'}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            ${prediction.targetPrice.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {isChildMode ? 
              `That's ${Math.abs(prediction.expectedChange).toFixed(1)}% ${isPositive ? 'higher' : 'lower'}!` :
              `${isPositive ? '+' : ''}${prediction.expectedChange.toFixed(2)}% expected`
            }
          </div>
        </div>

        {isChildMode && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="text-sm text-blue-800">
              {isPositive ? '🚀' : '📉'} {prediction.childExplanation}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}