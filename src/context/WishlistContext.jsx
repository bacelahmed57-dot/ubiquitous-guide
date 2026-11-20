import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const getWishlist = useCallback(async () => {
    if (!localStorage.getItem('freshcart_token')) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }
    setWishlistLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.WISHLIST);
      if (res.data.status === 'success') {
        const items = res.data.data || [];
        setWishlist(items);
        const ids = new Set(items.map((item) => (typeof item === 'string' ? item : item._id || item.id)));
        setWishlistIds(ids);
      }
    } catch (err) {
      setWishlist([]);
      setWishlistIds(new Set());
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getWishlist();
    } else {
      setWishlist([]);
      setWishlistIds(new Set());
    }
  }, [isAuthenticated, getWishlist]);

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login first to add products to your wishlist');
      return false;
    }
    try {
      const res = await axiosInstance.post(ENDPOINTS.WISHLIST, { productId });
      if (res.data.status === 'success') {
        setWishlistIds((prev) => new Set([...prev, productId]));
        toast.success(res.data.message || 'Added to wishlist!');
        getWishlist();
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axiosInstance.delete(ENDPOINTS.WISHLIST_ITEM(productId));
      if (res.data.status === 'success') {
        setWishlistIds((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
        setWishlist((prev) => prev.filter((item) => (item._id || item.id || item) !== productId));
        toast.success('Removed from wishlist');
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  const toggleWishlist = async (productId) => {
    if (wishlistIds.has(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        wishlistCount: wishlist.length,
        wishlistLoading,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
