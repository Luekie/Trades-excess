import { useAtom } from 'jotai'
import { isChildModeAtom } from '../store/atoms'
import { TrendingUp, TrendingDown, Clock, Target, Sparkles } from 'lucide-react'
import clsx from 'clsx'

export default function PredictionCard({ prediction, timeframe }) {
  const [isChildMode] = useAtom(isChildModeAtom)
  
  const isPositive = prediction.direction === 'up'
  const confidenceColor = prediction.confidence >= 80 ? 'green' : 
                         prediction.confidence >= 60 ? 'orange' : 'red'

  const timeframeLabels = {
    '1h': '1 Hour',
    '4h': '4 Hours', 
    '1d': '1 Day',
    '1w': '1 Week'
  }

  return (
    <div className={clsx(
      'card-glass hover:shadow-ios-lg transition-all duration-300',
      isChildMode && 'border-2 border-dashed border-ios-purple/30 bg-gradient-to-br from-ios-purple/5 to-ios-pink/5'
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-ios-purple to-ios-pink rounded-ios shadow-ios">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-ios-gray-700">
            {timeframeLabels[timeframe]}
          </span>
        </div>
        
        <div className={clsx(
          'flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-bold shadow-ios',
          isPositive 
            ? 'status-positive' 
            : 'status-negative'
        )}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{isChildMode ? (isPositive ? 'Up!' : 'Down!') : prediction.direction.toUpperCase()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-ios-gray-50/50 rounded-ios-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-ios-purple" />
              <span className="text-sm font-medium text-ios-gray-600">
                {isChildMode ? 'How sure we are:' : 'AI Confidence'}
              </span>
            </div>
            <span className={clsx(
              'text-sm font-bold px-2 py-1 rounded-ios',
              confidenceColor === 'green' && 'bg-ios-green/10 text-ios-green',
              confidenceColor === 'orange' && 'bg-ios-orange/10 text-ios-orange',
              confidenceColor === 'red' && 'bg-ios-red/10 text-ios-red'
            )}>
              {prediction.confidence}%
            </span>
          </div>
          <div className="w-full bg-ios-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={clsx(
                'h-3 rounded-full transition-all duration-500 shadow-sm',
                confidenceColor === 'green' && 'bg-gradient-to-r from-ios-green/80 to-ios-green',
                confidenceColor === 'orange' && 'bg-gradient-to-r from-ios-orange/80 to-ios-orange',
                confidenceColor === 'red' && 'bg-gradient-to-r from-ios-red/80 to-ios-red'
              )}
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>

        <div className="bg-ios-gray-50/50 rounded-ios-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-ios-blue" />
            <span className="text-sm font-bold text-ios-gray-700">
              {isChildMode ? 'Price Target:' : 'Target Price'}
            </span>
          </div>
          <div className="text-2xl font-bold text-ios-gray-900 mb-1">
            ${prediction.targetPrice.toFixed(2)}
          </div>
          <div className={clsx(
            'text-sm font-medium',
            isPositive ? 'text-ios-green' : 'text-ios-red'
          )}>
            {isChildMode ? 
              `That's ${Math.abs(prediction.expectedChange).toFixed(1)}% ${isPositive ? 'higher' : 'lower'}!` :
              `${isPositive ? '+' : ''}${prediction.expectedChange.toFixed(2)}% expected`
            }
          </div>
        </div>

        {isChildMode && (
          <div className="bg-gradient-to-r from-ios-blue/10 to-ios-purple/10 rounded-ios-lg p-4 border border-ios-blue/20">
            <div className="text-sm text-ios-blue font-medium flex items-start space-x-2">
              <span className="text-lg">{isPositive ? '🚀' : '📉'}</span>
              <span>{prediction.childExplanation}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}