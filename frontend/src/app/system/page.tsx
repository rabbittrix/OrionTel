'use client';

import { Settings, Server, Activity, Database, Shield, Clock, RefreshCw, Power, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

type ViewType = 'security' | 'updates' | 'restart' | 'backup';
type ScanStatus = 'idle' | 'scanning' | 'completed' | 'error';

interface SecurityResult {
  type: string;
  status: 'safe' | 'warning' | 'critical';
  message: string;
}

interface UpdateInfo {
  component: string;
  version: string;
  status: 'available' | 'up-to-date' | 'error';
  size?: string;
}

export default function SystemPage() {
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

  const [currentView, setCurrentView] = useState<ViewType>('security');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [securityResults, setSecurityResults] = useState<SecurityResult[]>([
    { type: 'Firewall', status: 'safe', message: 'Firewall is active and properly configured' },
    { type: 'Ports', status: 'warning', message: 'Unused ports detected: 8080, 8443' },
    { type: 'Updates', status: 'safe', message: 'All security patches are up to date' },
    { type: 'Access', status: 'critical', message: 'Multiple failed login attempts detected' },
  ]);

  const [updateResults, setUpdateResults] = useState<UpdateInfo[]>([
    { component: 'Core System', version: '2.3.1', status: 'up-to-date' },
    { component: 'Security Module', version: '1.5.0', status: 'available', size: '45 MB' },
    { component: 'Database', version: '3.1.2', status: 'up-to-date' },
    { component: 'Web Interface', version: '2.0.0', status: 'available', size: '12 MB' },
  ]);

  const [restartStatus, setRestartStatus] = useState<'idle' | 'pending' | 'restarting'>('idle');
  const [restartCountdown, setRestartCountdown] = useState(60);

  const [backupStatus, setBackupStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [backupProgress, setBackupProgress] = useState(0);

  const handleStartScan = () => {
    setScanStatus('scanning');
    // Simulate scan completion after 3 seconds
    setTimeout(() => {
      setScanStatus('completed');
    }, 3000);
  };

  const handleCheckUpdates = () => {
    // Simulate update check
    setUpdateResults(prev => prev.map(update => ({
      ...update,
      status: Math.random() > 0.5 ? 'available' : 'up-to-date'
    })));
  };

  const handleRestart = () => {
    setRestartStatus('pending');
    setRestartCountdown(60);
    // Simulate countdown
    const interval = setInterval(() => {
      setRestartCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRestartStatus('restarting');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBackup = () => {
    setBackupStatus('running');
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupStatus('completed');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
      case 'up-to-date':
        return 'text-green-500';
      case 'warning':
      case 'available':
        return 'text-yellow-500';
      case 'critical':
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
      case 'up-to-date':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
      case 'available':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getButtonStyles = (button: { view: string }) => {
    if (currentView === button.view) {
      switch (button.view) {
        case 'security':
          return 'text-orange-600 bg-orange-50 border-orange-200';
        case 'updates':
          return 'text-green-600 bg-green-50 border-green-200';
        case 'restart':
          return 'text-red-600 bg-red-50 border-red-200';
        case 'backup':
          return 'text-blue-600 bg-blue-50 border-blue-200';
        default:
          return 'text-blue-600 bg-blue-50 border-blue-200';
      }
    }

    switch (button.view) {
      case 'security':
        return 'text-gray-500 hover:text-orange-700 hover:bg-orange-50 hover:border-orange-200 border-gray-200';
      case 'updates':
        return 'text-gray-500 hover:text-green-700 hover:bg-green-50 hover:border-green-200 border-gray-200';
      case 'restart':
        return 'text-gray-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-gray-200';
      case 'backup':
        return 'text-gray-500 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 border-gray-200';
      default:
        return 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-200 border-gray-200';
    }
  };

  const actionButtons = [
    {
      name: 'System Backup',
      icon: <Database className="h-4 w-4" />,
      view: 'backup',
      onClick: () => setCurrentView('backup'),
    },
    {
      name: 'Security Scan',
      icon: <Shield className="h-4 w-4" />,
      view: 'security',
      onClick: () => setCurrentView('security'),
    },
    {
      name: 'Update Check',
      icon: <RefreshCw className="h-4 w-4" />,
      view: 'updates',
      onClick: () => setCurrentView('updates'),
    },
    {
      name: 'Service Restart',
      icon: <Power className="h-4 w-4" />,
      view: 'restart',
      onClick: () => setCurrentView('restart'),
    },
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">System Overview</h1>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>System Uptime: {systemInfo.uptime}</span>
            </div>
            <span>Version: {systemInfo.version}</span>
          </div>
        </div>
        <div className="border-t p-4">
          <div className="flex gap-4">
            {actionButtons.map((button) => (
              <button
                key={button.name}
                onClick={button.onClick}
                className={`flex-1 px-6 py-3 rounded-md text-sm font-medium border ${getButtonStyles(button)}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {button.icon}
                  <span>{button.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
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

      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">System Management</h1>
        </div>

        {currentView === 'security' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Security Scan</h2>
              <button
                onClick={handleStartScan}
                disabled={scanStatus === 'scanning'}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  scanStatus === 'scanning'
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Shield className="h-5 w-5" />
                <span>{scanStatus === 'scanning' ? 'Scanning...' : 'Start Scan'}</span>
              </button>
            </div>
            <div className="space-y-4">
              {securityResults.map((result, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  {getStatusIcon(result.status)}
                  <div>
                    <h3 className="font-medium">{result.type}</h3>
                    <p className={`text-sm ${getStatusColor(result.status)}`}>{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'updates' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">System Updates</h2>
              <button
                onClick={handleCheckUpdates}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Check for Updates</span>
              </button>
            </div>
            <div className="space-y-4">
              {updateResults.map((update, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(update.status)}
                    <div>
                      <h3 className="font-medium">{update.component}</h3>
                      <p className="text-sm text-gray-500">Version: {update.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {update.size && <span className="text-sm text-gray-500">{update.size}</span>}
                    <span className={`text-sm font-medium ${getStatusColor(update.status)}`}>
                      {update.status === 'available' ? 'Update Available' : 'Up to Date'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'restart' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Service Restart</h2>
              {restartStatus === 'idle' && (
                <button
                  onClick={handleRestart}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Power className="h-5 w-5" />
                  <span>Restart Services</span>
                </button>
              )}
            </div>
            {restartStatus === 'pending' && (
              <div className="text-center p-8">
                <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  System restart scheduled
                </h3>
                <p className="text-gray-500 mb-4">
                  All services will be restarted in {restartCountdown} seconds
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-yellow-500 rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${(restartCountdown / 60) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => setRestartStatus('idle')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel Restart
                </button>
              </div>
            )}
            {restartStatus === 'restarting' && (
              <div className="text-center p-8">
                <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Restarting services...
                </h3>
                <p className="text-gray-500">
                  This process may take a few minutes. Please do not close the browser.
                </p>
              </div>
            )}
            {restartStatus === 'idle' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Before restarting:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Save any pending changes</li>
                    <li>Close active calls</li>
                    <li>Notify connected users</li>
                    <li>Backup current configuration</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-800 mb-1">Warning</h3>
                      <p className="text-yellow-600">
                        Restarting services will temporarily disconnect all active sessions and calls.
                        The process typically takes 2-3 minutes to complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'backup' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">System Backup</h2>
              {backupStatus === 'idle' && (
                <button
                  onClick={handleBackup}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Database className="h-5 w-5" />
                  <span>Start Backup</span>
                </button>
              )}
            </div>
            {backupStatus === 'running' && (
              <div className="text-center p-8">
                <Database className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  System backup in progress
                </h3>
                <p className="text-gray-500 mb-4">
                  Backing up system files and configurations: {backupProgress}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${backupProgress}%` }}
                  />
                </div>
              </div>
            )}
            {backupStatus === 'completed' && (
              <div className="text-center p-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Backup completed successfully
                </h3>
                <p className="text-gray-500">
                  All system files and configurations have been backed up.
                </p>
                <button
                  onClick={() => setBackupStatus('idle')}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                >
                  Start New Backup
                </button>
              </div>
            )}
            {backupStatus === 'idle' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Last Backup Information:</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Date: {systemInfo.lastBackup}</p>
                    <p>Size: 2.3 GB</p>
                    <p>Type: Full System Backup</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Backup Information</h3>
                      <p className="text-blue-600">
                        The backup process will create a complete copy of all system configurations,
                        databases, and user data. This process may take several minutes to complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 