'use client';

import { BarChart, Search, Filter, Download, Calendar, Play, Pause, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface CallRecord {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  duration: string;
  type: 'internal' | 'external' | 'conference';
  status: 'completed' | 'missed' | 'failed';
  recording: {
    available: boolean;
    duration: string;
    size: string;
  };
  notes?: string;
}

export default function CallReportsPage() {
  const [dateRange, setDateRange] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const [calls] = useState<CallRecord[]>([
    {
      id: '1',
      from: '+1 (555) 123-4567',
      to: 'Extension 101',
      date: '2024-03-20',
      time: '10:30:45',
      duration: '00:05:23',
      type: 'external',
      status: 'completed',
      recording: {
        available: true,
        duration: '05:23',
        size: '2.5 MB',
      },
      notes: 'Customer inquiry about new service',
    },
    {
      id: '2',
      from: 'Extension 102',
      to: 'Extension 103',
      date: '2024-03-20',
      time: '09:15:30',
      duration: '00:02:45',
      type: 'internal',
      status: 'completed',
      recording: {
        available: true,
        duration: '02:45',
        size: '1.2 MB',
      },
    },
    {
      id: '3',
      from: '+44 20 7123 4567',
      to: 'Sales Queue',
      date: '2024-03-20',
      time: '08:45:15',
      duration: '00:00:00',
      type: 'external',
      status: 'missed',
      recording: {
        available: false,
        duration: '00:00',
        size: '0 MB',
      },
    },
  ]);

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || call.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || call.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlayRecording = (callId: string) => {
    if (currentlyPlaying === callId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(callId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Call Reports</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="conference">Conference</option>
              </select>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Call List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recording
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCalls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{call.date}</div>
                    <div>{call.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.from}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.to}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {call.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {call.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {call.recording.available ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePlayRecording(call.id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          {currentlyPlaying === call.id ? (
                            <Pause className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Play className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                        <span className="text-sm text-gray-500">
                          {call.recording.duration} ({call.recording.size})
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not available</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {call.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 