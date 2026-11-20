import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  Building,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, cartId, totalCartPrice, numOfCartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    details: '',
    phone: '',
    city: 'Cairo',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'online'
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.ADDRESSES);
        if (res.data.data && res.data.data.length > 0) {
          setSavedAddresses(res.data.data);
          const first = res.data.data[0];
          setShippingAddress({
            details: first.details || '',
            phone: first.phone || '',
            city: first.city || 'Cairo',
            postalCode: first.postalCode || '',
          });
        }
      } catch (err) {
        // user might not have saved addresses yet
      }
    };
    fetchAddresses();
  }, []);

  const handleAddressSelect = (addr) => {
    setShippingAddress({
      details: addr.details || '',
      phone: addr.phone || '',
      city: addr.city || 'Cairo',
      postalCode: addr.postalCode || '',
    });
  };

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cartId) {
      toast.error('Cart not found. Please add items to your cart first.');
      return;
    }

    if (!shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
      toast.error('Please complete all shipping address fields.');
      return;
    }

    setLoading(true);

    // If user checked save address, save it to the addresses API
    if (saveThisAddress) {
      try {
        await axiosInstance.post(ENDPOINTS.ADDRESSES, {
          name: shippingAddress.city + ' Address',
          details: shippingAddress.details,
          phone: shippingAddress.phone,
          city: shippingAddress.city,
        });
      } catch {
        // ignore address save errors
      }
    }

    try {
      if (paymentMethod === 'cash') {
        // Create Cash Order
        const res = await axiosInstance.post(ENDPOINTS.CASH_ORDER(cartId), {
          shippingAddress: {
            details: shippingAddress.details,
            phone: shippingAddress.phone,
            city: shippingAddress.city,
          },
        });

        if (res.data.status === 'success' || res.data.data) {
          toast.success('Order placed successfully! Cash on delivery.');
          await clearCart();
          navigate('/allorders');
        } else {
          toast.error(res.data.message || 'Failed to place cash order.');
        }
      } else {
        // Online Payment Checkout Session (Stripe)
        const originUrl = window.location.origin;
        const res = await axiosInstance.post(
          ENDPOINTS.CHECKOUT_SESSION(cartId, originUrl),
          {
            shippingAddress: {
              details: shippingAddress.details,
              phone: shippingAddress.phone,
              city: shippingAddress.city,
            },
          }
        );

        if (res.data.status === 'success' && res.data.session?.url) {
          toast.success('Redirecting to secure online payment gateway...');
          window.location.href = res.data.session.url;
        } else {
          toast.error('Failed to create online payment session.');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order processing failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="px-6 py-2.5 bg-[#0aad0a] text-white rounded-xl text-sm font-semibold">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="pb-6 mb-8 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Checkout & Shipping
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete your order with safe and reliable delivery.
        </p>
      </div>

      <form onSubmit={handleCheckout}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Saved addresses selector if any */}
            {savedAddresses.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#0aad0a]" /> Use Saved Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <button
                      type="button"
                      key={addr._id}
                      onClick={() => handleAddressSelect(addr)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        shippingAddress.details === addr.details
                          ? 'border-[#0aad0a] bg-emerald-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-xs text-gray-900">{addr.name || 'Saved Address'}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{addr.details}</p>
                      <p className="text-[11px] text-gray-400">{addr.city} • {addr.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Address Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[#0aad0a]" /> Shipping Address
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Detailed Address (Street, Building, Apt)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="details"
                    required
                    value={shippingAddress.details}
                    onChange={handleInputChange}
                    placeholder="e.g. 15 El-Tahrir Street, Apt 4"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a] focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                  <Building className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    City / Governorate
                  </label>
                  <select
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a] focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
                  >
                    <option value="Cairo">Cairo (القاهرة)</option>
                    <option value="Giza">Giza (الجيزة)</option>
                    <option value="Alexandria">Alexandria (الإسكندرية)</option>
                    <option value="Mansoura">Mansoura (المنصورة)</option>
                    <option value="Tanta">Tanta (طنطا)</option>
                    <option value="Aswan">Aswan (أسوان)</option>
                    <option value="Luxor">Luxor (الأقصر)</option>
                    <option value="Port Said">Port Said (بورسعيد)</option>
                    <option value="Suez">Suez (السويس)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="01012345678"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a] focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={saveThisAddress}
                    onChange={(e) => setSaveThisAddress(e.target.checked)}
                    className="accent-[#0aad0a] rounded"
                  />
                  <span>Save this address for future orders</span>
                </label>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash On Delivery Option */}
                <label
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[#0aad0a] bg-emerald-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="accent-[#0aad0a] mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                      <Banknote className="w-5 h-5 text-[#0aad0a]" />
                      <span>Cash on Delivery</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Pay with cash when your items arrive at your doorstep.
                    </p>
                  </div>
                </label>

                {/* Online Payment Option */}
                <label
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-[#0aad0a] bg-emerald-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="accent-[#0aad0a] mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <span>Online Payment (Stripe)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Pay securely with Visa, MasterCard, or online cards via Stripe.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Review Order Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Order Review ({numOfCartItems} items)
              </h3>

              {/* Items mini list */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-6">
                {cart.products.map((item) => (
                  <div key={item._id} className="flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.product?.imageCover}
                        alt=""
                        className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100 shrink-0 p-1"
                      />
                      <span className="truncate font-medium text-gray-700">
                        {item.product?.title}
                      </span>
                    </div>
                    <span className="shrink-0 font-bold text-gray-900">
                      {item.count} × {item.price} EGP
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pb-6 border-b border-gray-100 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{totalCartPrice} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 mb-6">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-[#0aad0a]">
                  {totalCartPrice} <span className="text-xs font-normal text-gray-700">EGP</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#0aad0a] hover:bg-[#088a08] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'cash' ? 'Confirm Cash Order' : 'Proceed to Stripe Pay'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Protected by Route FreshCart Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
