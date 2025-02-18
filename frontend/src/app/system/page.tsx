'use client';

import { Settings, Server, Activity, Database, Shield, Clock, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function SistemaPage() {
  const [systemInfo] = useState({
    uptime: '15 days, 7 hours, 23 minutes',
    version: '2.3.0',
    lastBackup: '2024-02-18 02:00 AM',
    diskSpace: {
      total: '500 GB',
      used: '125 GB',
      free: '375 GB',
      percentage: 25,
    },
    services: [
      { name: 'Asterisk PBX', status: 'running', memory: '256 MB', cpu: '2.5%' },
      { name: 'Database', status: 'running', memory: '512 MB', cpu: '4.2%' },
      { name: 'Web Server', status: 'running', memory: '128 MB', cpu: '1.8%' },
      { name: 'Mail Server', status: 'running', memory: '256 MB', cpu: '3.1%' },
    ],
    security: {
      lastUpdate: '2024-02-15',
      firewallStatus: 'active',
      activeConnections: 45,
      blockedIPs: 12,
    },
    performance: {
      cpuLoad: 35,
      memoryUsage: 60,
      activeCalls: 23,
      networkLoad: 42,
    },
  });

  const quickActions = [
    { name: 'System Backup', icon: Database, color: 'blue' },
    { name: 'Security Scan', icon: Shield, color: 'green' },
    { name: 'Update Check', icon: RefreshCw, color: 'purple' },
    { name: 'Service Restart', icon: Activity, color: 'red' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">System Overview</h1>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">System Uptime: {systemInfo.uptime}</span>
          <span className="text-sm text-gray-500">Version: {systemInfo.version}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.name}
            className={`p-4 bg-${action.color}-50 rounded-lg border border-${action.color}-200 hover:bg-${action.color}-100 transition-colors`}
          >
            <div className="flex items-center space-x-3">
              <action.icon className={`h-5 w-5 text-${action.color}-600`} />
              <span className={`text-${action.color}-700 font-medium`}>{action.name}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">System Performance</h2>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(systemInfo.performance).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm text-gray-500">{value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Security Status</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Last Update</div>
              <div className="font-medium">{systemInfo.security.lastUpdate}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Firewall Status</div>
              <div className="font-medium capitalize">{systemInfo.security.firewallStatus}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Active Connections</div>
              <div className="font-medium">{systemInfo.security.activeConnections}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Blocked IPs</div>
              <div className="font-medium">{systemInfo.security.blockedIPs}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Active Services</h2>
            </div>
          </div>
          <div className="space-y-4">
            {systemInfo.services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-500">
                    Memory: {service.memory} | CPU: {service.cpu}
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">System Status</h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Disk Usage</div>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {systemInfo.diskSpace.used} of {systemInfo.diskSpace.total}
                  </span>
                  <span className="text-sm text-gray-500">{systemInfo.diskSpace.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{ width: `${systemInfo.diskSpace.percentage}%` }}
                  />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Free Space: {systemInfo.diskSpace.free}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Last Backup</div>
              <div className="font-medium">{systemInfo.lastBackup}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 