
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, updateQuantity, removeItem, onCheckout }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => window.location.reload()} // Just a simple way to reset to shop if logic wasn't prop passed
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Shopping Cart ({items.length})</h1>
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
            <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-slate-900">{item.name}</h3>
              <p className="text-sm text-slate-500">{item.category}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 px-3 hover:bg-slate-50 transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 px-3 hover:bg-slate-50 transition"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
              <p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
          <div className="space-y-4 text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium text-slate-900">$0.00</span>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={onCheckout}
            className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition shadow-lg"
          >
            Checkout Now
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
            Secure checkout powered by AuraCommerce
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
