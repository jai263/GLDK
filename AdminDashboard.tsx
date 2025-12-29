
import React, { useState } from 'react';
import { Product, Order, Settings } from '../types';
import { generateProductDescription } from '../services/gemini';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  settings: Settings;
  onUpdateProducts: (p: Product[]) => void;
  onUpdateSettings: (s: Settings) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, settings, onUpdateProducts, onUpdateSettings, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: 'https://picsum.photos/seed/' + Math.random() + '/600/600',
    stock: 0
  });
  const [aiLoading, setAiLoading] = useState(false);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = products.map(p => p.id === editingId ? { ...newProduct, id: editingId } : p);
      onUpdateProducts(updated);
      setEditingId(null);
    } else {
      const product: Product = { ...newProduct, id: Date.now().toString() };
      onUpdateProducts([product, ...products]);
    }
    setIsAdding(false);
    setNewProduct({ name: '', description: '', price: 0, category: '', image: 'https://picsum.photos/seed/' + Math.random() + '/600/600', stock: 0 });
  };

  const startEdit = (p: Product) => {
    setNewProduct(p);
    setEditingId(p.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAiDescribe = async () => {
    if (!newProduct.name || !newProduct.category) return alert('Enter name and category first!');
    setAiLoading(true);
    const desc = await generateProductDescription(newProduct.name, newProduct.category);
    setNewProduct({ ...newProduct, description: desc });
    setAiLoading(false);
  };

  const testWebhook = async () => {
    if (!settings.emailWebhook) return alert("Please enter a Spreadsheet Webhook URL first!");
    setTestStatus('loading');
    try {
      await fetch(settings.emailWebhook, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          id: 'TEST-123',
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          total: 99.99,
          items: '1x Test Product',
          address: '123 Testing Lane'
        })
      });
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 3000);
    } catch (err) {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Store Console</h1>
          <p className="text-slate-500 font-medium">Control center for {settings.storeName}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            {(['products', 'orders', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-black capitalize transition-all ${
                  activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-md border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button onClick={onLogout} className="px-5 py-2 text-sm font-black text-red-500 hover:bg-red-50 rounded-xl transition-all">Logout</button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900">Inventory Catalog</h2>
            <button 
              onClick={() => { setIsAdding(!isAdding); if(isAdding) setEditingId(null); }} 
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all"
            >
              {isAdding ? 'Close Manager' : 'Add New Item'}
            </button>
          </div>
          
          {isAdding && (
            <form onSubmit={handleAddProduct} className="bg-white p-8 sm:p-10 rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Product Title</label>
                  <input type="text" placeholder="e.g. Premium Backpack" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category Label</label>
                  <input type="text" placeholder="e.g. Travel" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Price ($)</label>
                    <input type="number" step="0.01" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Inventory Stock</label>
                    <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} required />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                    <button type="button" onClick={handleAiDescribe} disabled={aiLoading} className="text-xs text-indigo-600 font-black hover:underline flex items-center gap-1">
                      {aiLoading ? 'Thinking...' : '✨ AI Generate'}
                    </button>
                  </div>
                  <textarea placeholder="Tell your customers about this product..." className="w-full flex-grow px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" rows={6} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
                </div>
              </div>

              <div className="md:col-span-2 pt-4 border-t border-slate-50">
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  {editingId ? 'Confirm Update' : 'Publish Product'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Info</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-14 h-14 rounded-[1.25rem] object-cover border-2 border-slate-100 shadow-sm" alt={p.name} />
                          <div>
                            <p className="font-black text-slate-900">{p.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900">${p.price.toFixed(2)}</td>
                      <td className="px-8 py-6 font-black text-slate-900">
                        <span className={`px-3 py-1 rounded-lg text-xs ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button onClick={() => startEdit(p)} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-black text-xs uppercase tracking-widest">Edit</button>
                        <button onClick={() => onUpdateProducts(products.filter(item => item.id !== p.id))} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-xs uppercase tracking-widest">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders & Settings Tab remains optimized as before... */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 gap-6">
           <h2 className="text-2xl font-black text-slate-900">Sales History</h2>
           {orders.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">No orders processed yet.</div>
           ) : (
             orders.map(order => (
               <div key={order.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-8">
                 <div className="space-y-4">
                   <div className="flex items-center gap-4">
                     <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">#{order.id}</span>
                     <p className="text-slate-400 text-xs font-bold">{new Date(order.createdAt).toLocaleString()}</p>
                   </div>
                   <div>
                     <p className="text-xl font-black text-slate-900">{order.customerName}</p>
                     <p className="text-sm text-slate-500 font-medium">{order.customerPhone} • {order.customerEmail}</p>
                     <p className="text-xs text-slate-400 italic mt-2 bg-slate-50 p-3 rounded-xl inline-block">{order.address}</p>
                   </div>
                 </div>
                 <div className="text-right flex flex-col justify-center gap-2">
                   <p className="text-3xl font-black text-slate-900">${order.total.toFixed(2)}</p>
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{order.paymentMethod} Payment</span>
                 </div>
               </div>
             ))
           )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Settings logic is consistent with standard high-use admin UI... */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Branding</h2>
            <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="Store Name" value={settings.storeName} onChange={e => onUpdateSettings({...settings, storeName: e.target.value})} />
            <input type="password" placeholder="Admin Access Code" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={settings.adminPassword} onChange={e => onUpdateSettings({...settings, adminPassword: e.target.value})} />
          </div>

          <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 space-y-6">
            <h2 className="text-2xl font-black">Payments</h2>
            <div className="space-y-4">
               <input type="text" placeholder="UPI ID (e.g. name@okaxis)" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-indigo-200 outline-none" value={settings.gpayId} onChange={e => onUpdateSettings({...settings, gpayId: e.target.value})} />
               <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">This ID generates your GPay QR code.</p>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Automation Bridge</h2>
              <button 
                onClick={testWebhook}
                disabled={testStatus === 'loading'}
                className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md ${
                  testStatus === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  testStatus === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-slate-900 text-white hover:bg-indigo-600'
                }`}
              >
                {testStatus === 'loading' ? 'Testing...' : testStatus === 'success' ? 'Connected!' : testStatus === 'error' ? 'Failed' : 'Verify Sheet Connection'}
              </button>
            </div>
            <input type="url" placeholder="Your Google Apps Script Webhook URL" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={settings.emailWebhook} onChange={e => onUpdateSettings({...settings, emailWebhook: e.target.value})} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
               <input type="text" placeholder="EmailJS Service ID" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={settings.emailjsServiceId} onChange={e => onUpdateSettings({...settings, emailjsServiceId: e.target.value})} />
               <input type="text" placeholder="EmailJS Template ID" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={settings.emailjsTemplateId} onChange={e => onUpdateSettings({...settings, emailjsTemplateId: e.target.value})} />
               <input type="text" placeholder="EmailJS Public Key" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={settings.emailjsPublicKey} onChange={e => onUpdateSettings({...settings, emailjsPublicKey: e.target.value})} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
