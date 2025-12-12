import { Router, Route, Switch } from 'wouter'
import { Provider } from 'jotai'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Predictions from './pages/Predictions'
import AssetDetail from './pages/AssetDetail'

function App() {
  return (
    <Provider>
      <div className="min-h-screen bg-gradient-to-br from-ios-gray-50 via-white to-ios-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Router>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/predictions" component={Predictions} />
              <Route path="/asset/:symbol" component={AssetDetail} />
              <Route>
                <div className="text-center py-20">
                  <div className="card-glass max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-ios-gray-600 mb-2">Page Not Found</h2>
                    <p className="text-ios-gray-500">The page you're looking for doesn't exist.</p>
                  </div>
                </div>
              </Route>
            </Switch>
          </Router>
        </main>
      </div>
    </Provider>
  )
}

export default App