export type ProductCategory =
  | 'Running'
  | 'Training'
  | 'Basketball'
  | 'Football'
  | 'Outdoor'
  | 'Lifestyle';

export type ProductSubcategory =
  | 'Road Running'
  | 'Daily Running'
  | 'Racing'
  | 'Trail Running'
  | 'Gym Training'
  | 'Cross Training'
  | 'Fitness'
  | 'Basketball Performance'
  | 'Basketball Lifestyle'
  | 'Football Boots'
  | 'Training Football Shoes'
  | 'Hiking'
  | 'Trail'
  | 'Outdoor Performance'
  | 'Sports Lifestyle'
  | 'Casual Sneakers';

export type GenderType = 'Men' | 'Women' | 'Unisex';

export type ShoeColorName =
  | 'Black'
  | 'White'
  | 'Red'
  | 'Blue'
  | 'Green'
  | 'Grey'
  | 'Orange';

export type EUSize =
  | 'EU 36'
  | 'EU 37'
  | 'EU 38'
  | 'EU 39'
  | 'EU 40'
  | 'EU 41'
  | 'EU 42'
  | 'EU 43'
  | 'EU 44'
  | 'EU 45'
  | 'EU 46';

export interface ProductColorVariant {
  name: ShoeColorName;
  label: string; // e.g., "Carbon Black / Solar Crimson"
  hex: string;
  secondaryHex: string;
  stock: number;
  imageIndex: number; // maps to primary base image
}

export interface ProductSizeOption {
  size: EUSize;
  stock: number;
}

export interface ProductImages {
  main: string;
  side: string;
  top: string;
  detail: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: 'VOLTERRA';
  category: ProductCategory;
  subcategory: ProductSubcategory;
  gender: GenderType;
  price: number;
  originalPrice: number;
  discount: number; // percentage e.g. 14 for 14%
  description: string;
  shortDescription: string;
  images: ProductImages;
  colors: ProductColorVariant[];
  sizes: ProductSizeOption[];
  stock: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  sport: string;
  materials: string[];
  weight: string; // e.g. "218g (EU 42)"
  drop: string; // e.g. "8mm"
  technology: string[];
}

export type FitFeedback = 'Small' | 'True to Size' | 'Large';

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  sizePurchased: EUSize;
  colorPurchased: ShoeColorName;
  fit: FitFeedback;
  date: string;
  verified: boolean;
}

export interface CartItem {
  productId: string;
  color: ShoeColorName;
  size: EUSize;
  quantity: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Pending'
  | 'Confirmed'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethodType =
  | 'Credit/Debit Card'
  | 'Online Banking'
  | 'E-Wallet'
  | 'Cash on Delivery';

export type DeliveryMethodType = 'standard' | 'express';

export interface ShippingAddress {
  id?: string;
  label?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  postcode: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  color: ShoeColorName;
  size: EUSize;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shippingFee: number;
  total: number;
  deliveryMethod: DeliveryMethodType;
  estimatedDelivery: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'Paid (Demo)' | 'COD Pending' | 'Refunded';
  status: OrderStatus;
  shippingAddress: ShippingAddress;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  ordersCount: number;
  totalSpending: number;
  lastOrderDate: string;
  joinedDate: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  defaultShoeSize: EUSize;
  preferredSport: ProductCategory;
  newsletterSubscribed: boolean;
  addresses: ShippingAddress[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'error';
}
