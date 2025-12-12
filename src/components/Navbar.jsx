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
    <nav className="navbar-blur sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
                <div className="p-2 bg-gradient-to-br from-ios-blue to-ios-purple rounded-ios shadow-ios">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-ios-gray-900">TradingDash</span>
              </div>
            </Link>
            
            <div className="flex space-x-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} href={path}>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-ios transition-all duration-200 ${
                    location === path 
                      ? 'bg-ios-blue/10 text-ios-blue shadow-ios border border-ios-blue/20' 
                      : 'text-ios-gray-600 hover:text-ios-gray-900 hover:bg-ios-gray-100/50'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsChildMode(!isChildMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-ios font-medium transition-all duration-200 ${
                isChildMode 
                  ? 'bg-ios-orange/10 text-ios-orange border border-ios-orange/20 shadow-ios' 
                  : 'bg-ios-gray-100 text-ios-gray-700 hover:bg-ios-gray-200 border border-ios-gray-200'
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