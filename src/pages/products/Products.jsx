import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import ProductCard from '../../components/common/ProductCard';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || '-ratingsAverage');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Fetch Categories & Brands for filters
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.CATEGORIES),
          axiosInstance.get(ENDPOINTS.BRANDS),
        ]);
        if (catRes.data.data) setCategories(catRes.data.data);
        if (brandRes.data.data) setBrands(brandRes.data.data);
      } catch (err) {
        console.error('Failed to fetch categories/brands', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products with params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', '18');
        if (sortOption) params.append('sort', sortOption);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedBrand) params.append('brand', selectedBrand);

        const res = await axiosInstance.get(`${ENDPOINTS.PRODUCTS}?${params.toString()}`);
        if (res.data.data) {
          setProducts(res.data.data);
          setTotalPages(res.data.metadata?.numberOfPages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, sortOption, selectedCategory, selectedBrand]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchKeyword('');
    setSortOption('-ratingsAverage');
    setPage(1);
    setSearchParams({});
  };

  const filteredProducts = products.filter((p) =>
    searchKeyword
      ? p.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchKeyword.toLowerCase())
      : true
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Breadcrumb */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            All Products & Groceries
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore {products.length > 0 ? `${products.length}+ items` : 'our catalogue'} of top quality goods.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a] focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50/50"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <span className="font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0aad0a]" /> Filters
              </span>
              {(selectedCategory || selectedBrand || searchKeyword) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#0aad0a]">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => {
                      setSelectedCategory('');
                      setPage(1);
                    }}
                    className="accent-[#0aad0a]"
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#0aad0a]"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === c._id}
                      onChange={() => {
                        setSelectedCategory(c._id);
                        setPage(1);
                      }}
                      className="accent-[#0aad0a]"
                    />
                    <span className="truncate">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Brands
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#0aad0a]">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === ''}
                    onChange={() => {
                      setSelectedBrand('');
                      setPage(1);
                    }}
                    className="accent-[#0aad0a]"
                  />
                  <span>All Brands</span>
                </label>
                {brands.map((b) => (
                  <label
                    key={b._id}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#0aad0a]"
                  >
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === b._id}
                      onChange={() => {
                        setSelectedBrand(b._id);
                        setPage(1);
                      }}
                      className="accent-[#0aad0a]"
                    />
                    <span className="truncate">{b.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Products Grid Area */}
        <main className="lg:col-span-3">
          {/* Controls Bar: Sort & Mobile Filter Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0aad0a]" /> Filters
            </button>

            <div className="text-xs sm:text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-800">{filteredProducts.length}</span> products
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
                className="py-1.5 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 bg-white focus:outline-none focus:border-[#0aad0a]"
              >
                <option value="-ratingsAverage">Top Rated</option>
                <option value="-sold">Most Popular</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active filter badges */}
          {(selectedCategory || selectedBrand) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-gray-500">Active filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#0aad0a] text-xs font-semibold px-2.5 py-1 rounded-full">
                  Category: {categories.find((c) => c._id === selectedCategory)?.name || 'Selected'}
                  <button onClick={() => setSelectedCategory('')}>
                    <X className="w-3.5 h-3.5 hover:text-red-500" />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#0aad0a] text-xs font-semibold px-2.5 py-1 rounded-full">
                  Brand: {brands.find((b) => b._id === selectedBrand)?.name || 'Selected'}
                  <button onClick={() => setSelectedBrand('')}>
                    <X className="w-3.5 h-3.5 hover:text-red-500" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner fullPage={false} message="Loading fresh products..." />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0aad0a] flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No products found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
                Try adjusting your search keyword or clearing the active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#0aad0a] text-white rounded-xl text-sm font-semibold hover:bg-[#088a08] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <h3 className="font-bold text-gray-900">Filter Products</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="m_category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="accent-[#0aad0a]"
                    />
                    <span>All</span>
                  </label>
                  {categories.map((c) => (
                    <label key={c._id} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="m_category"
                        checked={selectedCategory === c._id}
                        onChange={() => setSelectedCategory(c._id)}
                        className="accent-[#0aad0a]"
                      />
                      <span className="truncate">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Brand
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="m_brand"
                      checked={selectedBrand === ''}
                      onChange={() => setSelectedBrand('')}
                      className="accent-[#0aad0a]"
                    />
                    <span>All</span>
                  </label>
                  {brands.map((b) => (
                    <label key={b._id} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="m_brand"
                        checked={selectedBrand === b._id}
                        onChange={() => setSelectedBrand(b._id)}
                        className="accent-[#0aad0a]"
                      />
                      <span className="truncate">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#0aad0a] text-white text-sm font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
