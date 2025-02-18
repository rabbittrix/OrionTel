'use client';

import { Settings, Save, Globe, Bell, Moon, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      desktop: true,
      sounds: true,
    },
    timezone: 'UTC-3',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
  ];

  const timezones = [
    'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC',
    'UTC+1', 'UTC+2', 'UTC+3',
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: '31/12/2024' },
    { value: 'MM/DD/YYYY', label: '12/31/2024' },
    { value: 'YYYY-MM-DD', label: '2024-12-31' },
  ];

  const handleSave = () => {
    console.log('Saving preferences:', preferences);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">System Preferences</h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Localization</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {dateFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Format
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="24h"
                    checked={preferences.timeFormat === '24h'}
                    onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">24-hour</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="12h"
                    checked={preferences.timeFormat === '12h'}
                    onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">12-hour</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, email: e.target.checked }
                    })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      preferences.notifications.email ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                </div>
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Desktop Notifications</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.desktop}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, desktop: e.target.checked }
                    })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      preferences.notifications.desktop ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                </div>
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sound Notifications</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.sounds}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, sounds: e.target.checked }
                    })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      preferences.notifications.sounds ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Moon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                  className={`p-4 rounded-lg border-2 ${
                    preferences.theme === 'light'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">Light</div>
                </button>
                <button
                  onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                  className={`p-4 rounded-lg border-2 ${
                    preferences.theme === 'dark'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">Dark</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Volume2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Sound</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Volume
              </label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 