import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useAtom } from 'jotai'
import { isChildModeAtom } from '../store/atoms'
import { TrendingUp } from 'lucide-react'

export default function Chart({ data, title }) {
  const [isChildMode] = useAtom(isChildModeAtom)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-ios p-4 border border-ios-gray-200/50 rounded-ios-lg shadow-ios-lg">
          <p className="text-sm text-ios-gray-600 font-medium">{label}</p>
          <p className="text-xl font-bold text-ios-gray-900">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card-glass">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-ios-blue to-ios-purple rounded-ios shadow-ios">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-ios-gray-900">
          {isChildMode ? `${title} Price Chart 📊` : `${title} Price History`}
        </h3>
      </div>
      
      <div className="h-72 bg-gradient-to-br from-ios-gray-50/50 to-white/50 rounded-ios-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#007AFF" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" strokeOpacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="#8E8E93"
              fontSize={11}
              fontWeight="500"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#8E8E93"
              fontSize={11}
              fontWeight="500"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#007AFF"
              strokeWidth={3}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: '#007AFF', 
                stroke: '#ffffff', 
                strokeWidth: 2,
                filter: 'drop-shadow(0 2px 4px rgba(0,122,255,0.3))'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {isChildMode && (
        <div className="mt-6 p-4 bg-gradient-to-r from-ios-blue/10 to-ios-purple/10 rounded-ios-lg border border-ios-blue/20">
          <p className="text-sm text-ios-blue font-medium flex items-start space-x-2">
            <span className="text-lg">📈</span>
            <span>
              This chart shows how the price changed over time. 
              When the line goes up, the price got higher! When it goes down, the price got lower!
            </span>
          </p>
        </div>
      )}
    </div>
  )
}