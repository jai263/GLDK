
import { Product, Order, Settings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../constants';

const KEYS = {
  PRODUCTS: 'aura_products',
  ORDERS: 'aura_orders',
  SETTINGS: 'aura_settings'
};

export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : INITIAL_PRODUCTS;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem(KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveOrder = (order: Order) => {
  const orders = getStoredOrders();
  localStorage.setItem(KEYS.ORDERS, JSON.stringify([order, ...orders]));
};

export const getStoredSettings = (): Settings => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : INITIAL_SETTINGS;
};

export const saveSettings = (settings: Settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};
