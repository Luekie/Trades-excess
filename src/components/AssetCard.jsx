import { Link } from 'wouter'
import { useAtom } from 'jotai'
import { isChildModeAtom } from '../store/atoms'
import { TrendingUp, TrendingDown, DollarSign, Coins } from 'lucide-react'
import clsx from 'clsx'

export default function AssetCard({ asset }) {
  const [isChildMode] = useAtom(isChildModeAtom)
  
  const isPositive = asset.change >= 0
  const Icon = asset.type === 'stock' ? TrendingUp : Coins

  return (
    <Link href={`/asset/${encodeURIComponent(asset.symbol)}`}>
      <div className={clsx(
        'card hover:shadow-ios-lg hover:scale-105 transition-all duration-300 cursor-pointer group',
        isChildMode && 'border-2 border-dashed border-ios-blue/30 bg-gradient-to-br from-ios-blue/5 to-ios-purple/5'
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={clsx(
              'p-3 rounded-ios-lg shadow-ios transition-transform duration-200 group-hover:scale-110',
              asset.type === 'stock' 
                ? 'bg-gradient-to-br from-ios-blue to-ios-blue/80 text-white' 
                : 'bg-gradient-to-br from-ios-orange to-ios-yellow text-white'
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-ios-gray-900">{asset.symbol}</h3>
              <p className={clsx(
                'text-sm',
                isChildMode ? 'text-ios-blue font-medium' : 'text-ios-gray-500'
              )}>
                {isChildMode ? asset.friendlyName : asset.name}
              </p>
            </div>
          </div>
          
          <div className={clsx(
            'flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-bold shadow-ios',
            isPositive 
              ? 'status-positive' 
              : 'status-negative'
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-ios-gray-50/50 rounded-ios-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-ios-gray-600">
                {isChildMode ? 'Current Price' : 'Market Price'}
              </span>
              <DollarSign className="h-4 w-4 text-ios-gray-400" />
            </div>
            <div className="text-2xl font-bold text-ios-gray-900 mb-1">
              ${asset.price.toFixed(2)}
            </div>
            {isChildMode && (
              <p className="text-xs text-ios-gray-500">
                This is how much one {asset.type === 'stock' ? 'share' : 'unit'} costs right now
              </p>
            )}
          </div>

          <div className="bg-ios-gray-50/50 rounded-ios-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-ios-gray-600">
                {isChildMode ? 'Change Today' : 'Daily Change'}
              </span>
              {isPositive ? <TrendingUp className="h-4 w-4 text-ios-green" /> : <TrendingDown className="h-4 w-4 text-ios-red" />}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={clsx(
                  'text-lg font-bold',
                  isPositive ? 'text-ios-green' : 'text-ios-red'
                )}>
                  {isPositive ? '+' : ''}${asset.change.toFixed(2)}
                </p>
                <p className={clsx(
                  'text-sm font-medium',
                  isPositive ? 'text-ios-green' : 'text-ios-red'
                )}>
                  ({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)
                </p>
              </div>
              {isChildMode && (
                <div className="text-right">
                  <div className="text-lg">
                    {isPositive ? '📈' : '📉'}
                  </div>
                  <div className="text-xs text-ios-blue font-bold">
                    {isPositive ? 'Going Up!' : 'Going Down!'}
                  </div>
                </div>
              )}
            </div>
            {isChildMode && (
              <p className="text-xs text-ios-gray-500 mt-2">
                {isPositive ? 
                  `The price went up by $${asset.change.toFixed(2)} since yesterday` :
                  `The price went down by $${Math.abs(asset.change).toFixed(2)} since yesterday`
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}