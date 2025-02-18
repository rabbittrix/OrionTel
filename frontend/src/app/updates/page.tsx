'use client';

import { Download, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function UpdatesPage() {
  const updates = [
    {
      id: 1,
      name: 'Security Update 2024.02',
      type: 'security',
      version: '1.2.3',
      size: '45 MB',
      status: 'pending',
      description: 'Critical security patches for core system components',
      releaseDate: '2024-02-15',
    },
    {
      id: 2,
      name: 'PBX Core Update',
      type: 'feature',
      version: '2.1.0',
      size: '120 MB',
      status: 'downloading',
      description: 'New features and improvements for PBX system',
      releaseDate: '2024-02-10',
      progress: 65,
    },
    {
      id: 3,
      name: 'System Maintenance Update',
      type: 'maintenance',
      version: '1.0.5',
      size: '25 MB',
      status: 'installed',
      description: 'Regular system maintenance and optimizations',
      releaseDate: '2024-02-01',
      installedDate: '2024-02-02',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'downloading':
        return 'bg-blue-100 text-blue-800';
      case 'installed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'feature':
        return <Download className="h-5 w-5 text-blue-500" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Download className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">System Updates</h1>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <RefreshCw className="h-4 w-4" />
          <span>Check for Updates</span>
        </button>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getTypeIcon(update.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-semibold">{update.name}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                        {update.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{update.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">Version: {update.version}</span>
                      <span className="text-sm text-gray-600">Size: {update.size}</span>
                      <span className="text-sm text-gray-600">Released: {update.releaseDate}</span>
                    </div>
                  </div>
                </div>
                {update.status === 'pending' && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Download className="h-4 w-4" />
                    <span>Install</span>
                  </button>
                )}
              </div>
              {update.status === 'downloading' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Downloading...</span>
                    <span>{update.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${update.progress}%` }}
                    />
                  </div>
                </div>
              )}
              {update.status === 'installed' && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Installed on {update.installedDate}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 