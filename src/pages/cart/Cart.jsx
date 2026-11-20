import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft
} from 'lucide-react';

export default function Cart() {
  const {
    cart,
    numOfCartItems,
    totalCartPrice,
    cartLoading,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    applyCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuantityChange = async (productId, currentCount, delta) => {
    const newCount = currentCount + delta;
    setUpdatingId(productId);
    await updateCartItemQuantity(productId, newCount);
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    await removeCartItem(productId);
    setUpdatingId(null);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCode.trim());
    setApplyingCoupon(false);
  };

  if (cartLoading && !cart) {
    return <LoadingSpinner fullPage={true} message="Loading your cart..." />;
  }

  const items = cart?.products || [];

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm">
          Looks like you haven't added anything to your cart yet. Explore our fresh grocery items!
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0aad0a] hover:bg-[#088a08] text-white font-semibold rounded-xl text-sm transition-all shadow-md"
        >
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            You have <span className="font-bold text-gray-800">{numOfCartItems}</span> items in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors self-start sm:self-auto border border-red-100"
        >
          <Trash2 className="w-4 h-4" /> Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;
            const isItemUpdating = updatingId === product._id;

            return (
              <div
                key={item._id || product._id}
                className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-5 transition-all"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${product._id}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-50 p-2 shrink-0 border border-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left w-full">
                  {product.category?.name && (
                    <span className="text-[11px] font-semibold text-[#0aad0a] uppercase tracking-wider">
                      {product.category.name}
                    </span>
                  )}
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base hover:text-[#0aad0a] transition-colors line-clamp-1 mt-0.5">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="text-sm font-bold text-gray-900 mt-1">
                    {item.price} <span className="text-xs font-normal">EGP</span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                    <button
                      onClick={() => handleQuantityChange(product._id, item.count, -1)}
                      disabled={isItemUpdating}
                      className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-gray-800">
                      {isItemUpdating ? '...' : item.count}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product._id, item.count, 1)}
                      disabled={isItemUpdating}
                      className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={isItemUpdating}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#0aad0a]"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#0aad0a]"
                  />
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
                <button
                  type="submit"
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {applyingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </div>
            </form>

            <div className="space-y-3 pb-6 border-b border-gray-100 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({numOfCartItems} items)</span>
                <span className="font-semibold text-gray-900">{totalCartPrice} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Delivery</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-semibold text-gray-900">0.00 EGP</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-6 mb-6">
              <span className="text-base font-bold text-gray-900">Total Price</span>
              <span className="text-2xl font-extrabold text-[#0aad0a]">
                {totalCartPrice} <span className="text-xs font-normal text-gray-700">EGP</span>
              </span>
            </div>

            <Link
              to="/checkout"
              className="w-full py-4 px-6 bg-[#0aad0a] hover:bg-[#088a08] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure 256-bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
