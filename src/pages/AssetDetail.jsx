import { useEffect, useState } from 'react'
import { useParams } from 'wouter'
import { useAtom } from 'jotai'
import { isChildModeAtom, loadingAtom, errorAtom } from '../store/atoms'
import Chart from '../components/Chart'
import PredictionCard from '../components/PredictionCard'
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react'
import { fetchAssetDetail, fetchAssetPredictions } from '../services/api'
import { Link } from 'wouter'
import clsx from 'clsx'

export default function AssetDetail() {
  const { symbol } = useParams()
  const [isChildMode] = useAtom(isChildModeAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [error, setError] = useAtom(errorAtom)
  
  const [asset, setAsset] = useState(null)
  const [chartData, setChartData] = useState([])
  const [predictions, setPredictions] = useState({})

  useEffect(() => {
    if (symbol) {
      loadAssetData()
    }
  }, [symbol])

  const loadAssetData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [assetData, predictionsData] = await Promise.all([
        fetchAssetDetail(symbol),
        fetchAssetPredictions(symbol)
      ])
      
      setAsset(assetData.asset)
      setChartData(assetData.chartData)
      setPredictions(predictionsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-primary-500" />
          <span className="text-gray-600">
            {isChildMode ? 'Loading asset info...' : 'Loading asset details...'}
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isChildMode ? 'Oops! Could not find this asset' : 'Error Loading Asset'}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Link href="/">
              <button className="btn-secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
            </Link>
            <button onClick={loadAssetData} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!asset) return null

  const isPositive = asset.change >= 0
  const timeframes = ['1h', '4h', '1d', '1w']

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <button className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </Link>
        
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">{asset.symbol}</h1>
            <div className={clsx(
              'flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium',
              isPositive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-gray-600 mt-1">
            {isChildMode ? asset.friendlyName : asset.name}
          </p>
        </div>

        <button onClick={loadAssetData} className="btn-secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {isChildMode && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            📊 About {asset.friendlyName}
          </h3>
          <p className="text-blue-700 text-sm">
            {asset.childDescription || `This shows you everything about ${asset.friendlyName}! You can see how the price changed over time and what our AI thinks might happen next.`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Chart data={chartData} title={asset.symbol} />
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isChildMode ? '📈 Current Info' : 'Current Price'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  {isChildMode ? 'Price Right Now' : 'Current Price'}
                </p>
                <p className="text-2xl font-bold text-gray-900">${asset.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {isChildMode ? 'Change Today' : 'Daily Change'}
                </p>
                <p className={clsx(
                  'text-lg font-semibold',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {isPositive ? '+' : ''}${asset.change.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isChildMode ? '🔮 AI Predictions' : 'Predictions'}
            </h3>
            <div className="space-y-4">
              {timeframes.map((timeframe) => {
                const prediction = predictions[timeframe]
                return prediction ? (
                  <PredictionCard 
                    key={timeframe} 
                    prediction={prediction} 
                    timeframe={timeframe} 
                  />
                ) : (
                  <div key={timeframe} className="card bg-gray-50">
                    <div className="text-center text-gray-500 py-4">
                      <p className="text-sm">
                        {isChildMode ? 
                          `No prediction for ${timeframe} yet` : 
                          `${timeframe} prediction unavailable`
                        }
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}