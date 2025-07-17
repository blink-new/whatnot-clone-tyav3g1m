import { MapPin, Star, Clock } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface FoodItem {
  id: string
  sellerId: string
  sellerName: string
  title: string
  description: string
  price: number
  image: string
  distance: number
  freshness: string
  category: string
  rating: number
  reviewCount: number
}

interface FoodItemCardProps {
  item: FoodItem
  onClick: () => void
}

export function FoodItemCard({ item, onClick }: FoodItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="relative" onClick={onClick}>
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-700 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {item.freshness}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary/90 text-white text-xs">
            ${item.price}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {item.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{item.distance}km • {item.sellerName}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{item.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({item.reviewCount})</span>
          </div>
          
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Order Now
          </Button>
        </div>
      </div>
    </div>
  )
}