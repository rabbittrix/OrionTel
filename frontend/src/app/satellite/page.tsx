'use client';

import { Satellite, Signal, Wifi, Settings, RefreshCw, Power, CloudRain, Thermometer, Wind, Compass } from 'lucide-react';
import { useState } from 'react';

interface SatelliteStats {
  signalStrength: number;
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  uptime: string;
  satellites: number;
  obstructions: number;
  temperature: number;
  weatherCondition: 'Clear' | 'Rain' | 'Snow' | 'Storm';
  orientation: {
    azimuth: number;
    elevation: number;
  };
}

export default function SatellitePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [stats] = useState<SatelliteStats>({
    signalStrength: 95,
    downloadSpeed: 150.5,
    uploadSpeed: 25.8,
    latency: 45,
    uptime: '15 days, 7 hours',
    satellites: 8,
    obstructions: 2,
    temperature: 38,
    weatherCondition: 'Clear',
    orientation: {
      azimuth: 180,
      elevation: 45,
    },
  });

  const [settings, setSettings] = useState({
    autoReconnect: true,
    powerSaveMode: false,
    priorityMode: 'balanced', // balanced, performance, efficiency
    obstructionDetection: true,
    weatherAdaptation: true,
  });

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getSignalQualityColor = (strength: number) => {
    if (strength >= 80) return 'text-green-500';
    if (strength >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Rain':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      default:
        return <CloudRain className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Satellite className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Satellite Connection</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Connection Status</h2>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                isOnline 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <Power className="h-4 w-4" />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Signal Strength</div>
              <div className="flex items-center space-x-2">
                <Signal className={`h-5 w-5 ${getSignalQualityColor(stats.signalStrength)}`} />
                <span className="font-medium">{stats.signalStrength}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Connected Satellites</div>
              <div className="font-medium">{stats.satellites}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Download Speed</div>
              <div className="font-medium">{stats.downloadSpeed} Mbps</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Upload Speed</div>
              <div className="font-medium">{stats.uploadSpeed} Mbps</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Latency</div>
              <div className="font-medium">{stats.latency} ms</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Uptime</div>
              <div className="font-medium">{stats.uptime}</div>
            </div>
          </div>
        </div>

        {/* Diagnostics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-6">System Diagnostics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-medium">Temperature</div>
                  <div className="text-sm text-gray-500">{stats.temperature}°C</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Wind className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Weather Condition</div>
                  <div className="text-sm text-gray-500">{stats.weatherCondition}</div>
                </div>
              </div>
              {getWeatherIcon(stats.weatherCondition)}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Compass className="h-5 w-5 text-indigo-500" />
                <div>
                  <div className="font-medium">Dish Orientation</div>
                  <div className="text-sm text-gray-500">
                    Azimuth: {stats.orientation.azimuth}° | Elevation: {stats.orientation.elevation}°
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-6">Connection Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto Reconnect</div>
                    <div className="text-sm text-gray-500">Automatically reconnect when connection is lost</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoReconnect}
                      onChange={(e) => handleSettingChange('autoReconnect', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Power Save Mode</div>
                    <div className="text-sm text-gray-500">Reduce power consumption during low usage</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.powerSaveMode}
                      onChange={(e) => handleSettingChange('powerSaveMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Mode
                  </label>
                  <select
                    value={settings.priorityMode}
                    onChange={(e) => handleSettingChange('priorityMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="performance">Performance</option>
                    <option value="efficiency">Efficiency</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Obstruction Detection</div>
                    <div className="text-sm text-gray-500">Monitor and report signal obstructions</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.obstructionDetection}
                      onChange={(e) => handleSettingChange('obstructionDetection', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 