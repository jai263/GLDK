
import React, { useState } from 'react';
import { CartItem, Order, PaymentMethod, Settings } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  isOrdering: boolean;
  onPlaceOrder: (order: Omit<Order, 'id' | 'items' | 'total' | 'status' | 'createdAt'>) => void;
  onBack: () => void;
  settings: Settings;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, isOrdering, onPlaceOrder, onBack, settings }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Generate a standard UPI payment URL
  const upiUrl = `upi://pay?pa=${settings.gpayId}&pn=${encodeURIComponent(settings.storeName)}&am=${total.toFixed(2)}&cu=USD`;
  // Fallback QR generator
  const generatedQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(v => !v)) return alert('Please fill all shipping fields');
    onPlaceOrder({ ...formData, paymentMethod });
  };

  const handleOpenGPay = () => {
    window.location.href = upiUrl;
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className={`lg:col-span-7 ${isOrdering ? "opacity-50 pointer-events-none" : ""}`}>
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Step 1: Shipping */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center font-bold">1</span>
                Shipping Details
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="Enter your full name"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      placeholder="email@example.com"
                      value={formData.customerEmail}
                      onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Phone</label>
                    <input 
                      type="tel" 
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      placeholder="Contact number"
                      value={formData.customerPhone}
                      onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Address</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="Full address for delivery"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Payment */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center font-bold">2</span>
                Payment Options
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'online' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-lg">Online GPay</p>
                  <p className="text-xs text-slate-500 mt-1">Automatic UPI Detection</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('store')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'store' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-lg">Pay at Shop</p>
                  <p className="text-xs text-slate-500 mt-1">Cash / Pick-up</p>
                </button>
              </div>

              {paymentMethod === 'online' && (
                <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl animate-scale-in flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-2">Scan or Open App</h3>
                  
                  {/* Mobile Shortcut Button */}
                  <button 
                    type="button"
                    onClick={handleOpenGPay}
                    className="w-full mb-6 bg-white text-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition shadow-lg flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    Automatically Open GPay
                  </button>

                  <div className="bg-white p-3 rounded-2xl mb-6 shadow-inner">
                    <img 
                      src={settings.gpayQrUrl || generatedQrUrl} 
                      alt="GPay QR Code" 
                      className="w-48 h-48 sm:w-56 sm:h-56"
                    />
                  </div>

                  <div className="w-full text-center space-y-2">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">GPay ID</p>
                    <div className="bg-indigo-700/50 p-3 rounded-xl border border-indigo-400/30">
                      <span className="font-mono font-bold">{settings.gpayId}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <button 
              type="submit"
              disabled={isOrdering}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-indigo-600 transition shadow-xl flex items-center justify-center gap-3 text-lg"
            >
              {isOrdering ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Total Due: ${total.toFixed(2)}</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold">{item.quantity}x {item.name}</span>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
