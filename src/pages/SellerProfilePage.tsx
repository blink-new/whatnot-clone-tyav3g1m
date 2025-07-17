import { ArrowLeft, MapPin, Star, Clock, Settings } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Logo } from '../components/Logo'

interface SellerProfilePageProps {
  user: any
  onNavigate: (page: string) => void
}

export function SellerProfilePage({ user, onNavigate }: SellerProfilePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            
            <Logo size="sm" />
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.displayName || user?.email || 'User'}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">4.8</span>
                  <span className="text-gray-500 ml-1">(127 reviews)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span>Member since Dec 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">23</div>
            <div className="text-sm text-gray-600">Orders Placed</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">5</div>
            <div className="text-sm text-gray-600">Favorite Bakers</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">$247</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=60&h=60&fit=crop"
                alt="Order"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">Chocolate Chip Cookies</h3>
                <p className="text-sm text-gray-600">Sarah's Sweet Kitchen • 2 days ago</p>
              </div>
              <div className="text-right">
                <div className="font-medium">$12.00</div>
                <Badge variant="secondary" className="text-xs">Delivered</Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=60&h=60&fit=crop"
                alt="Order"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">Sourdough Loaf</h3>
                <p className="text-sm text-gray-600">Mike's Artisan Breads • 1 week ago</p>
              </div>
              <div className="text-right">
                <div className="font-medium">$8.00</div>
                <Badge variant="secondary" className="text-xs">Delivered</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Bakers */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Favorite Bakers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-medium text-primary">S</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Sarah's Sweet Kitchen</h3>
                <p className="text-sm text-gray-600">0.8km away</p>
              </div>
              <Button variant="outline" size="sm">Follow</Button>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-medium text-primary">M</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Mike's Artisan Breads</h3>
                <p className="text-sm text-gray-600">1.2km away</p>
              </div>
              <Button variant="outline" size="sm">Follow</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}