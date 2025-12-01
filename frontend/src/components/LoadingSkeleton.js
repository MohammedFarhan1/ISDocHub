import React from 'react';

const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-xl shadow-sm border p-4 sm:p-6 animate-fadeInUp stagger-${Math.min(index + 1, 5)}`}
        >
          <div className="flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 bg-gray-200 rounded-lg mx-auto mb-3 sm:mb-4 skeleton"></div>
          
          <div className="space-y-2 mb-3 sm:mb-4">
            <div className="h-4 bg-gray-200 rounded skeleton"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto skeleton"></div>
          </div>
          
          <div className="space-y-1 mb-3 sm:mb-4">
            <div className="h-3 bg-gray-200 rounded skeleton"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 skeleton"></div>
          </div>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-gray-200 rounded skeleton"></div>
              <div className="flex-1 h-8 bg-gray-200 rounded skeleton"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded skeleton"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;