import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Percent } from 'lucide-react';

export default function FeaturesBanner() {
  return (
    <div className="my-10 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <Flame className="w-4 h-4 text-amber-300" />
          Hot Deals This Weekend
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-3">
          Fresh Organic Goodness at Unbeatable Prices
        </h2>
        <p className="text-sm sm:text-base text-emerald-100 mb-6">
          Enjoy extra savings of up to 25% on dairy, seasonal fruits, and pantry favorites. Use code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">FRESH25</span> at checkout!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-white text-[#0aad0a] hover:bg-gray-100 font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all group"
        >
          Grab Deals Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Decorative background icons */}
      <div className="absolute right-6 -bottom-6 opacity-15 pointer-events-none hidden sm:block">
        <Percent className="w-64 h-64 text-white" />
      </div>
    </div>
  );
}
