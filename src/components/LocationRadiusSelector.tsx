import { MapPin, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const radiusOptions = [
  { value: 1, label: '1km' },
  { value: 2, label: '2km' },
  { value: 5, label: '5km' },
  { value: 10, label: '10km' },
  { value: 20, label: '20km' },
  { value: 50, label: '50km' }
]

interface LocationRadiusSelectorProps {
  radius: number
  onRadiusChange: (radius: number) => void
}

export function LocationRadiusSelector({ radius, onRadiusChange }: LocationRadiusSelectorProps) {
  const currentOption = radiusOptions.find(option => option.value === radius) || radiusOptions[2]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {currentOption.label}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {radiusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onRadiusChange(option.value)}
            className={radius === option.value ? 'bg-primary/10' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}