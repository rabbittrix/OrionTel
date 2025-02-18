'use client';

import { FileText, Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';

export default function LogsPage() {
  const [selectedLogType, setSelectedLogType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const logTypes = [
    { id: 'all', name: 'All Logs' },
    { id: 'system', name: 'System' },
    { id: 'security', name: 'Security' },
    { id: 'application', name: 'Application' },
    { id: 'network', name: 'Network' },
  ];

  const logEntries = [
    {
      id: 1,
      timestamp: '2024-03-20 10:30:45',
      type: 'system',
      level: 'info',
      source: 'System Service',
      message: 'System backup completed successfully',
    },
    {
      id: 2,
      timestamp: '2024-03-20 10:29:30',
      type: 'security',
      level: 'warning',
      source: 'Authentication Service',
      message: 'Failed login attempt from IP 192.168.1.100',
    },
    {
      id: 3,
      timestamp: '2024-03-20 10:28:15',
      type: 'application',
      level: 'error',
      source: 'Web Server',
      message: 'Database connection timeout',
    },
    {
      id: 4,
      timestamp: '2024-03-20 10:27:00',
      type: 'network',
      level: 'info',
      source: 'Network Manager',
      message: 'New device connected to network: Device ID MAC-123456',
    },
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredLogs = logEntries
    .filter((log) => selectedLogType === 'all' || log.type === selectedLogType)
    .filter(
      (log) =>
        searchQuery === '' ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">System Logs</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            title="Download Logs"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedLogType}
              onChange={(e) => setSelectedLogType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {logTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getLevelIcon(log.level)}
                      <span className="ml-2 text-sm capitalize">{log.level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.source}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 