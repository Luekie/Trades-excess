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
    <Link href={`/asset/${asset.symbol}`}>
      <div className={clsx(
        'card hover:shadow-md transition-shadow cursor-pointer',
        isChildMode && 'border-2 border-dashed border-blue-300 bg-blue-50'
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={clsx(
              'p-2 rounded-lg',
              asset.type === 'stock' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{asset.symbol}</h3>
              <p className={clsx(
                'text-sm',
                isChildMode ? 'text-blue-600 font-medium' : 'text-gray-500'
              )}>
                {isChildMode ? asset.friendlyName : asset.name}
              </p>
            </div>
          </div>
          
          <div className={clsx(
            'flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium',
            isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">
                {asset.price.toFixed(2)}
              </span>
            </div>
            <p className={clsx(
              'text-sm',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {isPositive ? '+' : ''}{asset.change.toFixed(2)} today
            </p>
          </div>
          
          {isChildMode && (
            <div className="text-right">
              <div className="text-xs text-blue-600 font-medium">
                {isPositive ? '📈 Going Up!' : '📉 Going Down!'}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}