import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, MessageCircle, Share, ShoppingCart, MapPin, Clock, Star } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { LiveVideoPlayer } from '../components/LiveVideoPlayer'
import { LiveChat } from '../components/LiveChat'

interface LiveStreamPageProps {
  user: any
  onNavigate: (page: string) => void
}

export function LiveStreamPage({ user, onNavigate }: LiveStreamPageProps) {
  const [viewerCount, setViewerCount] = useState(24)
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentBid, setCurrentBid] = useState(18)
  
  // Mock stream data - in real app this would come from props or API
  const streamData = {
    channelName: 'sarahs-kitchen-live',
    seller: {
      id: 'seller_sarah',
      name: 'Sarah\'s Sweet Kitchen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a1e3e0?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      distance: '0.8km',
      isVerified: true
    },
    title: 'Fresh Chocolate Chip Cookies - Live Baking!',
    description: 'Watch me bake fresh chocolate chip cookies with organic ingredients. Taking orders now for pickup in 30 minutes!',
    category: 'Cookies',
    startTime: new Date(Date.now() - 1800000), // Started 30 minutes ago
    currentItem: {
      name: 'Dozen Chocolate Chip Cookies',
      startingPrice: 12,
      currentBid: 18,
      timeLeft: '5m 23s'
    }
  }

  const currentUser = user ? {
    id: user.id || 'user_123',
    username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
    avatar: user.photoURL,
    isHost: false,
    isModerator: false
  } : undefined

  const handleViewerCountChange = (count: number) => {
    setViewerCount(count)
  }

  const handleBid = () => {
    setCurrentBid(prev => prev + 2)
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const formatStreamDuration = (startTime: Date) => {
    const duration = Date.now() - startTime.getTime()
    const minutes = Math.floor(duration / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-500 text-white animate-pulse">
              🔴 LIVE
            </Badge>
            <Badge variant="secondary">
              {viewerCount} watching
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:p-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
              </Button>
              
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-500 text-white animate-pulse">
                  🔴 LIVE
                </Badge>
                <Badge variant="secondary">
                  {viewerCount} watching
                </Badge>
                <Badge variant="outline">
                  {formatStreamDuration(streamData.startTime)}
                </Badge>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative">
              <LiveVideoPlayer
                channelName={streamData.channelName}
                isHost={false}
                onViewerCountChange={handleViewerCountChange}
                className="w-full"
              />
            </div>

            {/* Stream Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={streamData.seller.avatar} />
                      <AvatarFallback>{streamData.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{streamData.seller.name}</h3>
                        {streamData.seller.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{streamData.seller.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{streamData.seller.distance} away</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    onClick={handleFollow}
                    className="min-w-[100px]"
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>

                <h1 className="text-xl font-bold mb-2">{streamData.title}</h1>
                <p className="text-gray-600 mb-4">{streamData.description}</p>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{streamData.category}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Started {formatStreamDuration(streamData.startTime)} ago
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Current Auction Item */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🍪 {streamData.currentItem.name}</span>
                  <Badge className="bg-green-500 text-white">
                    {streamData.currentItem.timeLeft} left
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Bid</p>
                    <p className="text-2xl font-bold text-green-600">${currentBid}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Starting Price</p>
                    <p className="text-lg font-semibold">${streamData.currentItem.startingPrice}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleBid} className="flex-1 bg-green-500 hover:bg-green-600">
                    Bid ${currentBid + 2}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now ${currentBid + 5}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <LiveChat
                channelName={streamData.channelName}
                currentUser={currentUser}
                className="h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleBid} className="bg-green-500 hover:bg-green-600">
              Bid ${currentBid + 2}
            </Button>
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}