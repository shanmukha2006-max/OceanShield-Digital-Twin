import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    console.error('Root render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="h-screen w-full bg-slate-950 text-white">
          <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-4 p-6">
            <h1 className="text-3xl font-bold">React Render Error</h1>
            <p className="text-sm text-slate-200">
              An error occurred while initializing the dashboard. Check the console for details.
            </p>
            <pre className="w-full rounded-xl bg-slate-900 p-4 text-xs text-red-200">
              {String(this.state.error)}
            </pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)

