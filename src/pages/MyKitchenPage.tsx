import { useState } from 'react'
import { ArrowLeft, Plus, Camera, Play, DollarSign, Package, Video, Users, Clock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { LiveVideoPlayer } from '../components/LiveVideoPlayer'

interface MyKitchenPageProps {
  user: any
  onNavigate: (page: string) => void
}

export function MyKitchenPage({ user, onNavigate }: MyKitchenPageProps) {
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false)
  const [streamTitle, setStreamTitle] = useState('')
  const [streamDescription, setStreamDescription] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamStats, setStreamStats] = useState({
    viewers: 0,
    duration: 0,
    likes: 0
  })

  const handleStartStream = () => {
    if (streamTitle.trim()) {
      setIsStreaming(true)
      setIsLiveStreamOpen(false)
      // Reset form
      setStreamTitle('')
      setStreamDescription('')
    }
  }

  const handleStopStream = () => {
    setIsStreaming(false)
    setStreamStats({ viewers: 0, duration: 0, likes: 0 })
  }

  const generateChannelName = () => {
    return `${user?.id || 'user'}-kitchen-${Date.now()}`
  }

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
            
            <h1 className="text-lg font-semibold">My Kitchen</h1>
            
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Item
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Getting Started */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Start Selling Your Homemade Food</h2>
          <p className="text-gray-600 mb-4">
            Share your passion for baking with your local community. Set up your kitchen profile 
            and start taking orders from neighbors who love fresh, homemade food.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Upload Photos</h3>
              <p className="text-sm text-gray-600">Show off your delicious creations</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <Play className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-medium mb-1">Go Live</h3>
              <p className="text-sm text-gray-600">Stream your baking process</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Earn Money</h3>
              <p className="text-sm text-gray-600">Get paid for your passion</p>
            </div>
          </div>
        </div>

        {/* Live Stream Section */}
        {isStreaming && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    🔴 LIVE
                  </Badge>
                  <span>Your Kitchen Stream</span>
                </div>
                <Button onClick={handleStopStream} variant="destructive" size="sm">
                  End Stream
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <LiveVideoPlayer
                    channelName={generateChannelName()}
                    isHost={true}
                    onViewerCountChange={(count) => setStreamStats(prev => ({ ...prev, viewers: count }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{streamStats.viewers} Viewers</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{Math.floor(streamStats.duration / 60)}m {streamStats.duration % 60}s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-500" />
                        <span className="font-medium">Live Streaming</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Dialog open={isLiveStreamOpen} onOpenChange={setIsLiveStreamOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
                disabled={isStreaming}
              >
                <Play className="h-6 w-6 text-red-500" />
                <span>{isStreaming ? 'Streaming Live' : 'Start Live Stream'}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Start Live Stream</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stream-title">Stream Title</Label>
                  <Input
                    id="stream-title"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    placeholder="e.g., Fresh Chocolate Chip Cookies - Live Baking!"
                  />
                </div>
                <div>
                  <Label htmlFor="stream-description">Description (Optional)</Label>
                  <Textarea
                    id="stream-description"
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    placeholder="Tell viewers what you're making..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsLiveStreamOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleStartStream}
                    disabled={!streamTitle.trim()}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Go Live
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Plus className="h-6 w-6 text-primary" />
            <span>Add New Item</span>
          </Button>
        </div>

        {/* My Items */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Items</h2>
            <Badge variant="secondary">0 active</Badge>
          </div>
          
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first homemade item to sell to your neighbors
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        </div>

        {/* Kitchen Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1">0</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1">$0</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1">0</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
        </div>
      </div>
    </div>
  )
}