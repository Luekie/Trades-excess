const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Mock AI prediction service
class AIPredictor {
  static generatePrediction(asset, timeframe) {
    // Simulate AI analysis with random but realistic predictions
    const confidence = Math.floor(Math.random() * 40) + 60 // 60-100%
    const direction = Math.random() > 0.5 ? 'up' : 'down'
    
    // Adjust prediction strength based on timeframe
    const timeframeMultipliers = {
      '1h': 0.5,
      '4h': 1.0,
      '1d': 2.0,
      '1w': 4.0
    }
    
    const baseChange = Math.random() * 5 * timeframeMultipliers[timeframe]
    const changePercent = baseChange * (direction === 'up' ? 1 : -1)
    const targetPrice = asset.price * (1 + changePercent / 100)
    
    const childExplanations = {
      up: [
        'The computer thinks more people will want to buy this!',
        'Good news might make the price go higher!',
        'The trend looks like it\'s going up!',
        'Smart money seems to be buying this!'
      ],
      down: [
        'The computer thinks people might sell this.',
        'Some news might make the price go lower.',
        'The trend looks like it might go down.',
        'Smart money seems to be selling this.'
      ]
    }
    
    return {
      direction,
      confidence,
      targetPrice: parseFloat(targetPrice.toFixed(2)),
      expectedChange: parseFloat(changePercent.toFixed(2)),
      childExplanation: childExplanations[direction][Math.floor(Math.random() * childExplanations[direction].length)],
      generatedAt: new Date().toISOString(),
      timeframe
    }
  }
}

// Mock market data
const mockAssets = {
  stocks: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      friendlyName: 'Apple (the iPhone company)',
      type: 'stock',
      price: 185.25 + (Math.random() - 0.5) * 10,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 3,
      childDescription: 'Apple makes iPhones, iPads, and Mac computers!'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      friendlyName: 'Google',
      type: 'stock',
      price: 142.80 + (Math.random() - 0.5) * 8,
      change: (Math.random() - 0.5) * 4,
      changePercent: (Math.random() - 0.5) * 2.5,
      childDescription: 'Google helps you search for things on the internet!'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      friendlyName: 'Tesla (electric cars)',
      type: 'stock',
      price: 248.50 + (Math.random() - 0.5) * 15,
      change: (Math.random() - 0.5) * 8,
      changePercent: (Math.random() - 0.5) * 4,
      childDescription: 'Tesla makes electric cars that don\'t need gas!'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      friendlyName: 'Microsoft (Windows & Xbox)',
      type: 'stock',
      price: 378.85 + (Math.random() - 0.5) * 12,
      change: (Math.random() - 0.5) * 6,
      changePercent: (Math.random() - 0.5) * 2,
      childDescription: 'Microsoft makes Windows computers and Xbox games!'
    }
  ],
  currencies: [
    {
      symbol: 'EUR/USD',
      name: 'Euro to US Dollar',
      friendlyName: 'European Money vs American Money',
      type: 'currency',
      price: 1.0875 + (Math.random() - 0.5) * 0.02,
      change: (Math.random() - 0.5) * 0.01,
      changePercent: (Math.random() - 0.5) * 1,
      childDescription: 'This shows how much European money is worth compared to American money!'
    },
    {
      symbol: 'GBP/USD',
      name: 'British Pound to US Dollar',
      friendlyName: 'British Money vs American Money',
      type: 'currency',
      price: 1.2650 + (Math.random() - 0.5) * 0.03,
      change: (Math.random() - 0.5) * 0.015,
      changePercent: (Math.random() - 0.5) * 1.2,
      childDescription: 'This shows how much British money is worth compared to American money!'
    },
    {
      symbol: 'JPY/USD',
      name: 'Japanese Yen to US Dollar',
      friendlyName: 'Japanese Money vs American Money',
      type: 'currency',
      price: 0.0067 + (Math.random() - 0.5) * 0.0002,
      change: (Math.random() - 0.5) * 0.0001,
      changePercent: (Math.random() - 0.5) * 1.5,
      childDescription: 'This shows how much Japanese money is worth compared to American money!'
    }
  ]
}

// Update prices periodically to simulate real market
setInterval(() => {
  const allAssets = [...mockAssets.stocks, ...mockAssets.currencies]
  allAssets.forEach(asset => {
    const volatility = asset.type === 'stock' ? 0.02 : 0.005
    const change = (Math.random() - 0.5) * asset.price * volatility
    const newPrice = Math.max(asset.price + change, asset.price * 0.5)
    
    asset.change = newPrice - asset.price
    asset.changePercent = (asset.change / asset.price) * 100
    asset.price = parseFloat(newPrice.toFixed(asset.type === 'currency' ? 4 : 2))
  })
}, 30000) // Update every 30 seconds

// Generate chart data
const generateChartData = (basePrice, days = 30) => {
  const data = []
  let price = basePrice
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const change = (Math.random() - 0.5) * (basePrice * 0.03)
    price = Math.max(price + change, basePrice * 0.7)
    
    data.push({
      time: date.toLocaleDateString(),
      price: parseFloat(price.toFixed(2))
    })
  }
  
  return data
}

// API Routes
app.get('/api/market-data', (req, res) => {
  try {
    res.json({
      ...mockAssets,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' })
  }
})

app.get('/api/predictions/:timeframe', (req, res) => {
  try {
    const { timeframe } = req.params
    const validTimeframes = ['1h', '4h', '1d', '1w']
    
    if (!validTimeframes.includes(timeframe)) {
      return res.status(400).json({ error: 'Invalid timeframe' })
    }
    
    const allAssets = [...mockAssets.stocks, ...mockAssets.currencies]
    const predictions = {}
    
    allAssets.forEach(asset => {
      predictions[asset.symbol] = {
        ...AIPredictor.generatePrediction(asset, timeframe),
        friendlyName: asset.friendlyName
      }
    })
    
    res.json(predictions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate predictions' })
  }
})

app.get('/api/assets/:symbol', (req, res) => {
  try {
    const { symbol } = req.params
    const allAssets = [...mockAssets.stocks, ...mockAssets.currencies]
    const asset = allAssets.find(a => a.symbol === symbol)
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' })
    }
    
    res.json({
      asset,
      chartData: generateChartData(asset.price)
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset details' })
  }
})

app.get('/api/assets/:symbol/predictions', (req, res) => {
  try {
    const { symbol } = req.params
    const allAssets = [...mockAssets.stocks, ...mockAssets.currencies]
    const asset = allAssets.find(a => a.symbol === symbol)
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' })
    }
    
    const timeframes = ['1h', '4h', '1d', '1w']
    const predictions = {}
    
    timeframes.forEach(timeframe => {
      predictions[timeframe] = AIPredictor.generatePrediction(asset, timeframe)
    })
    
    res.json(predictions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate asset predictions' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Trading Dashboard API running on port ${PORT}`)
  console.log(`📊 Market data updating every 30 seconds`)
  console.log(`🤖 AI predictions available for all timeframes`)
})