import React from 'react';


export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        {/* Icon in Middle */}
        <span className="absolute text-2xl">👾</span>
      </div>
    </div>
  );
}
