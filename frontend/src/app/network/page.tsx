'use client';

import { Network, RefreshCw, Edit, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface NetworkInterface {
  name: string;
  status: 'up' | 'down';
  ip: string;
  mask: string;
  gateway: string;
  mac: string;
  type: 'Ethernet' | 'Wireless';
}

export default function NetworkPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<NetworkInterface>({
    name: '',
    status: 'down',
    ip: '',
    mask: '',
    gateway: '',
    mac: '',
    type: 'Ethernet'
  });

  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([
    {
      name: 'eth0',
      status: 'up',
      ip: '192.168.1.100',
      mask: '255.255.255.0',
      gateway: '192.168.1.1',
      mac: '00:1A:2B:3C:4D:5E',
      type: 'Ethernet',
    },
    {
      name: 'wlan0',
      status: 'down',
      ip: '-',
      mask: '-',
      gateway: '-',
      mac: '00:1A:2B:3C:4D:5F',
      type: 'Wireless',
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Creating new interface:', formData);
    setInterfaces(prev => [...prev, formData]);
    setShowAddModal(false);
    // Reset form
    setFormData({
      name: '',
      status: 'down',
      ip: '',
      mask: '',
      gateway: '',
      mac: '',
      type: 'Ethernet'
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Network className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Network Configuration</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Interface</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {interfaces.map((iface) => (
          <div key={iface.name} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold">{iface.name}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  iface.status === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {iface.status}
                </span>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">IP Address</div>
                  <div className="font-medium">{iface.ip}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Subnet Mask</div>
                  <div className="font-medium">{iface.mask}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Gateway</div>
                  <div className="font-medium">{iface.gateway}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">MAC Address</div>
                  <div className="font-medium">{iface.mac}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-medium">{iface.type}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Network Interface</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interface Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., eth0, wlan0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ethernet">Ethernet</option>
                  <option value="Wireless">Wireless</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP Address
                </label>
                <input
                  type="text"
                  name="ip"
                  value={formData.ip}
                  onChange={handleInputChange}
                  placeholder="e.g., 192.168.1.100"
                  pattern="^(\d{1,3}\.){3}\d{1,3}$"
                  title="Please enter a valid IP address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subnet Mask
                </label>
                <input
                  type="text"
                  name="mask"
                  value={formData.mask}
                  onChange={handleInputChange}
                  placeholder="e.g., 255.255.255.0"
                  pattern="^(\d{1,3}\.){3}\d{1,3}$"
                  title="Please enter a valid subnet mask"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gateway
                </label>
                <input
                  type="text"
                  name="gateway"
                  value={formData.gateway}
                  onChange={handleInputChange}
                  placeholder="e.g., 192.168.1.1"
                  pattern="^(\d{1,3}\.){3}\d{1,3}$"
                  title="Please enter a valid gateway address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MAC Address
                </label>
                <input
                  type="text"
                  name="mac"
                  value={formData.mac}
                  onChange={handleInputChange}
                  placeholder="e.g., 00:1A:2B:3C:4D:5E"
                  pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
                  title="Please enter a valid MAC address (format: XX:XX:XX:XX:XX:XX)"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Interface
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 