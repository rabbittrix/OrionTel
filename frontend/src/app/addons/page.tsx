'use client';

import { PlusCircle, Download, Trash2, RefreshCw } from 'lucide-react';

export default function AddonsPage() {
  const addons = [
    {
      name: 'Call Recording Pro',
      version: '2.1.0',
      status: 'installed',
      description: 'Advanced call recording and management system',
      author: 'OrionTel',
    },
    {
      name: 'Queue Statistics',
      version: '1.5.2',
      status: 'available',
      description: 'Detailed queue analytics and reporting',
      author: 'OrionTel',
    },
    {
      name: 'SIP Security Suite',
      version: '3.0.1',
      status: 'installed',
      description: 'Enhanced security features for SIP trunks',
      author: 'OrionTel',
    },
    {
      name: 'Advanced IVR',
      version: '2.3.0',
      status: 'available',
      description: 'Visual IVR builder with advanced features',
      author: 'OrionTel',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <PlusCircle className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Add-ons Manager</h1>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
          <RefreshCw className="h-4 w-4" />
          <span>Check for Updates</span>
        </button>
      </div>

      <div className="grid gap-6">
        {addons.map((addon, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{addon.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{addon.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-600">Version: {addon.version}</span>
                  <span className="text-sm text-gray-600">By: {addon.author}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {addon.status === 'available' ? (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Download className="h-4 w-4" />
                    <span>Install</span>
                  </button>
                ) : (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                    <Trash2 className="h-4 w-4" />
                    <span>Uninstall</span>
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${addon.status === 'installed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm capitalize">{addon.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 