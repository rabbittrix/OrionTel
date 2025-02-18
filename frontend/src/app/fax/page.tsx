'use client';

import { Phone, Upload, Download, Search, Filter, Trash2, Archive, RefreshCw, Plus } from 'lucide-react';
import { useState } from 'react';

export default function FaxPage() {
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [selectedFax, setSelectedFax] = useState<number | null>(null);

  const faxes = [
    {
      id: 1,
      type: 'received',
      from: '+1 (555) 123-4567',
      to: 'Local Office',
      date: '2024-03-20 10:30:45',
      pages: 3,
      status: 'received',
      quality: 'high',
      preview: 'Contract Document',
      priority: 'high',
    },
    {
      id: 2,
      type: 'sent',
      from: 'Local Office',
      to: '+1 (555) 987-6543',
      date: '2024-03-20 09:15:30',
      pages: 2,
      status: 'sent',
      quality: 'medium',
      preview: 'Invoice #12345',
      priority: 'normal',
    },
    {
      id: 3,
      type: 'queued',
      from: 'Local Office',
      to: '+1 (555) 246-8135',
      date: '2024-03-20 11:00:00',
      pages: 1,
      status: 'pending',
      quality: 'high',
      preview: 'Meeting Schedule',
      priority: 'low',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'normal':
        return 'text-blue-500';
      case 'low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Phone className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Fax Management</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span>Send New Fax</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex space-x-6 p-4">
            <button
              onClick={() => setSelectedTab('inbox')}
              className={`pb-3 border-b-2 ${
                selectedTab === 'inbox'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Inbox
            </button>
            <button
              onClick={() => setSelectedTab('sent')}
              className={`pb-3 border-b-2 ${
                selectedTab === 'sent'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => setSelectedTab('queued')}
              className={`pb-3 border-b-2 ${
                selectedTab === 'queued'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Queue
            </button>
          </div>
        </div>

        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search faxes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Status</option>
                <option value="received">Received</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full" title="Archive">
              <Archive className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="divide-y">
          {faxes
            .filter((fax) => fax.type === selectedTab)
            .map((fax) => (
              <div
                key={fax.id}
                onClick={() => setSelectedFax(fax.id)}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedFax === fax.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{fax.preview}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fax.status)}`}>
                        {fax.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {fax.type === 'received' ? 'From:' : 'To:'} {fax.type === 'received' ? fax.from : fax.to}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{fax.date}</div>
                      <div className="text-sm text-gray-500">{fax.pages} pages</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Quality: {fax.quality}</span>
                  <span className={`${getPriorityColor(fax.priority)}`}>
                    Priority: {fax.priority}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 