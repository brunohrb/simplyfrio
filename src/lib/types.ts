export type ItemStatus = 'disponivel' | 'alugado' | 'manutencao' | 'vendido'
export type RentalStatus = 'ativo' | 'devolvido' | 'atrasado' | 'cancelado'

export interface Category {
  id: string
  name: string
  description?: string
}

export interface Item {
  id: string
  name: string
  category_id?: string
  description?: string
  size?: string
  color?: string
  brand?: string
  rental_price: number
  sale_price?: number
  status: ItemStatus
  photo_url?: string
  photo_urls?: string[]
  purchase_price?: number
  purchase_date?: string
  notes?: string
  created_at: string
  categories?: Category
}

export interface Customer {
  id: string
  full_name: string
  phone?: string
  whatsapp?: string
  email?: string
  birthday?: string
  cpf?: string
  address?: string
  notes?: string
  points: number
  created_at: string
}

export interface RentalItem {
  id: string
  rental_id: string
  item_id: string
  rental_price: number
  items?: Item
}

export interface Rental {
  id: string
  customer_id?: string
  rental_date: string
  expected_return?: string
  actual_return?: string
  total_amount: number
  deposit_paid: number
  balance_due: number
  status: RentalStatus
  discount_amount: number
  notes?: string
  created_by?: string
  created_at: string
  customers?: Customer
  rental_items?: RentalItem[]
}

export interface Sale {
  id: string
  customer_id?: string
  sale_date: string
  total_amount: number
  payment_method: string
  discount_amount: number
  notes?: string
  created_at: string
  customers?: Customer
  sale_items?: { id: string; item_id: string; sale_price: number; items?: Item }[]
}

export interface DashboardStats {
  totalItems: number
  availableItems: number
  rentedItems: number
  activeRentals: number
  overdueRentals: number
  monthlyRevenue: number
  pendingBalance: number
  totalCustomers: number
}
