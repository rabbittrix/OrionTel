'use client';

import { Phone, Save, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface FormData {
  type: 'extension' | 'trunk' | 'ring-group';
  number?: string;
  name: string;
  provider?: string;
  members?: string;
  strategy?: 'ring-all' | 'round-robin' | 'least-recent';
  sipType?: 'SIP' | 'IAX2';
  status: 'registered' | 'offline' | 'active' | 'standby';
}

export default function PBXConfigurationPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: 'extension',
    name: '',
    number: '',
    status: 'offline',
    sipType: 'SIP',
  });

  const sections = [
    {
      title: 'Extensions',
      items: [
        { number: '1001', name: 'Reception', type: 'SIP', status: 'registered' },
        { number: '1002', name: 'Sales', type: 'SIP', status: 'offline' },
        { number: '1003', name: 'Support', type: 'SIP', status: 'registered' },
      ],
    },
    {
      title: 'Trunks',
      items: [
        { name: 'Main SIP Trunk', provider: 'VoIP Provider', type: 'SIP', status: 'active' },
        { name: 'Backup Trunk', provider: 'Alternate Provider', type: 'IAX2', status: 'standby' },
      ],
    },
    {
      title: 'Ring Groups',
      items: [
        { number: '600', name: 'Sales Team', members: '1001,1002', strategy: 'ring-all' },
        { number: '601', name: 'Support Team', members: '1002,1003', strategy: 'round-robin' },
      ],
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    setShowAddModal(false);
    setFormData({
      type: 'extension',
      name: '',
      number: '',
      status: 'offline',
      sipType: 'SIP',
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Phone className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">PBX Configuration</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{section.title}</h2>
            </div>
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {Object.keys(section.items[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {section.items.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {value === 'registered' || value === 'active' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {value}
                            </span>
                          ) : value === 'offline' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {value}
                            </span>
                          ) : value === 'standby' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {value}
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Configuration</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuration Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="extension">Extension</option>
                  <option value="trunk">Trunk</option>
                  <option value="ring-group">Ring Group</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {(formData.type === 'extension' || formData.type === 'ring-group') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {formData.type === 'trunk' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider
                  </label>
                  <input
                    type="text"
                    name="provider"
                    value={formData.provider || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {formData.type === 'ring-group' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Members (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="members"
                      value={formData.members || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., 1001,1002,1003"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ring Strategy
                    </label>
                    <select
                      name="strategy"
                      value={formData.strategy || 'ring-all'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="ring-all">Ring All</option>
                      <option value="round-robin">Round Robin</option>
                      <option value="least-recent">Least Recent</option>
                    </select>
                  </div>
                </>
              )}

              {(formData.type === 'extension' || formData.type === 'trunk') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="sipType"
                    value={formData.sipType || 'SIP'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="SIP">SIP</option>
                    <option value="IAX2">IAX2</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {formData.type === 'trunk' ? (
                    <>
                      <option value="active">Active</option>
                      <option value="standby">Standby</option>
                    </>
                  ) : (
                    <>
                      <option value="registered">Registered</option>
                      <option value="offline">Offline</option>
                    </>
                  )}
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
                  Add Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 