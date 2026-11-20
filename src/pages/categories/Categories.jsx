import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Layers, ArrowRight, Sparkles } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategoryForSubs, setSelectedCategoryForSubs] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.CATEGORIES);
        if (res.data.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleViewSubcategories = async (category) => {
    setSelectedCategoryForSubs(category);
    setLoadingSubs(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.SUBCATEGORIES_OF_CATEGORY(category._id));
      if (res.data.data) {
        setSubcategories(res.data.data);
      } else {
        setSubcategories([]);
      }
    } catch (err) {
      console.error('Failed to load subcategories', err);
      setSubcategories([]);
    } finally {
      setLoadingSubs(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0aad0a] uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            Departments
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            All Categories & Subcategories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse our wide selection of departments and find exactly what you need.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a] focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50/50"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullPage={true} message="Loading categories..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <p className="text-gray-500">No categories found matching "{search}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="h-64 overflow-hidden bg-gray-50 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-xl font-bold text-white drop-shadow-sm">
                    {cat.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleViewSubcategories(cat)}
                  className="text-xs font-semibold text-gray-600 hover:text-[#0aad0a] transition-colors py-2 px-3 rounded-lg border border-gray-200 hover:border-[#0aad0a]"
                >
                  Subcategories
                </button>
                <Link
                  to={`/categories/${cat._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0aad0a] hover:bg-[#088a08] py-2 px-4 rounded-xl transition-all shadow-xs"
                >
                  View Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subcategories Drawer / Modal */}
      {selectedCategoryForSubs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedCategoryForSubs(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <span className="text-xs font-bold text-[#0aad0a] uppercase tracking-wider">
                  Subcategories
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
                  {selectedCategoryForSubs.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCategoryForSubs(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {loadingSubs ? (
              <LoadingSpinner fullPage={false} message="Loading subcategories..." />
            ) : subcategories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  No specific subcategories registered for this category yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 max-h-72 overflow-y-auto py-2">
                {subcategories.map((sub) => (
                  <span
                    key={sub._id}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium px-3.5 py-1.5 rounded-full"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0aad0a]" />
                    {sub.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <Link
                to={`/categories/${selectedCategoryForSubs._id}`}
                className="px-5 py-2.5 bg-[#0aad0a] hover:bg-[#088a08] text-white text-sm font-semibold rounded-xl inline-flex items-center gap-2"
                onClick={() => setSelectedCategoryForSubs(null)}
              >
                Browse {selectedCategoryForSubs.name} Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
