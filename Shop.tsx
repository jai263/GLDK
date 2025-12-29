
import React, { useState } from 'react';
import { Product } from '../types';

interface ShopProps {
  products: Product[];
  addToCart: (p: Product) => void;
  searchQuery: string;
}

const Shop: React.FC<ShopProps> = ({ products, addToCart, searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleAdd = (product: Product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      {!searchQuery && activeCategory === 'All' && (
        <section className="relative h-[400px] rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            alt="Storefront"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
          <div className="relative h-full flex flex-col justify-center px-10 sm:px-20 max-w-2xl space-y-6">
            <span className="inline-block px-4 py-1.5 bg-indigo-500/20 backdrop-blur border border-indigo-400/30 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest">
              Limited Edition Arrivals
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight">
              Elevate Your Everyday.
            </h1>
            <p className="text-slate-300 text-lg">
              Discover curated pieces designed for comfort, style, and professional performance.
            </p>
            <div>
              <button 
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1"
              >
                Shop the Catalog
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Catalog Control */}
      <div id="catalog" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Browse Collections'}
          </h2>
          <p className="text-slate-500 font-medium">Showing {filteredProducts.length} premium products</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-300 space-y-4">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p className="text-slate-500 font-bold">We couldn't find what you were looking for.</p>
          <button onClick={() => { setActiveCategory('All'); }} className="text-indigo-600 font-bold hover:underline">View all products</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map(product => (
            <div key={product.id} className="group flex flex-col h-full bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-100 transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-5 left-5">
                  <span className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 shadow-sm border border-slate-100/50 uppercase tracking-widest">
                    {product.category}
                  </span>
                </div>
                {product.stock < 5 && (
                  <div className="absolute bottom-5 left-5">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      Only {product.stock} left
                    </span>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col flex-grow space-y-5">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-50">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <button 
                    onClick={() => handleAdd(product)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
                      addedId === product.id 
                      ? 'bg-emerald-500 text-white scale-95 shadow-emerald-200' 
                      : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200'
                    }`}
                  >
                    {addedId === product.id ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        Added
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
