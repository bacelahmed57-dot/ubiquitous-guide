export const BASE_URL = 'https://ecommerce.routemisr.com';

export const ENDPOINTS = {
  // Auth
  SIGNUP: '/api/v1/auth/signup',
  SIGNIN: '/api/v1/auth/signin',
  FORGOT_PASSWORD: '/api/v1/auth/forgotPasswords',
  VERIFY_RESET_CODE: '/api/v1/auth/verifyResetCode',
  RESET_PASSWORD: '/api/v1/auth/resetPassword',
  CHANGE_PASSWORD: '/api/v1/users/changeMyPassword',
  UPDATE_ME: '/api/v1/users/updateMe',
  VERIFY_TOKEN: '/api/v1/auth/verifyToken',

  // Products
  PRODUCTS: '/api/v1/products',
  PRODUCT_BY_ID: (id) => `/api/v1/products/${id}`,

  // Categories & Subcategories
  CATEGORIES: '/api/v1/categories',
  CATEGORY_BY_ID: (id) => `/api/v1/categories/${id}`,
  SUBCATEGORIES: '/api/v1/subcategories',
  SUBCATEGORY_BY_ID: (id) => `/api/v1/subcategories/${id}`,
  SUBCATEGORIES_OF_CATEGORY: (catId) => `/api/v1/categories/${catId}/subcategories`,

  // Brands
  BRANDS: '/api/v1/brands',
  BRAND_BY_ID: (id) => `/api/v1/brands/${id}`,

  // Cart
  CART: '/api/v1/cart',
  CART_ITEM: (id) => `/api/v1/cart/${id}`,
  APPLY_COUPON: '/api/v2/cart/applyCoupon',

  // Wishlist
  WISHLIST: '/api/v1/wishlist',
  WISHLIST_ITEM: (id) => `/api/v1/wishlist/${id}`,

  // Orders
  CASH_ORDER: (cartId) => `/api/v1/orders/${cartId}`,
  CHECKOUT_SESSION: (cartId, returnUrl) => `/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
  USER_ORDERS: (userId) => `/api/v1/orders/user/${userId}`,
  ALL_ORDERS: '/api/v1/orders',

  // Addresses
  ADDRESSES: '/api/v1/addresses',
  ADDRESS_ITEM: (id) => `/api/v1/addresses/${id}`,
};
