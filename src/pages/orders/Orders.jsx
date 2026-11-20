import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Package,
  Calendar,
  CreditCard,
  Banknote,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Truck
} from 'lucide-react';

export default function Orders() {
  const { userId, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const currentUserId = userId || user?.id || user?._id;
      if (!currentUserId) {
        setLoading(false);
        return;
      }
      try {
        const res = await axiosInstance.get(ENDPOINTS.USER_ORDERS(currentUserId));
        if (Array.isArray(res.data)) {
          setOrders(res.data.reverse());
        } else if (res.data.data) {
          setOrders(res.data.data.reverse());
        }
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [userId, user]);

  if (loading) {
    return <LoadingSpinner fullPage={true} message="Loading your order history..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Orders Placed Yet</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm">
          You haven't made any purchases yet. Your past orders will show up here.
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
      {/* Title */}
      <div className="pb-6 mb-8 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track and view details of your previous orders ({orders.length} orders found).
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const isPaid = order.isPaid;
          const isDelivered = order.isDelivered;
          const isCash = order.paymentMethodType === 'cash';

          return (
            <div
              key={order._id || order.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Order Top Meta */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-extrabold text-gray-900">
                      Order #{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {order.shippingAddress && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>
                        {order.shippingAddress.details}, {order.shippingAddress.city} • Phone:{' '}
                        {order.shippingAddress.phone}
                      </span>
                    </p>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Payment status badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isCash
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    {isCash ? (
                      <Banknote className="w-3.5 h-3.5" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    {isPaid ? 'Paid' : isCash ? 'Cash on Delivery' : 'Not Paid'}
                  </span>

                  {/* Delivery status badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                      isDelivered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {isDelivered ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                    {isDelivered ? 'Delivered' : 'In Processing'}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="py-6 divide-y divide-gray-100">
                {order.cartItems?.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <div
                      key={item._id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Link
                          to={`/products/${product._id}`}
                          className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-1.5 shrink-0 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={product.imageCover}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            to={`/products/${product._id}`}
                            className="font-semibold text-sm text-gray-800 hover:text-[#0aad0a] transition-colors line-clamp-1"
                          >
                            {product.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Quantity: <span className="font-semibold text-gray-700">{item.count}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-gray-900">
                          {item.price} EGP
                        </span>
                        <p className="text-[11px] text-gray-400">per unit</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Footer Total */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Total Order Amount</span>
                <span className="text-xl font-extrabold text-[#0aad0a]">
                  {order.totalOrderPrice} <span className="text-xs font-normal text-gray-700">EGP</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
