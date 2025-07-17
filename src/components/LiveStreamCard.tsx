import { MapPin, Eye, Play } from 'lucide-react'
import { Badge } from './ui/badge'

interface LiveStream {
  id: string
  sellerId: string
  sellerName: string
  title: string
  thumbnail: string
  viewerCount: number
  distance: number
  isLive: boolean
  category: string
}

interface LiveStreamCardProps {
  stream: LiveStream
  onClick: () => void
}

export function LiveStreamCard({ stream, onClick }: LiveStreamCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Live indicator */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-red-500 text-white text-xs animate-pulse">
            <div className="h-2 w-2 bg-white rounded-full mr-1"></div>
            LIVE
          </Badge>
        </div>
        
        {/* Viewer count */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/70 text-white text-xs">
            <Eye className="h-3 w-3 mr-1" />
            {stream.viewerCount}
          </Badge>
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 rounded-full p-3">
            <Play className="h-6 w-6 text-gray-900 fill-current" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
          {stream.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">{stream.sellerName}</span>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{stream.distance}km</span>
          </div>
        </div>
      </div>
    </div>
  )
}