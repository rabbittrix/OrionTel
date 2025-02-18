'use client';

import { RefreshCw } from 'lucide-react';

const DiskUsage = () => {
  const diskInfo = {
    total: 143.37,
    used: 2.87,
    available: 140.5,
    mountPoint: '/',
    manufacturer: 'MAXTOR STM3143.5A',
    model: '71M',
  };

  const usedPercentage = (diskInfo.used / diskInfo.total) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dashArray = (usedPercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Discos Duros</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <RefreshCw className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="30"
            />
            {/* Usage circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#6366F1"
              strokeWidth="30"
              strokeDasharray={`${dashArray} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{usedPercentage.toFixed(1)}%</span>
            <span className="text-sm text-gray-500">Used</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Hard Disk Capacity:</span>
          <span className="font-medium">{diskInfo.total.toFixed(1)}GB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Mount Point:</span>
          <span className="font-medium">{diskInfo.mountPoint}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Manufacturer:</span>
          <span className="font-medium">{diskInfo.manufacturer}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Configuration:</span>
          <span className="font-medium">{diskInfo.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Local Backups:</span>
          <span className="font-medium">40K</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Emails:</span>
          <span className="font-medium">160K</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Voicemails:</span>
          <span className="font-medium">164K</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Recordings:</span>
          <span className="font-medium">8.0K</span>
        </div>
      </div>
    </div>
  );
};

export default DiskUsage; 