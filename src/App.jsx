import { Router, Route, Switch } from 'wouter'
import { Provider } from 'jotai'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Predictions from './pages/Predictions'
import AssetDetail from './pages/AssetDetail'

function App() {
  return (
    <Provider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Router>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/predictions" component={Predictions} />
              <Route path="/asset/:symbol" component={AssetDetail} />
              <Route>
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-600">Page Not Found</h2>
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