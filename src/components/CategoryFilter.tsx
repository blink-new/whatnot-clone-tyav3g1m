import { Badge } from './ui/badge'

const categories = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'cookies', label: 'Cookies', icon: '🍪' },
  { id: 'cakes', label: 'Cakes', icon: '🎂' },
  { id: 'bread', label: 'Bread', icon: '🍞' },
  { id: 'pastries', label: 'Pastries', icon: '🥐' },
  { id: 'pies', label: 'Pies', icon: '🥧' },
  { id: 'muffins', label: 'Muffins', icon: '🧁' },
  { id: 'donuts', label: 'Donuts', icon: '🍩' },
  { id: 'other', label: 'Other', icon: '✨' }
]

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}