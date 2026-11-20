import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';
import MainSlider from '../components/home/MainSlider';
import CategorySlider from '../components/home/CategorySlider';
import FeaturesBanner from '../components/home/FeaturesBanner';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, Sparkles, ArrowRight, ShieldCheck, Truck, Headphones, BadgePercent } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await axiosInstance.get(`${ENDPOINTS.PRODUCTS}?limit=24&sort=-ratingsAverage`);
        if (res.data.data) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch home products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Search Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Welcome to <span className="text-[#0aad0a]">FreshCart</span> Store
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Everything you need for your pantry & home, delivered with love.
          </p>
        </div>

        {/* Live Quick Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, groceries..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a] focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50/50"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Hero Sliders */}
      <MainSlider />

      {/* Category Slider */}
      <CategorySlider />

      {/* Featured Promo Strip */}
      <FeaturesBanner />

      {/* Popular Products Section */}
      <div className="my-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0aad0a] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Customer Favorites
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Popular Products
            </h2>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-[#0aad0a] hover:text-[#088a08] flex items-center gap-1 group self-start sm:self-auto"
          >
            Explore All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner fullPage={false} message="Loading popular products..." />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">No products matched "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredProducts.slice(0, 18).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Value Proposition Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-12 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Super Fast Delivery</h4>
            <p className="text-xs text-gray-500 mt-0.5">Direct to your doorstep in hours</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <BadgePercent className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Best Prices & Offers</h4>
            <p className="text-xs text-gray-500 mt-0.5">Cheaper prices than local markets</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">100% Genuine Products</h4>
            <p className="text-xs text-gray-500 mt-0.5">Quality checked and guaranteed</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Dedicated Support</h4>
            <p className="text-xs text-gray-500 mt-0.5">24/7 dedicated customer care</p>
          </div>
        </div>
      </div>
    </div>
  );
}
