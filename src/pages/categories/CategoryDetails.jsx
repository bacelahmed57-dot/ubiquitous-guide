import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ChevronRight, Layers, ArrowLeft, Tag } from 'lucide-react';

export default function CategoryDetails() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const [catRes, subsRes, prodsRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.CATEGORY_BY_ID(id)),
          axiosInstance.get(ENDPOINTS.SUBCATEGORIES_OF_CATEGORY(id)).catch(() => ({ data: { data: [] } })),
          axiosInstance.get(`${ENDPOINTS.PRODUCTS}?category=${id}`),
        ]);

        if (catRes.data.data) {
          setCategory(catRes.data.data);
        }
        if (subsRes.data.data) {
          setSubcategories(subsRes.data.data);
        }
        if (prodsRes.data.data) {
          setProducts(prodsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load category details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage={true} message="Loading category products..." />;
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-gray-800">Category not found</h2>
        <Link to="/categories" className="mt-4 px-6 py-2.5 bg-[#0aad0a] text-white rounded-xl font-medium">
          Back to Categories
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
        <Link to="/categories" className="hover:text-[#0aad0a]">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-semibold">{category.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0aad0a] uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> Department
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {category.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing all items in {category.name}. {products.length} product(s) available.
          </p>

          {/* Subcategories Chips */}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs font-semibold text-gray-500">Subcategories:</span>
              {subcategories.map((sub) => (
                <span
                  key={sub._id}
                  className="bg-emerald-50 text-[#0aad0a] text-xs font-medium px-3 py-1 rounded-full border border-emerald-100"
                >
                  {sub.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#0aad0a] px-4 py-2 border border-gray-200 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All Categories
        </Link>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0aad0a] flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No products found</h3>
          <p className="text-gray-500 mt-1">
            There are currently no products listed under {category.name}.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block px-5 py-2.5 bg-[#0aad0a] text-white rounded-xl text-sm font-semibold hover:bg-[#088a08]"
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
