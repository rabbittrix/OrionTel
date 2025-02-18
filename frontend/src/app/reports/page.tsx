'use client';

import {
  BarChart3,
  Download,
  Calendar,
  RefreshCw,
  Cpu,
  HardDrive,
  Network,
  Users,
  Activity,
  Clock,
} from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('24h');

  const performanceMetrics = {
    cpu: {
      current: 45,
      max: 78,
      average: 32,
    },
    memory: {
      current: 65,
      max: 89,
      average: 58,
    },
    disk: {
      current: 72,
      max: 95,
      average: 68,
    },
    network: {
      current: 28,
      max: 82,
      average: 45,
    },
  };

  const systemStats = [
    {
      id: 1,
      name: 'Active Users',
      value: '24',
      change: '+12%',
      icon: Users,
    },
    {
      id: 2,
      name: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      icon: Activity,
    },
    {
      id: 3,
      name: 'Response Time',
      value: '125ms',
      change: '-15ms',
      icon: Clock,
    },
    {
      id: 4,
      name: 'Network Traffic',
      value: '1.2 TB',
      change: '+8%',
      icon: Network,
    },
  ];

  const timeRanges = [
    { id: '24h', name: 'Last 24 Hours' },
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 90 Days' },
  ];

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return 'text-red-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">System Reports</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            title="Download Report"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {systemStats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{stat.name}</h3>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">System Performance</h2>
          <div className="space-y-6">
            <div className="flex items-center">
              <Cpu className="h-5 w-5 text-gray-400 mr-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">CPU Usage</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(performanceMetrics.cpu.current)}`}>
                    {performanceMetrics.cpu.current}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPerformanceColor(performanceMetrics.cpu.current)} bg-current`}
                    style={{ width: `${performanceMetrics.cpu.current}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <HardDrive className="h-5 w-5 text-gray-400 mr-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Disk Usage</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(performanceMetrics.disk.current)}`}>
                    {performanceMetrics.disk.current}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPerformanceColor(performanceMetrics.disk.current)} bg-current`}
                    style={{ width: `${performanceMetrics.disk.current}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Network className="h-5 w-5 text-gray-400 mr-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Network Usage</span>
                  <span
                    className={`text-sm font-medium ${getPerformanceColor(
                      performanceMetrics.network.current
                    )}`}
                  >
                    {performanceMetrics.network.current}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPerformanceColor(performanceMetrics.network.current)} bg-current`}
                    style={{ width: `${performanceMetrics.network.current}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Performance Summary</h2>
          <div className="space-y-6">
            {Object.entries(performanceMetrics).map(([key, metrics]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 capitalize">{key}</h4>
                  <div className="mt-1 flex items-center space-x-4">
                    <span className="text-xs text-gray-500">Max: {metrics.max}%</span>
                    <span className="text-xs text-gray-500">Avg: {metrics.average}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPerformanceColor(metrics.current)} bg-current`}
                      style={{ width: `${metrics.current}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getPerformanceColor(metrics.current)}`}>
                    {metrics.current}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 