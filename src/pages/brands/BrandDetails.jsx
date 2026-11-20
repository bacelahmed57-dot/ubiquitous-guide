import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ChevronRight, Store, ArrowLeft } from 'lucide-react';

export default function BrandDetails() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      try {
        const [brandRes, prodRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.BRAND_BY_ID(id)),
          axiosInstance.get(`${ENDPOINTS.PRODUCTS}?brand=${id}`),
        ]);

        if (brandRes.data.data) {
          setBrand(brandRes.data.data);
        }
        if (prodRes.data.data) {
          setProducts(prodRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load brand details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage={true} message="Loading brand products..." />;
  }

  if (!brand) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-gray-800">Brand not found</h2>
        <Link to="/brands" className="mt-4 px-6 py-2.5 bg-[#0aad0a] text-white rounded-xl font-medium">
          Back to Brands
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#0aad0a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/brands" className="hover:text-[#0aad0a]">Brands</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-semibold">{brand.name}</span>
      </nav>

      {/* Brand Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-50 border border-gray-100 p-4 flex items-center justify-center shrink-0">
          <img
            src={brand.image}
            alt={brand.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0aad0a] uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" /> Official Brand
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {brand.name} Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing all verified items from {brand.name}. {products.length} product(s) available.
          </p>
        </div>
        <Link
          to="/brands"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#0aad0a] px-4 py-2 border border-gray-200 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All Brands
        </Link>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-gray-500">No products currently available for {brand.name}.</p>
          <Link
            to="/products"
            className="mt-4 inline-block px-5 py-2.5 bg-[#0aad0a] text-white rounded-xl text-sm font-semibold hover:bg-[#088a08]"
          >
            Explore Other Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
