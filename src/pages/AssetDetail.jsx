import { useEffect, useState } from 'react'
import { useParams } from 'wouter'
import { useAtom } from 'jotai'
import { isChildModeAtom, loadingAtom, errorAtom } from '../store/atoms'
import Chart from '../components/Chart'
import PredictionCard from '../components/PredictionCard'
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown, ArrowLeft, DollarSign, Brain, Clock } from 'lucide-react'
import { fetchAssetDetail, fetchAssetPredictions } from '../services/api'
import { Link } from 'wouter'
import clsx from 'clsx'

export default function AssetDetail() {
  const { symbol: encodedSymbol } = useParams()
  const symbol = decodeURIComponent(encodedSymbol || '')
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
        <div className="card-glass max-w-md mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-ios-blue to-ios-purple rounded-full">
              <RefreshCw className="h-6 w-6 animate-spin text-white" />
            </div>
          </div>
          <span className="text-ios-gray-700 font-medium">
            {isChildMode ? 'Loading asset info...' : 'Loading asset details...'}
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="card-glass max-w-md mx-auto text-center">
          <div className="p-4 bg-ios-red/10 rounded-full w-fit mx-auto mb-4">
            <AlertCircle className="h-12 w-12 text-ios-red" />
          </div>
          <h2 className="text-xl font-bold text-ios-gray-900 mb-2">
            {isChildMode ? 'Oops! Could not find this asset' : 'Error Loading Asset'}
          </h2>
          <p className="text-ios-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link href="/">
          <button className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </Link>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-ios-gray-900">{asset.symbol}</h1>
            <div className={clsx(
              'flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-ios w-fit',
              isPositive 
                ? 'status-positive' 
                : 'status-negative'
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-ios-gray-600 text-lg font-medium">
            {isChildMode ? asset.friendlyName : asset.name}
          </p>
        </div>

        <button onClick={loadAssetData} className="btn-secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {isChildMode && (
        <div className="bg-gradient-to-r from-ios-blue/10 to-ios-purple/10 border-2 border-ios-blue/20 rounded-ios-xl p-6 shadow-ios">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">📊</span>
            <h3 className="font-bold text-ios-blue text-lg">
              About {asset.friendlyName}
            </h3>
          </div>
          <p className="text-ios-blue/80 font-medium">
            {asset.childDescription || `This shows you everything about ${asset.friendlyName}! You can see how the price changed over time and what our AI thinks might happen next.`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Chart data={chartData} title={asset.symbol} />
          
          <div className="card-glass">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-ios-green to-ios-blue rounded-ios shadow-ios">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ios-gray-900">
                {isChildMode ? 'Current Info' : 'Current Price'}
              </h3>
              {isChildMode && <span className="text-xl">📈</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-ios-gray-50/50 rounded-ios-lg p-4">
                <p className="text-sm font-medium text-ios-gray-600 mb-2">
                  {isChildMode ? 'Price Right Now' : 'Current Price'}
                </p>
                <p className="text-3xl font-bold text-ios-gray-900">${asset.price.toFixed(2)}</p>
              </div>
              <div className="bg-ios-gray-50/50 rounded-ios-lg p-4">
                <p className="text-sm font-medium text-ios-gray-600 mb-2">
                  {isChildMode ? 'Change Today' : 'Daily Change'}
                </p>
                <p className={clsx(
                  'text-2xl font-bold',
                  isPositive ? 'text-ios-green' : 'text-ios-red'
                )}>
                  {isPositive ? '+' : ''}${asset.change.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-ios-purple to-ios-pink rounded-ios shadow-ios">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ios-gray-900">
                {isChildMode ? 'AI Predictions' : 'Predictions'}
              </h3>
              {isChildMode && <span className="text-xl">🔮</span>}
            </div>
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
                  <div key={timeframe} className="card-glass bg-ios-gray-50/30">
                    <div className="text-center text-ios-gray-500 py-6">
                      <div className="p-3 bg-ios-gray-200 rounded-full w-fit mx-auto mb-3">
                        <Clock className="h-6 w-6 text-ios-gray-400" />
                      </div>
                      <p className="font-medium">
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