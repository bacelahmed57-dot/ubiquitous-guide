import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [wishlistToggling, setWishlistToggling] = useState(false);

  const productId = product._id || product.id;
  const isFavorited = isInWishlist(productId);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    const res = await addToCart(productId);
    setAdding(false);
    if (res?.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistToggling) return;
    setWishlistToggling(true);
    await toggleWishlist(productId);
    setWishlistToggling(false);
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
      {/* Top badges & Wishlist button */}
      <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
        <Link to={`/products/${productId}`} className="absolute inset-0 flex items-center justify-center p-4">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistToggling}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>

        {product.priceAfterDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            SALE
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {product.category?.name && (
            <span className="text-xs font-semibold text-[#0aad0a] uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <Link to={`/products/${productId}`}>
            <h3 className="font-semibold text-gray-800 text-sm hover:text-[#0aad0a] transition-colors line-clamp-2 mt-1">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            {product.priceAfterDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-gray-900">
                  {product.priceAfterDiscount} <span className="text-xs font-normal">EGP</span>
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {product.price} EGP
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-gray-900">
                {product.price} <span className="text-xs font-normal">EGP</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-amber-50 px-2 py-1 rounded-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.ratingsAverage || 4.5}</span>
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className={`w-full mt-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs ${
            justAdded
              ? 'bg-emerald-700 text-white'
              : 'bg-[#0aad0a] hover:bg-[#088a08] text-white active:scale-[0.98]'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added!</span>
            </>
          ) : adding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
