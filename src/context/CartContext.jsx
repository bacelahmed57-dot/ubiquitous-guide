import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  const getCart = useCallback(async () => {
    if (!localStorage.getItem('freshcart_token')) {
      setCart(null);
      setCartId(null);
      setNumOfCartItems(0);
      setTotalCartPrice(0);
      return;
    }
    setCartLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.CART);
      if (res.data.status === 'success') {
        setCart(res.data.data);
        setCartId(res.data.data._id);
        setNumOfCartItems(res.data.numOfCartItems || 0);
        setTotalCartPrice(res.data.data.totalCartPrice || 0);
      }
    } catch (err) {
      // Cart might be empty or 404
      setCart(null);
      setCartId(null);
      setNumOfCartItems(0);
      setTotalCartPrice(0);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    } else {
      setCart(null);
      setCartId(null);
      setNumOfCartItems(0);
      setTotalCartPrice(0);
    }
  }, [isAuthenticated, getCart]);

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login first to add products to your cart');
      return { success: false, requireAuth: true };
    }
    try {
      const res = await axiosInstance.post(ENDPOINTS.CART, { productId });
      if (res.data.status === 'success') {
        setCart(res.data.data);
        setCartId(res.data.data._id);
        setNumOfCartItems(res.data.numOfCartItems || 0);
        setTotalCartPrice(res.data.data.totalCartPrice || 0);
        toast.success(res.data.message || 'Product added successfully to cart!');
        return { success: true, data: res.data };
      }
      return { success: false };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product to cart');
      return { success: false };
    }
  };

  const updateCartItemQuantity = async (productId, count) => {
    if (count <= 0) {
      return removeCartItem(productId);
    }
    try {
      const res = await axiosInstance.put(ENDPOINTS.CART_ITEM(productId), { count });
      if (res.data.status === 'success') {
        setCart(res.data.data);
        setCartId(res.data.data._id);
        setNumOfCartItems(res.data.numOfCartItems || 0);
        setTotalCartPrice(res.data.data.totalCartPrice || 0);
        toast.success('Cart updated successfully');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      toast.error('Failed to update quantity');
      return { success: false };
    }
  };

  const removeCartItem = async (productId) => {
    try {
      const res = await axiosInstance.delete(ENDPOINTS.CART_ITEM(productId));
      if (res.data.status === 'success') {
        setCart(res.data.data);
        setCartId(res.data.data?._id || null);
        setNumOfCartItems(res.data.numOfCartItems || 0);
        setTotalCartPrice(res.data.data?.totalCartPrice || 0);
        toast.success('Product removed from cart');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      toast.error('Failed to remove item');
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const res = await axiosInstance.delete(ENDPOINTS.CART);
      if (res.data.message === 'success' || res.data.status === 'success') {
        setCart(null);
        setCartId(null);
        setNumOfCartItems(0);
        setTotalCartPrice(0);
        toast.success('Cart cleared successfully');
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      toast.error('Failed to clear cart');
      return { success: false };
    }
  };

  const applyCoupon = async (couponName) => {
    try {
      const res = await axiosInstance.put(ENDPOINTS.APPLY_COUPON, { couponName });
      if (res.data.status === 'success') {
        setCart(res.data.data);
        setTotalCartPrice(res.data.data.totalCartPrice || 0);
        toast.success('Coupon applied successfully!');
        return { success: true, data: res.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        numOfCartItems,
        totalCartPrice,
        cartLoading,
        getCart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        applyCoupon,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
