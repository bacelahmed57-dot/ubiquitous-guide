import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 pt-12 pb-8 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-gray-200">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Free Delivery</h4>
              <p className="text-xs text-gray-500">Orders from all items over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Easy Returns</h4>
              <p className="text-xs text-gray-500">Not satisfied? Return in 14 days</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">100% Secure Checkout</h4>
              <p className="text-xs text-gray-500">Encrypted payment gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">24/7 Support</h4>
              <p className="text-xs text-gray-500">Ready to help you anytime</p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0aad0a] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold text-gray-900">
                fresh<span className="text-[#0aad0a]">cart</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              FreshCart is your trusted online grocery & essentials supermarket. Delivering quality products fresh to your doorstep every day.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Email: support@freshcart.route.com</p>
              <p>Call Us: +20 (100) 123-4567</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-[#0aad0a] transition-colors">Men's Fashion</Link></li>
              <li><Link to="/products" className="hover:text-[#0aad0a] transition-colors">Women's Fashion</Link></li>
              <li><Link to="/products" className="hover:text-[#0aad0a] transition-colors">Electronics</Link></li>
              <li><Link to="/categories" className="hover:text-[#0aad0a] transition-colors">View All Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-[#0aad0a] transition-colors">All Products</Link></li>
              <li><Link to="/brands" className="hover:text-[#0aad0a] transition-colors">Featured Brands</Link></li>
              <li><Link to="/cart" className="hover:text-[#0aad0a] transition-colors">My Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#0aad0a] transition-colors">My Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/profile" className="hover:text-[#0aad0a] transition-colors">Profile & Settings</Link></li>
              <li><Link to="/allorders" className="hover:text-[#0aad0a] transition-colors">Order History</Link></li>
              <li><Link to="/login" className="hover:text-[#0aad0a] transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-[#0aad0a] transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Partners & Payment badges */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Payment Partners:</span>
            <span className="px-2 py-1 bg-white border border-gray-200 rounded font-semibold text-gray-600">Amazon Pay</span>
            <span className="px-2 py-1 bg-white border border-gray-200 rounded font-semibold text-gray-600">MasterCard</span>
            <span className="px-2 py-1 bg-white border border-gray-200 rounded font-semibold text-gray-600">PayPal</span>
            <span className="px-2 py-1 bg-white border border-gray-200 rounded font-semibold text-gray-600">Cash On Delivery</span>
          </div>

          <p>© {new Date().getFullYear()} FreshCart Route Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
