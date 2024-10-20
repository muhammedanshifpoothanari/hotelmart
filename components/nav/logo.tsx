import { Building2, ShoppingCart } from 'lucide-react'

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Building2 className="h-8 w-8 text-primary" />
        <ShoppingCart className="absolute -bottom-1 -right-1 h-5 w-5 text-secondary" />
      </div>
      <span className="text-xl font-bold text-primary">HotelMart</span>
    </div>
  )
}