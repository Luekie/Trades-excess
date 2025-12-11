import { Link, useLocation } from 'wouter'
import { useAtom } from 'jotai'
import { isChildModeAtom } from '../store/atoms'
import { BarChart3, TrendingUp, Baby, User } from 'lucide-react'

export default function Navbar() {
  const [location] = useLocation()
  const [isChildMode, setIsChildMode] = useAtom(isChildModeAtom)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/predictions', label: 'Predictions', icon: TrendingUp }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold text-gray-900">TradingDash</span>
              </div>
            </Link>
            
            <div className="flex space-x-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} href={path}>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location === path 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsChildMode(!isChildMode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isChildMode 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isChildMode ? <Baby className="h-4 w-4" /> : <User className="h-4 w-4" />}
              <span>{isChildMode ? 'Kid Mode' : 'Adult Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}