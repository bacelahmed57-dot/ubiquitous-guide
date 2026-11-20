import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Heart, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, wishlistLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movingId, setMovingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const handleMoveToCart = async (productId) => {
    setMovingId(productId);
    const res = await addToCart(productId);
    if (res?.success) {
      await removeFromWishlist(productId);
    }
    setMovingId(null);
  };

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    await removeFromWishlist(productId);
    setRemovingId(null);
  };

  if (wishlistLoading && wishlist.length === 0) {
    return <LoadingSpinner fullPage={true} message="Loading your wishlist..." />;
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm">
          Save your favorite items here so you can easily purchase them whenever you're ready!
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0aad0a] hover:bg-[#088a08] text-white font-semibold rounded-xl text-sm transition-all shadow-md"
        >
          Discover Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          My Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          You have <span className="font-bold text-gray-800">{wishlist.length}</span> saved items in your wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => {
          if (!product) return null;
          const productId = product._id || product.id;
          const isMoving = movingId === productId;
          const isRemoving = removingId === productId;

          return (
            <div
              key={productId}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden mb-4 p-4 flex items-center justify-center">
                  <Link to={`/products/${productId}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(productId)}
                    disabled={isRemoving}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-red-500 shadow-xs transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {product.category?.name && (
                  <span className="text-[11px] font-semibold text-[#0aad0a] uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}
                <Link to={`/products/${productId}`}>
                  <h3 className="font-bold text-gray-900 text-sm hover:text-[#0aad0a] transition-colors line-clamp-1 mt-0.5">
                    {product.title}
                  </h3>
                </Link>

                <div className="text-base font-extrabold text-gray-900 mt-2">
                  {product.price} <span className="text-xs font-normal">EGP</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => handleMoveToCart(productId)}
                  disabled={isMoving}
                  className="flex-1 py-2.5 px-4 bg-[#0aad0a] hover:bg-[#088a08] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  {isMoving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRemove(productId)}
                  disabled={isRemoving}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                >
                  {isRemoving ? '...' : 'Remove'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
