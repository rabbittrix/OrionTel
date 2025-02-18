'use client';

import { Settings, Save } from 'lucide-react';
import { useState } from 'react';

interface Setting {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'number';
  value: boolean | string | number;
  options?: string[];
}

interface Category {
  name: string;
  settings: Setting[];
}

export default function AdvancedSettingsPage() {
  const [settingCategories, setSettingCategories] = useState<Category[]>([
    {
      name: 'System',
      settings: [
        { id: 'debug_mode', label: 'Debug Mode', type: 'toggle', value: false },
        { id: 'log_level', label: 'Log Level', type: 'select', value: 'info', options: ['debug', 'info', 'warn', 'error'] },
        { id: 'backup_retention', label: 'Backup Retention (days)', type: 'number', value: 30 },
      ],
    },
    {
      name: 'Network',
      settings: [
        { id: 'sip_port', label: 'SIP Port', type: 'number', value: 5060 },
        { id: 'rtp_port_start', label: 'RTP Port Range Start', type: 'number', value: 10000 },
        { id: 'rtp_port_end', label: 'RTP Port Range End', type: 'number', value: 20000 },
      ],
    },
    {
      name: 'Security',
      settings: [
        { id: 'fail2ban_enabled', label: 'Enable Fail2Ban', type: 'toggle', value: true },
        { id: 'max_login_attempts', label: 'Max Login Attempts', type: 'number', value: 5 },
        { id: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', value: 60 },
      ],
    },
  ]);

  const handleSettingChange = (categoryIndex: number, settingIndex: number, newValue: boolean | string | number) => {
    const newCategories = [...settingCategories];
    newCategories[categoryIndex].settings[settingIndex].value = newValue;
    setSettingCategories(newCategories);
  };

  const handleSave = () => {
    // Here you would typically send the settings to your backend
    console.log('Saving settings:', settingCategories);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Advanced Settings</h1>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-6">
        {settingCategories.map((category, categoryIndex) => (
          <div key={category.name} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{category.name}</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6">
                {category.settings.map((setting, settingIndex) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <label htmlFor={setting.id} className="text-sm font-medium text-gray-700">
                      {setting.label}
                    </label>
                    {setting.type === 'toggle' && (
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id={setting.id}
                          checked={setting.value as boolean}
                          onChange={(e) => handleSettingChange(categoryIndex, settingIndex, e.target.checked)}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                          htmlFor={setting.id}
                          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                            setting.value ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      </div>
                    )}
                    {setting.type === 'select' && (
                      <select
                        id={setting.id}
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(categoryIndex, settingIndex, e.target.value)}
                        className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        {setting.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    {setting.type === 'number' && (
                      <input
                        type="number"
                        id={setting.id}
                        value={setting.value as number}
                        onChange={(e) => handleSettingChange(categoryIndex, settingIndex, Number(e.target.value))}
                        className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 