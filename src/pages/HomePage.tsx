import { useState, useEffect } from 'react'
import { Search, MapPin, Filter, Plus, User, Settings } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { FoodItemCard } from '../components/FoodItemCard'
import { LiveStreamCard } from '../components/LiveStreamCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { LocationRadiusSelector } from '../components/LocationRadiusSelector'

interface HomePageProps {
  user: any
  userLocation: { lat: number; lng: number } | null
  onNavigate: (page: string) => void
}

// Mock data for the prototype
const mockLiveStreams = [
  {
    id: '1',
    sellerId: 'baker1',
    sellerName: 'Sarah\'s Sweet Kitchen',
    title: 'Fresh Chocolate Chip Cookies - Live Baking!',
    thumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    viewerCount: 24,
    distance: 0.8,
    isLive: true,
    category: 'cookies'
  },
  {
    id: '2',
    sellerId: 'baker2',
    sellerName: 'Mike\'s Artisan Breads',
    title: 'Sourdough Sunday - Fresh Loaves',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    viewerCount: 18,
    distance: 1.2,
    isLive: true,
    category: 'bread'
  }
]

const mockFoodItems = [
  {
    id: '1',
    sellerId: 'baker1',
    sellerName: 'Sarah\'s Sweet Kitchen',
    title: 'Homemade Chocolate Chip Cookies',
    description: 'Fresh baked with organic ingredients, still warm!',
    price: 12,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    distance: 0.8,
    freshness: 'Just baked',
    category: 'cookies',
    rating: 4.9,
    reviewCount: 127
  },
  {
    id: '2',
    sellerId: 'baker2',
    sellerName: 'Mike\'s Artisan Breads',
    title: 'Fresh Sourdough Loaf',
    description: 'Traditional sourdough with 48-hour fermentation',
    price: 8,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    distance: 1.2,
    freshness: '2 hours ago',
    category: 'bread',
    rating: 4.8,
    reviewCount: 89
  },
  {
    id: '3',
    sellerId: 'baker3',
    sellerName: 'Emma\'s Cake Corner',
    title: 'Red Velvet Cupcakes (6-pack)',
    description: 'Rich red velvet with cream cheese frosting',
    price: 18,
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop',
    distance: 2.1,
    freshness: '1 hour ago',
    category: 'cakes',
    rating: 4.7,
    reviewCount: 56
  }
]

export function HomePage({ user, userLocation, onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [radiusKm, setRadiusKm] = useState(5)
  const [showFilters, setShowFilters] = useState(false)

  const filteredItems = mockFoodItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const withinRadius = item.distance <= radiusKm
    
    return matchesSearch && matchesCategory && withinRadius
  })

  const filteredStreams = mockLiveStreams.filter(stream => {
    const matchesCategory = selectedCategory === 'all' || stream.category === selectedCategory
    const withinRadius = stream.distance <= radiusKm
    
    return matchesCategory && withinRadius
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">LocalLive</h1>
              {userLocation && (
                <div className="ml-4 flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Within {radiusKm}km</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('kitchen')}
                className="hidden sm:flex"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Selling
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('profile')}
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for fresh food, bakers, or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              {userLocation && (
                <LocationRadiusSelector
                  radius={radiusKm}
                  onRadiusChange={setRadiusKm}
                />
              )}
            </div>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg border p-4 mb-4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          )}
        </div>

        {!userLocation && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-amber-600 mr-2" />
              <div>
                <p className="text-amber-800 font-medium">Enable location for better results</p>
                <p className="text-amber-700 text-sm">See fresh food from bakers near you</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Streams Section */}
        {filteredStreams.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Live Kitchens</h2>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {filteredStreams.length} Live
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStreams.map((stream) => (
                <LiveStreamCard
                  key={stream.id}
                  stream={stream}
                  onClick={() => onNavigate('live')}
                />
              ))}
            </div>
          </section>
        )}

        {/* Food Items Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Fresh Food Near You</h2>
            <span className="text-sm text-gray-600">{filteredItems.length} items</span>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or expanding your radius
              </p>
              {userLocation && (
                <Button
                  variant="outline"
                  onClick={() => setRadiusKm(radiusKm + 5)}
                >
                  Expand to {radiusKm + 5}km
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <FoodItemCard
                  key={item.id}
                  item={item}
                  onClick={() => onNavigate('live')}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center text-primary">
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Discover</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center text-gray-400"
            onClick={() => onNavigate('live')}
          >
            <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xs mt-1">Live</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center text-gray-400"
            onClick={() => onNavigate('kitchen')}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs mt-1">Sell</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center text-gray-400"
            onClick={() => onNavigate('profile')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}