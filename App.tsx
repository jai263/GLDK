
import React, { useState, useEffect } from 'react';
import { View, Product, CartItem, Order, Settings, PaymentMethod } from './types';
import { getStoredProducts, saveProducts, getStoredOrders, saveOrder, getStoredSettings, saveSettings } from './services/storage';
import Navbar from './components/Navbar';
import Shop from './components/Shop';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.SHOP);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings>(getStoredSettings());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'items' | 'total' | 'status' | 'createdAt'>) => {
    setIsOrdering(true);
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    saveOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
    
    // 1. Send Email via EmailJS
    if (settings.emailjsServiceId && settings.emailjsTemplateId && settings.emailjsPublicKey) {
      try {
        const itemNames = newOrder.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: settings.emailjsServiceId,
            template_id: settings.emailjsTemplateId,
            user_id: settings.emailjsPublicKey,
            template_params: {
              order_id: newOrder.id,
              customer_name: newOrder.customerName,
              customer_email: newOrder.customerEmail,
              customer_phone: newOrder.customerPhone,
              address: newOrder.address,
              payment_method: newOrder.paymentMethod,
              items: itemNames,
              total_amount: `$${newOrder.total.toFixed(2)}`,
              store_name: settings.storeName
            }
          })
        });
      } catch (err) {
        console.error("EmailJS failure:", err);
      }
    }

    // 2. Fire Webhook for Spreadsheet
    const webhookUrl = settings.emailWebhook || settings.spreadsheetWebhook;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
      } catch (err) {
        console.error("Webhook failure:", err);
      }
    }

    setCart([]);
    setIsOrdering(false);
    setView(View.ORDER_SUCCESS);
  };

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts([...updatedProducts]);
    saveProducts([...updatedProducts]);
  };

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setView(View.ADMIN);
    } else {
      setView(View.ADMIN_LOGIN);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        view={view} 
        setView={(v) => v === View.ADMIN ? handleAdminAccess() : setView(v)} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        storeName={settings.storeName}
        onSearch={setSearchQuery}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex-grow w-full">
        {view === View.SHOP && (
          <Shop products={products} addToCart={addToCart} searchQuery={searchQuery} />
        )}
        
        {view === View.CART && (
          <Cart 
            items={cart} 
            updateQuantity={updateCartQuantity} 
            removeItem={removeFromCart} 
            onCheckout={() => setView(View.CHECKOUT)}
          />
        )}

        {view === View.CHECKOUT && (
          <Checkout 
            cart={cart} 
            isOrdering={isOrdering}
            onPlaceOrder={placeOrder} 
            onBack={() => setView(View.CART)} 
            settings={settings}
          />
        )}

        {view === View.ADMIN_LOGIN && (
          <AdminLogin 
            correctPassword={settings.adminPassword} 
            onSuccess={() => { setIsAuthenticated(true); setView(View.ADMIN); }} 
          />
        )}

        {view === View.ADMIN && isAuthenticated && (
          <AdminDashboard 
            products={products} 
            orders={orders} 
            settings={settings}
            onUpdateProducts={handleUpdateProducts}
            onUpdateSettings={(s) => { setSettings(s); saveSettings(s); }}
            onLogout={() => { setIsAuthenticated(false); setView(View.SHOP); }}
          />
        )}

        {view === View.ORDER_SUCCESS && (
          <div className="max-w-2xl mx-auto text-center py-32 bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-100 animate-scale-in">
            <div className="mb-10 flex justify-center">
              <div className="bg-emerald-100 p-8 rounded-full ring-8 ring-emerald-50">
                <svg className="w-20 h-20 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6">Payment Success!</h1>
            <p className="text-xl text-slate-500 mb-12 max-w-md mx-auto leading-relaxed">Your order has been recorded. We'll send a confirmation to your email shortly.</p>
            <button 
              onClick={() => setView(View.SHOP)}
              className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </main>
      
      <footer className="border-t border-slate-200/60 bg-white py-20 px-4 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
             <div className="w-6 h-6 bg-slate-900 rounded-md"></div>
             <span className="font-black tracking-tighter text-lg">{settings.storeName}</span>
          </div>
          <p className="text-slate-400 font-medium text-sm">© {new Date().getFullYear()} AuraCommerce Engine. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="hover:text-indigo-600 cursor-pointer transition">Privacy</span>
            <span className="hover:text-indigo-600 cursor-pointer transition">Terms</span>
            <span className="hover:text-indigo-600 cursor-pointer transition">Returns</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
