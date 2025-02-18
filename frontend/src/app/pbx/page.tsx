'use client';

import { Phone, Users, Activity, Settings, BarChart3, RefreshCw, PhoneCall, PhoneOff, VolumeX, X, Save } from 'lucide-react';
import { useState } from 'react';

interface PBXSettings {
  general: {
    systemName: string;
    defaultLanguage: string;
    timezone: string;
    maxCallDuration: number;
  };
  security: {
    failedLoginAttempts: number;
    passwordExpiration: number;
    enforceStrongPasswords: boolean;
    allowRemoteAccess: boolean;
  };
  audio: {
    codec: string;
    sampleRate: string;
    echoCancel: boolean;
    noiseReduction: boolean;
  };
  voicemail: {
    enabled: boolean;
    maxMessageLength: number;
    messageRetention: number;
    emailNotification: boolean;
  };
}

export default function PBXPage() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<PBXSettings>({
    general: {
      systemName: 'OrionTel PBX',
      defaultLanguage: 'en',
      timezone: 'UTC-3',
      maxCallDuration: 120,
    },
    security: {
      failedLoginAttempts: 3,
      passwordExpiration: 90,
      enforceStrongPasswords: true,
      allowRemoteAccess: false,
    },
    audio: {
      codec: 'G.711',
      sampleRate: '8kHz',
      echoCancel: true,
      noiseReduction: true,
    },
    voicemail: {
      enabled: true,
      maxMessageLength: 180,
      messageRetention: 30,
      emailNotification: true,
    },
  });

  const handleSettingChange = (
    category: keyof PBXSettings,
    setting: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    console.log('Saving settings:', settings);
    setShowSettings(false);
  };

  const systemStatus = {
    activeCalls: 12,
    totalExtensions: 50,
    activeExtensions: 45,
    queuedCalls: 3,
    uptime: '15 days, 7 hours',
    callsToday: 156,
  };

  const activeChannels = [
    {
      id: 1,
      type: 'SIP',
      from: 'Extension 101',
      to: 'Extension 102',
      duration: '00:05:23',
      status: 'active',
      quality: '98%',
    },
    {
      id: 2,
      type: 'IAX2',
      from: '+1 (555) 123-4567',
      to: 'Sales Queue',
      duration: '00:02:45',
      status: 'active',
      quality: '95%',
    },
    {
      id: 3,
      type: 'SIP',
      from: 'Extension 105',
      to: 'Conference Room 1',
      duration: '00:15:30',
      status: 'active',
      quality: '97%',
    },
  ];

  const queues = [
    {
      id: 1,
      name: 'Sales',
      agents: 5,
      activeAgents: 4,
      waitingCalls: 2,
      averageWaitTime: '00:01:30',
      strategy: 'Round Robin',
    },
    {
      id: 2,
      name: 'Support',
      agents: 8,
      activeAgents: 7,
      waitingCalls: 1,
      averageWaitTime: '00:00:45',
      strategy: 'Least Recent',
    },
    {
      id: 3,
      name: 'Technical',
      agents: 4,
      activeAgents: 4,
      waitingCalls: 0,
      averageWaitTime: '00:00:00',
      strategy: 'Ring All',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Phone className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">PBX System</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">System Status</h3>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Calls</span>
              <span className="font-medium">{systemStatus.activeCalls}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Extensions</span>
              <span className="font-medium">{systemStatus.activeExtensions}/{systemStatus.totalExtensions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Queued Calls</span>
              <span className="font-medium">{systemStatus.queuedCalls}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium">{systemStatus.uptime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Calls Today</span>
              <span className="font-medium">{systemStatus.callsToday}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Active Channels</h3>
            <div className="flex items-center space-x-2">
              <PhoneCall className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-500">{activeChannels.length} Active</span>
            </div>
          </div>
          <div className="space-y-4">
            {activeChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{channel.from} → {channel.to}</div>
                  <div className="text-sm text-gray-500">
                    {channel.type} | Duration: {channel.duration}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Quality: {channel.quality}</span>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-200 rounded-full">
                      <VolumeX className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded-full">
                      <PhoneOff className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Call Queues</h3>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-500">
                {queues.reduce((acc, queue) => acc + queue.activeAgents, 0)} Active Agents
              </span>
            </div>
          </div>
        </div>
        <div className="divide-y">
          {queues.map((queue) => (
            <div key={queue.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-medium">{queue.name}</h4>
                  <div className="mt-1 text-sm text-gray-500">Strategy: {queue.strategy}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Agents: {queue.activeAgents}/{queue.agents}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Waiting Calls: {queue.waitingCalls}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>Average Wait Time: {queue.averageWaitTime}</span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                    Manage Agents
                  </button>
                  <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100">
                    View Stats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">PBX Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
              {/* General Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      System Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.systemName}
                      onChange={(e) => handleSettingChange('general', 'systemName', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Language
                    </label>
                    <select
                      value={settings.general.defaultLanguage}
                      onChange={(e) => handleSettingChange('general', 'defaultLanguage', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="pt">Portuguese</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="UTC-3">UTC-3</option>
                      <option value="UTC-4">UTC-4</option>
                      <option value="UTC-5">UTC-5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Call Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.general.maxCallDuration}
                      onChange={(e) => handleSettingChange('general', 'maxCallDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Failed Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.security.failedLoginAttempts}
                      onChange={(e) => handleSettingChange('security', 'failedLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Expiration (days)
                    </label>
                    <input
                      type="number"
                      value={settings.security.passwordExpiration}
                      onChange={(e) => handleSettingChange('security', 'passwordExpiration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enforceStrongPasswords"
                      checked={settings.security.enforceStrongPasswords}
                      onChange={(e) => handleSettingChange('security', 'enforceStrongPasswords', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enforceStrongPasswords" className="text-sm font-medium text-gray-700">
                      Enforce Strong Passwords
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowRemoteAccess"
                      checked={settings.security.allowRemoteAccess}
                      onChange={(e) => handleSettingChange('security', 'allowRemoteAccess', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowRemoteAccess" className="text-sm font-medium text-gray-700">
                      Allow Remote Access
                    </label>
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Audio Settings</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Codec
                    </label>
                    <select
                      value={settings.audio.codec}
                      onChange={(e) => handleSettingChange('audio', 'codec', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="G.711">G.711</option>
                      <option value="G.722">G.722</option>
                      <option value="G.729">G.729</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sample Rate
                    </label>
                    <select
                      value={settings.audio.sampleRate}
                      onChange={(e) => handleSettingChange('audio', 'sampleRate', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="8kHz">8 kHz</option>
                      <option value="16kHz">16 kHz</option>
                      <option value="32kHz">32 kHz</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="echoCancel"
                      checked={settings.audio.echoCancel}
                      onChange={(e) => handleSettingChange('audio', 'echoCancel', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="echoCancel" className="text-sm font-medium text-gray-700">
                      Echo Cancellation
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="noiseReduction"
                      checked={settings.audio.noiseReduction}
                      onChange={(e) => handleSettingChange('audio', 'noiseReduction', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="noiseReduction" className="text-sm font-medium text-gray-700">
                      Noise Reduction
                    </label>
                  </div>
                </div>
              </div>

              {/* Voicemail Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Voicemail Settings</h3>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="voicemailEnabled"
                      checked={settings.voicemail.enabled}
                      onChange={(e) => handleSettingChange('voicemail', 'enabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="voicemailEnabled" className="text-sm font-medium text-gray-700">
                      Enable Voicemail
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Message Length (seconds)
                    </label>
                    <input
                      type="number"
                      value={settings.voicemail.maxMessageLength}
                      onChange={(e) => handleSettingChange('voicemail', 'maxMessageLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message Retention (days)
                    </label>
                    <input
                      type="number"
                      value={settings.voicemail.messageRetention}
                      onChange={(e) => handleSettingChange('voicemail', 'messageRetention', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailNotification"
                      checked={settings.voicemail.emailNotification}
                      onChange={(e) => handleSettingChange('voicemail', 'emailNotification', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailNotification" className="text-sm font-medium text-gray-700">
                      Email Notification
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 