import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { marketDataAtom, loadingAtom, errorAtom, isChildModeAtom } from '../store/atoms'
import AssetCard from '../components/AssetCard'
import { RefreshCw, AlertCircle, Home, Sparkles } from 'lucide-react'
import { fetchMarketData } from '../services/api'

export default function Dashboard() {
  const [marketData, setMarketData] = useAtom(marketDataAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [error, setError] = useAtom(errorAtom)
  const [isChildMode] = useAtom(isChildModeAtom)

  useEffect(() => {
    loadMarketData()
  }, [])

  const loadMarketData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchMarketData()
      setMarketData(data)
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
            {isChildMode ? 'Getting the latest prices...' : 'Loading market data...'}
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
            {isChildMode ? 'Oops! Something went wrong' : 'Error Loading Data'}
          </h2>
          <p className="text-ios-gray-600 mb-6">{error}</p>
          <button onClick={loadMarketData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const allAssets = [...marketData.stocks, ...marketData.currencies]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-ios-blue to-ios-purple rounded-ios-lg shadow-ios">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-ios-gray-900">
              {isChildMode ? 'Trading Dashboard for Kids!' : 'Trading Dashboard'}
            </h1>
            {isChildMode && <span className="text-3xl">🏠</span>}
          </div>
          <p className="text-ios-gray-600 text-lg">
            {isChildMode ? 
              'See how stocks and money from different countries are doing!' :
              'Monitor stocks and currency markets in real-time'
            }
          </p>
        </div>
        
        <button onClick={loadMarketData} className="btn-secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {isChildMode && (
        <div className="bg-gradient-to-r from-ios-orange/10 to-ios-yellow/10 border-2 border-ios-orange/20 rounded-ios-xl p-6 shadow-ios">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">🎓</span>
            <h3 className="font-bold text-ios-orange text-lg">Learning Time!</h3>
          </div>
          <p className="text-ios-orange/80 font-medium">
            Stocks are like pieces of companies you can own. Currencies are different types of money from around the world. 
            The numbers show if they're worth more or less than yesterday!
          </p>
        </div>
      )}

      <div className="space-y-8">
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-ios-blue to-ios-blue/80 rounded-ios shadow-ios">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-ios-gray-900">
              {isChildMode ? 'Company Stocks' : 'Stocks'}
            </h2>
            {isChildMode && <span className="text-2xl">📈</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketData.stocks.map((stock) => (
              <AssetCard key={stock.symbol} asset={stock} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-ios-orange to-ios-yellow rounded-ios shadow-ios">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-ios-gray-900">
              {isChildMode ? 'World Currencies' : 'Currencies'}
            </h2>
            {isChildMode && <span className="text-2xl">💰</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketData.currencies.map((currency) => (
              <AssetCard key={currency.symbol} asset={currency} />
            ))}
          </div>
        </section>
      </div>

      {marketData.lastUpdated && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-ios-gray-100/50 rounded-full">
            <div className="w-2 h-2 bg-ios-green rounded-full animate-pulse"></div>
            <span className="text-sm text-ios-gray-500 font-medium">
              Last updated: {new Date(marketData.lastUpdated).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}