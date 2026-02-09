export interface Category {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
  products?: Product[]
}

export interface Product {
  id: number
  product_code: string | null
  name: string
  brand_name: string | null
  company_name: string | null
  category_id: number | null
  case_size: string | null
  pack_size: string | null
  shelf_life: string | null
  base_price: number
  gst_percentage: number
  final_price: number
  description: string | null
  image_url: string | null
  images?: string[]
  stock_status: 'IN' | 'OUT'
  is_featured: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface AdminUser {
  id: number
  username: string
  email: string | null
  role: string
  created_at: string
}

export interface ShopInfo {
  id: number
  shop_name: string
  owner_name: string | null
  business_idea: string | null
  concept_vision: string | null
  logo_url: string | null
  banner_url: string | null
  address: string | null
  phone: string | null
  email: string | null
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

export interface DashboardStats {
  totalProducts: number
  inStockProducts: number
  outOfStockProducts: number
  categoriesCount: number
  recentProducts: Product[]
  unreadMessages: number
}

export interface Review {
  id: number
  product_id: number
  user_name: string
  user_email: string | null
  rating: number
  title: string | null
  comment: string | null
  is_verified_purchase: boolean
  is_approved: boolean
  helpful_count: number
  created_at: string
  updated_at: string
}

export interface ReviewStats {
  average: number
  total: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}
