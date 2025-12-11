import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { marketDataAtom, loadingAtom, errorAtom, isChildModeAtom } from '../store/atoms'
import AssetCard from '../components/AssetCard'
import { RefreshCw, AlertCircle } from 'lucide-react'
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
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-primary-500" />
          <span className="text-gray-600">
            {isChildMode ? 'Getting the latest prices...' : 'Loading market data...'}
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
            {isChildMode ? 'Oops! Something went wrong' : 'Error Loading Data'}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">
            {isChildMode ? '🏠 Trading Dashboard for Kids!' : 'Trading Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">
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
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🎓 Learning Time!</h3>
          <p className="text-yellow-700 text-sm">
            Stocks are like pieces of companies you can own. Currencies are different types of money from around the world. 
            The numbers show if they're worth more or less than yesterday!
          </p>
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isChildMode ? '📈 Company Stocks' : 'Stocks'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketData.stocks.map((stock) => (
              <AssetCard key={stock.symbol} asset={stock} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isChildMode ? '💰 World Currencies' : 'Currencies'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketData.currencies.map((currency) => (
              <AssetCard key={currency.symbol} asset={currency} />
            ))}
          </div>
        </section>
      </div>

      {marketData.lastUpdated && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {new Date(marketData.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  )
}