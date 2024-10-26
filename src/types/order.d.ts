import {OrderStatus} from '@/constants/statuses'

export interface Customer {
  fullName: string
  phoneNumber?: string
}

export interface ProductDetails {
  name: string
  weight: number
  quantity: number
  price: number
}

export interface Order {
  orderID: number
  customer: Customer
  status: OrderStatus
  note?: string
  orderedAt: Date
  productDetails: ProductDetails
}
