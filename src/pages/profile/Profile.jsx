import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Plus,
  KeyRound,
  Check,
  ShieldCheck,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // New Address form modal/toggle
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: 'Home',
    details: '',
    phone: '',
    city: 'Cairo',
  });
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get(ENDPOINTS.ADDRESSES);
      if (res.data.data) {
        setAddresses(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    const res = await updateProfile(profileData.name, profileData.email, profileData.phone);
    setUpdatingProfile(false);

    if (res.success) {
      toast.success('Profile details updated successfully!');
    } else {
      toast.error(res.message || 'Failed to update profile.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.details || !newAddress.phone || !newAddress.city) {
      toast.error('Please fill in all address fields.');
      return;
    }
    setAddingAddress(true);
    try {
      const res = await axiosInstance.post(ENDPOINTS.ADDRESSES, newAddress);
      if (res.data.status === 'success') {
        toast.success('Address added successfully!');
        setNewAddress({ name: 'Home', details: '', phone: '', city: 'Cairo' });
        setShowAddressForm(false);
        fetchAddresses();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address.');
    } finally {
      setAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await axiosInstance.delete(ENDPOINTS.ADDRESS_ITEM(addressId));
      if (res.data.status === 'success') {
        toast.success('Address removed.');
        setAddresses(addresses.filter((a) => a._id !== addressId));
      }
    } catch (err) {
      toast.error('Failed to delete address.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="pb-6 mb-8 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          My Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your personal details and delivery addresses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Personal Info Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#0aad0a] flex items-center justify-center font-bold text-xl uppercase">
                {profileData.name ? profileData.name.charAt(0) : 'U'}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-base">{profileData.name || 'User'}</h2>
                <p className="text-xs text-gray-500">{profileData.email}</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a]"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="01012345678"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0aad0a]"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full py-3 px-4 bg-[#0aad0a] hover:bg-[#088a08] text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {updatingProfile ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                to="/change-password"
                className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#0aad0a] p-3 rounded-xl border border-gray-200 hover:border-[#0aad0a] transition-all"
              >
                <KeyRound className="w-4 h-4" /> Change Password
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: Addresses Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0aad0a]" /> Saved Delivery Addresses
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Keep your favorite shipping locations for one-click checkout.
                </p>
              </div>

              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0aad0a] hover:bg-[#088a08] px-3.5 py-2 rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Address
              </button>
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mb-6 p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <h3 className="font-bold text-sm text-gray-900 mb-2">New Address Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                      Label / Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      placeholder="Home, Office, etc."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0aad0a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      placeholder="Cairo"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0aad0a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                    Street & Details
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.details}
                    onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
                    placeholder="12 El-Nile St, Building 5"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    placeholder="01012345678"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingAddress}
                    className="px-4 py-2 bg-[#0aad0a] text-white rounded-xl text-xs font-semibold"
                  >
                    {addingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            )}

            {/* Addresses List */}
            {loadingAddresses ? (
              <LoadingSpinner fullPage={false} message="Loading addresses..." />
            ) : addresses.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No saved addresses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-900">{addr.name || 'Address'}</span>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{addr.details}</p>
                      <p className="text-xs font-medium text-gray-500 mt-2">
                        {addr.city} • {addr.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
