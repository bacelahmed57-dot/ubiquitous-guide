import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function VerifyResetCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyResetCode } = useAuth();
  const email = location.state?.email || '';

  const [resetCode, setResetCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!resetCode.trim()) {
      setErrorMsg('Please enter the verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyResetCode(resetCode.trim());
    setLoading(false);

    if (res.success && (res.data?.status === 'Success' || res.data?.status === 'success')) {
      toast.success('Code verified successfully!');
      navigate('/reset-password', { state: { email } });
    } else {
      const msg = res.message || 'Invalid or expired code.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-[#0aad0a] mb-4 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Reset Code</h1>
          <p className="text-sm text-gray-500 mt-1">
            {email ? (
              <>We've sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span></>
            ) : (
              'Please enter the 6-digit reset code you received.'
            )}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              6-Digit Reset Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="e.g. 535863"
              className="w-full text-center tracking-widest text-xl font-bold py-3.5 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0aad0a] focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#0aad0a] hover:bg-[#088a08] text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
          <Link
            to="/forgot-password"
            className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Resend
          </Link>
          <Link
            to="/login"
            className="font-semibold text-[#0aad0a] hover:text-[#088a08]"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
