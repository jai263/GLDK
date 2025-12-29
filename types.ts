
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'online' | 'store';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export enum View {
  SHOP = 'shop',
  ADMIN = 'admin',
  ADMIN_LOGIN = 'admin_login',
  CART = 'cart',
  CHECKOUT = 'checkout',
  ORDER_SUCCESS = 'order_success'
}

export interface Settings {
  storeName: string;
  emailWebhook: string;
  spreadsheetWebhook: string;
  adminPassword: string;
  gpayId: string;
  gpayQrUrl: string;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
}
