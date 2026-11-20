import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Package, 
  KeyRound, 
  UserCheck, 
  Store 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { numOfCartItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-[#0aad0a] font-semibold'
        : 'text-gray-600 hover:text-[#0aad0a]'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                fresh<span className="text-[#0aad0a]">cart</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/products" className={navLinkClasses}>
                Products
              </NavLink>
              <NavLink to="/categories" className={navLinkClasses}>
                Categories
              </NavLink>
              <NavLink to="/brands" className={navLinkClasses}>
                Brands
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/allorders" className={navLinkClasses}>
                  Orders
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Wishlist Icon */}
                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Wishlist"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-600 hover:text-[#0aad0a] hover:bg-emerald-50 rounded-full transition-colors"
                  title="Cart"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {numOfCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#0aad0a] text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                      {numOfCartItems}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-gray-200 hover:border-[#0aad0a] transition-colors focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0aad0a] flex items-center justify-center font-bold text-xs uppercase">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-medium text-gray-700 hidden sm:inline max-w-[100px] truncate">
                      {user?.name || 'My Account'}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 divide-y divide-gray-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.name || 'Valued Customer'}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
                        >
                          <UserCheck className="w-4 h-4" />
                          Profile & Addresses
                        </Link>
                        <Link
                          to="/allorders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          to="/change-password"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
                        >
                          <KeyRound className="w-4 h-4" />
                          Change Password
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0aad0a] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0aad0a] hover:bg-[#088a08] rounded-lg shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
          >
            Products
          </NavLink>
          <NavLink
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
          >
            Categories
          </NavLink>
          <NavLink
            to="/brands"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
          >
            Brands
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/allorders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
              >
                My Orders
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
              >
                Profile & Addresses
              </NavLink>
              <NavLink
                to="/change-password"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a]"
              >
                Change Password
              </NavLink>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-gray-700 hover:text-[#0aad0a]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-white bg-[#0aad0a] rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
