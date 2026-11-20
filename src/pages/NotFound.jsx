import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center mb-6 shadow-sm">
        <ShoppingBag className="w-12 h-12" />
      </div>
      <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-2">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md text-sm">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#0aad0a] hover:bg-[#088a08] text-white font-semibold rounded-xl text-sm transition-all shadow-md"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Homepage
      </Link>
    </div>
  );
}
