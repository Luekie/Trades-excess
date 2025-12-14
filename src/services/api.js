import axios from 'axios'

const API_BASE = '/api'

// Mock data for development
const mockStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    friendlyName: 'Apple (the iPhone company)',
    type: 'stock',
    price: 185.25,
    change: 2.15,
    changePercent: 1.17,
    childDescription: 'Apple makes iPhones, iPads, and Mac computers!'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    friendlyName: 'Google',
    type: 'stock',
    price: 142.80,
    change: -1.25,
    changePercent: -0.87,
    childDescription: 'Google helps you search for things on the internet!'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    friendlyName: 'Tesla (electric cars)',
    type: 'stock',
    price: 248.50,
    change: 5.75,
    changePercent: 2.37,
    childDescription: 'Tesla makes electric cars that don\'t need gas!'
  }
]

const mockCurrencies = [
  {
    symbol: 'EUR/USD',
    name: 'Euro to US Dollar',
    friendlyName: 'European Money vs American Money',
    type: 'currency',
    price: 1.0875,
    change: 0.0025,
    changePercent: 0.23,
    childDescription: 'This shows how much European money is worth compared to American money!'
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound to US Dollar',
    friendlyName: 'British Money vs American Money',
    type: 'currency',
    price: 1.2650,
    change: -0.0075,
    changePercent: -0.59,
    childDescription: 'This shows how much British money is worth compared to American money!'
  },
  {
    symbol: 'JPY/USD',
    name: 'Japanese Yen to US Dollar',
    friendlyName: 'Japanese Money vs American Money',
    type: 'currency',
    price: 0.0067,
    change: 0.0001,
    changePercent: 1.52,
    childDescription: 'This shows how much Japanese money is worth compared to American money!'
  }
]

// Generate mock chart data
const generateChartData = (basePrice, days = 30) => {
  const data = []
  let price = basePrice
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Add some random variation
    const change = (Math.random() - 0.5) * (basePrice * 0.05)
    price = Math.max(price + change, basePrice * 0.8)
    
    data.push({
      time: date.toLocaleDateString(),
      price: parseFloat(price.toFixed(2))
    })
  }
  
  return data
}

// Generate mock predictions
const generatePrediction = (currentPrice, timeframe) => {
  const confidence = Math.floor(Math.random() * 40) + 60 // 60-100%
  const direction = Math.random() > 0.5 ? 'up' : 'down'
  const changePercent = (Math.random() * 10) * (direction === 'up' ? 1 : -1)
  const targetPrice = currentPrice * (1 + changePercent / 100)
  
  const childExplanations = {
    up: [
      'The computer thinks more people will want to buy this!',
      'Good news might make the price go higher!',
      'The trend looks like it\'s going up!'
    ],
    down: [
      'The computer thinks people might sell this.',
      'Some news might make the price go lower.',
      'The trend looks like it might go down.'
    ]
  }
  
  return {
    direction,
    confidence,
    targetPrice,
    expectedChange: changePercent,
    childExplanation: childExplanations[direction][Math.floor(Math.random() * childExplanations[direction].length)]
  }
}

export const fetchMarketData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/market-data`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    // Fallback to mock data if API fails
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      stocks: mockStocks,
      currencies: mockCurrencies,
      lastUpdated: new Date().toISOString()
    }
  }
}

export const fetchPredictions = async (timeframe) => {
  try {
    const response = await axios.get(`${API_BASE}/predictions/${timeframe}`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    // Fallback to mock data if API fails
    await new Promise(resolve => setTimeout(resolve, 800))
    const allAssets = [...mockStocks, ...mockCurrencies]
    const predictions = {}
    
    allAssets.forEach(asset => {
      predictions[asset.symbol] = {
        ...generatePrediction(asset.price, timeframe),
        friendlyName: asset.friendlyName
      }
    })
    
    return predictions
  }
}

export const fetchAssetDetail = async (symbol) => {
  try {
    const response = await axios.get(`${API_BASE}/assets/${symbol}`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    // Fallback to mock data if API fails
    await new Promise(resolve => setTimeout(resolve, 600))
    const allAssets = [...mockStocks, ...mockCurrencies]
    const asset = allAssets.find(a => a.symbol === symbol)
    
    if (!asset) {
      throw new Error('Asset not found')
    }
    
    return {
      asset,
      chartData: generateChartData(asset.price)
    }
  }
}

export const fetchAssetPredictions = async (symbol) => {
  try {
    const response = await axios.get(`${API_BASE}/assets/${symbol}/predictions`)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    // Fallback to mock data if API fails
    await new Promise(resolve => setTimeout(resolve, 400))
    const allAssets = [...mockStocks, ...mockCurrencies]
    const asset = allAssets.find(a => a.symbol === symbol)
    
    if (!asset) {
      throw new Error('Asset not found')
    }
    
    const timeframes = ['1h', '4h', '1d', '1w']
    const predictions = {}
    
    timeframes.forEach(timeframe => {
      predictions[timeframe] = generatePrediction(asset.price, timeframe)
    })
    
    return predictions
  }
}