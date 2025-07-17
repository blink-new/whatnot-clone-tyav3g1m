import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { HomePage } from './pages/HomePage'
import { LiveStreamPage } from './pages/LiveStreamPage'
import { SellerProfilePage } from './pages/SellerProfilePage'
import { MyKitchenPage } from './pages/MyKitchenPage'
import { LocationPermissionModal } from './components/LocationPermissionModal'

type Page = 'home' | 'live' | 'profile' | 'kitchen'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // Check for location permission after auth
      if (state.user && !userLocation) {
        setShowLocationModal(true)
      }
    })
    return unsubscribe
  }, [userLocation])

  const handleLocationPermission = (location: { lat: number; lng: number }) => {
    setUserLocation(location)
    setShowLocationModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading LocalLive...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">LocalLive</h1>
            <p className="text-lg text-muted-foreground">
              Discover fresh, homemade food from local bakers in your neighborhood
            </p>
          </div>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} userLocation={userLocation} onNavigate={setCurrentPage} />
      case 'live':
        return <LiveStreamPage user={user} onNavigate={setCurrentPage} />
      case 'profile':
        return <SellerProfilePage user={user} onNavigate={setCurrentPage} />
      case 'kitchen':
        return <MyKitchenPage user={user} onNavigate={setCurrentPage} />
      default:
        return <HomePage user={user} userLocation={userLocation} onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
      
      {showLocationModal && (
        <LocationPermissionModal
          onLocationGranted={handleLocationPermission}
          onSkip={() => setShowLocationModal(false)}
        />
      )}
    </div>
  )
}

export default App