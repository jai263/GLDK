
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  view: View;
  setView: (v: View) => void;
  cartCount: number;
  storeName: string;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView, cartCount, storeName, onSearch }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0" 
            onClick={() => setView(View.SHOP)}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">
              {storeName.charAt(0)}
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight hidden sm:block">
              {storeName}
            </span>
          </div>

          {/* Search - Only in Shop View */}
          {view === View.SHOP && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={(e) => onSearch(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-transparent rounded-2xl leading-5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <nav className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={() => setView(View.SHOP)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${view === View.SHOP ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Shop
              </button>
              <button 
                onClick={() => setView(View.ADMIN)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${view === View.ADMIN ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Admin
              </button>
            </nav>
            
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <button 
              onClick={() => setView(View.CART)}
              className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
