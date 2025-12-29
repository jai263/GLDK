
import { Product, Settings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Quartz Watch',
    description: 'A timeless piece with a sleek stainless steel finish and premium leather strap.',
    price: 129.99,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/watch/600/600',
    stock: 15
  },
  {
    id: '2',
    name: 'Premium Wireless Headphones',
    description: 'Noise-canceling technology with 40 hours of battery life and studio-quality sound.',
    price: 249.50,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/audio/600/600',
    stock: 8
  },
  {
    id: '3',
    name: 'Organic Cotton Tee',
    description: 'Breathable, sustainable, and incredibly soft. Perfect for everyday comfort.',
    price: 35.00,
    category: 'Apparel',
    image: 'https://picsum.photos/seed/shirt/600/600',
    stock: 50
  }
];

export const INITIAL_SETTINGS: Settings = {
  storeName: 'AuraCommerce',
  emailWebhook: '',
  spreadsheetWebhook: '',
  adminPassword: 'admin',
  gpayId: 'yourname@okaxis',
  gpayQrUrl: '',
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: ''
};
