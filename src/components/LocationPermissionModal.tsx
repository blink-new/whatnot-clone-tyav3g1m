import { useState } from 'react'
import { MapPin, X } from 'lucide-react'
import { Button } from './ui/button'

interface LocationPermissionModalProps {
  onLocationGranted: (location: { lat: number; lng: number }) => void
  onSkip: () => void
}

export function LocationPermissionModal({ onLocationGranted, onSkip }: LocationPermissionModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetLocation = async () => {
    setLoading(true)
    setError('')

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      onLocationGranted({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    } catch (err) {
      setError('Unable to get your location. Please try again or skip for now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Find Local Bakers Near You</h2>
          <p className="text-gray-600 text-sm">
            LocalLive uses your location to show fresh food from bakers in your neighborhood. 
            Your location is never shared with sellers.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleGetLocation}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Getting Location...
              </div>
            ) : (
              'Allow Location Access'
            )}
          </Button>
          
          <Button
            onClick={onSkip}
            variant="outline"
            className="w-full"
          >
            Skip for Now
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can change this in settings later
        </p>
      </div>
    </div>
  )
}