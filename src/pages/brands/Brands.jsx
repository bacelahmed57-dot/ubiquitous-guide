import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Store, ArrowRight } from 'lucide-react';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.BRANDS);
        if (res.data.data) {
          setBrands(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch brands', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const filtered = brands.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0aad0a] uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            Official Brands
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            All Brands
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse genuine products from top verified global and local brands.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a] focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50/50"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullPage={true} message="Loading all brands..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <p className="text-gray-500">No brands found matching "{search}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filtered.map((brand) => (
            <Link
              key={brand._id}
              to={`/brands/${brand._id}`}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col items-center justify-between text-center"
            >
              <div className="w-full aspect-square rounded-xl bg-gray-50 flex items-center justify-center p-3 mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#0aad0a] transition-colors truncate">
                  {brand.name}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-0.5 mt-1 group-hover:translate-x-1 transition-transform">
                  View Products <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
