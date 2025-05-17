import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;