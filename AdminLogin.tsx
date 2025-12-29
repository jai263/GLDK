
import React, { useState } from 'react';

interface AdminLoginProps {
  correctPassword: string;
  onSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ correctPassword, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onSuccess();
    } else {
      setError('Incorrect admin password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Authentication</h2>
          <p className="text-sm text-slate-500">Please enter your password to manage the store.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password" 
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Enter admin password..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />
          </div>
          {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-md"
          >
            Access Dashboard
          </button>
        </form>
        
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
          <p className="text-[11px] text-amber-700 text-center leading-tight">
            <strong>Hint:</strong> If you haven't changed it, the default password is <code className="bg-amber-100 px-1 rounded">admin</code>
          </p>
        </div>

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Protected by Aura Security
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
