import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-[#0aad0a] animate-spin mb-4" />
        <p className="text-gray-600 font-medium text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="w-6 h-6 text-[#0aad0a] animate-spin" />
    </div>
  );
}
