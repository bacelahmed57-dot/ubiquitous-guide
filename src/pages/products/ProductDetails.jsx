import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(ENDPOINTS.PRODUCT_BY_ID(id));
        if (res.data.data) {
          const prodData = res.data.data;
          setProduct(prodData);
          setSelectedImage(prodData.imageCover || (prodData.images && prodData.images[0]));
          setQuantity(1);

          // Fetch related products
          if (prodData.category?._id) {
            const relRes = await axiosInstance.get(
              `${ENDPOINTS.PRODUCTS}?category=${prodData.category._id}&limit=7`
            );
            if (relRes.data.data) {
              setRelatedProducts(
                relRes.data.data.filter((item) => item._id !== prodData._id).slice(0, 6)
              );
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage={true} message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-gray-800">Product not found</h2>
        <Link to="/products" className="mt-4 px-6 py-2.5 bg-[#0aad0a] text-white rounded-xl font-medium">
          Back to Products
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    // Add product to cart
    const res = await addToCart(product._id);
    setAddingToCart(false);
    if (res?.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const allImages = [product.imageCover, ...(product.images || [])].filter(
    (v, i, a) => v && a.indexOf(v) === i
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-[#0aad0a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-[#0aad0a]">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/categories/${product.category._id}`} className="hover:text-[#0aad0a]">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs mb-12">
        {/* Images Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center p-6">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-contain"
            />
            {product.priceAfterDiscount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                SALE
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 p-1 bg-gray-50 transition-all ${
                    selectedImage === img
                      ? 'border-[#0aad0a] shadow-xs scale-95'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Brand Badges */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {product.category && (
                <Link
                  to={`/categories/${product.category._id}`}
                  className="text-xs font-bold text-[#0aad0a] bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider"
                >
                  {product.category.name}
                </Link>
              )}
              {product.brand && (
                <Link
                  to={`/brands/${product.brand._id}`}
                  className="text-xs font-medium text-gray-500 hover:text-gray-800"
                >
                  Brand: <span className="font-semibold text-gray-700">{product.brand.name}</span>
                </Link>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug mb-3">
              {product.title}
            </h1>

            {/* Ratings & Sold */}
            <div className="flex items-center gap-4 text-sm mb-5 pb-5 border-b border-gray-100 flex-wrap">
              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-700 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.ratingsAverage || 4.5}</span>
                <span className="text-xs font-normal text-gray-500">
                  ({product.ratingsQuantity || 12} reviews)
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500 font-medium">
                {product.sold ? `${product.sold} sold` : 'In high demand'}
              </span>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <Check className="w-3.5 h-3.5" /> In Stock
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.priceAfterDiscount ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    {product.priceAfterDiscount} <span className="text-sm font-semibold">EGP</span>
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {product.price} EGP
                  </span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                    Save {Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}%
                  </span>
                </div>
              ) : (
                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  {product.price} <span className="text-sm font-semibold">EGP</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Overview
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Row: Quantity + Add To Cart + Wishlist */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-md ${
                  addedSuccess
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#0aad0a] hover:bg-[#088a08] text-white active:scale-[0.98]'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                aria-label="Wishlist"
                className={`p-4 rounded-2xl border transition-all ${
                  isFavorited
                    ? 'border-red-200 bg-red-50 text-red-500 shadow-xs'
                    : 'border-gray-200 hover:border-red-300 text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorited ? 'fill-red-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                aria-label="Share"
                className="p-4 rounded-2xl border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-800 transition-all"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Truck className="w-5 h-5 text-[#0aad0a] mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-gray-700">Fast Delivery</p>
                <p className="text-[10px] text-gray-400">Within 24-48 hrs</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-[#0aad0a] mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-gray-700">100% Genuine</p>
                <p className="text-[10px] text-gray-400">Certified seller</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <RefreshCw className="w-5 h-5 text-[#0aad0a] mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-gray-700">14-Day Return</p>
                <p className="text-[10px] text-gray-400">Free return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Related Products
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                More top items in {product.category?.name || 'this category'}
              </p>
            </div>
            {product.category && (
              <Link
                to={`/categories/${product.category._id}`}
                className="text-xs sm:text-sm font-semibold text-[#0aad0a] hover:text-[#088a08]"
              >
                See all in category →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
