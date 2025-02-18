'use client';

import { Power, RefreshCw, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ShutdownPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState<'shutdown' | 'restart' | null>(null);
  const [delay, setDelay] = useState(0);

  const handleAction = (type: 'shutdown' | 'restart') => {
    setAction(type);
    setShowConfirm(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Power className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">System Power Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Power Options</h2>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => handleAction('shutdown')}
              className="w-full flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
            >
              <div className="flex items-center space-x-3">
                <Power className="h-5 w-5" />
                <span className="font-medium">Shutdown System</span>
              </div>
              <span className="text-sm">Safely power off the system</span>
            </button>
            <button
              onClick={() => handleAction('restart')}
              className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5" />
                <span className="font-medium">Restart System</span>
              </div>
              <span className="text-sm">Reboot the system</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Schedule</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay (minutes)
              </label>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {action === 'shutdown' ? 'Shutdown' : 'Restart'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {action === 'shutdown' ? 'shutdown' : 'restart'} the system
              {delay > 0 ? ` in ${delay} minutes` : ' now'}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(`${action} with delay: ${delay} minutes`);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 