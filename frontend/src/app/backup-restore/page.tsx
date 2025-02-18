'use client';

import { Database, Download, Upload, Trash2, RefreshCw, Calendar, HardDrive, Clock, X } from 'lucide-react';
import { useState } from 'react';

export default function BackupRestorePage() {
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showCreateBackup, setShowCreateBackup] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [backupForm, setBackupForm] = useState({
    name: '',
    description: '',
    type: 'full',
    items: {
      database: true,
      voicemail: true,
      recordings: true,
      configurations: true,
      callHistory: true,
      userSettings: true
    },
    retention: '7',
    schedule: 'none',
    scheduleTime: ''
  });

  const backups = [
    {
      id: 1,
      name: 'Daily Backup',
      date: '2024-03-20 02:00 AM',
      size: '2.5 GB',
      type: 'Automatic',
      status: 'completed',
      retention: '7 days',
      items: {
        database: true,
        voicemail: true,
        recordings: true,
        configurations: true,
      },
    },
    {
      id: 2,
      name: 'Pre-Update Backup',
      date: '2024-03-19 06:30 PM',
      size: '2.3 GB',
      type: 'Manual',
      status: 'completed',
      retention: '30 days',
      items: {
        database: true,
        voicemail: true,
        recordings: true,
        configurations: true,
      },
    },
    {
      id: 3,
      name: 'Weekly Backup',
      date: '2024-03-18 01:00 AM',
      size: '2.4 GB',
      type: 'Automatic',
      status: 'completed',
      retention: '30 days',
      items: {
        database: true,
        voicemail: true,
        recordings: true,
        configurations: true,
      },
    },
  ];

  const schedules = [
    {
      name: 'Daily Backup',
      frequency: 'Daily',
      time: '02:00 AM',
      retention: '7 days',
      lastRun: '2024-03-20 02:00 AM',
      nextRun: '2024-03-21 02:00 AM',
      status: 'active',
    },
    {
      name: 'Weekly Backup',
      frequency: 'Weekly',
      time: '01:00 AM',
      retention: '30 days',
      lastRun: '2024-03-18 01:00 AM',
      nextRun: '2024-03-25 01:00 AM',
      status: 'active',
    },
  ];

  const handleBackupInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBackupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (item: string) => {
    setBackupForm(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: !prev.items[item as keyof typeof prev.items]
      }
    }));
  };

  const handleCreateBackup = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the backup configuration to your backend
    console.log('Creating backup with settings:', backupForm);
    setShowCreateBackup(false);
    setBackupForm({
      name: '',
      description: '',
      type: 'full',
      items: {
        database: true,
        voicemail: true,
        recordings: true,
        configurations: true,
        callHistory: true,
        userSettings: true
      },
      retention: '7',
      schedule: 'none',
      scheduleTime: ''
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Backup & Restore</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setShowCreateBackup(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Database className="h-4 w-4" />
            <span>Create Backup</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Backup History</h2>
            </div>
            <div className="divide-y">
              {backups.map((backup) => (
                <div key={backup.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{backup.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          backup.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {backup.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Size: {backup.size} | Type: {backup.type} | Retention: {backup.retention}
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        {Object.entries(backup.items).map(([key, value]) => (
                          <span key={key} className={`flex items-center ${value ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className="mr-1">•</span>
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedBackup(backup.name);
                          setShowRestoreConfirm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Created: {backup.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Backup Schedule</h2>
            </div>
            <div className="p-4 space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{schedule.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{schedule.frequency} at {schedule.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Retention: {schedule.retention}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HardDrive className="h-4 w-4" />
                      <span>Next run: {schedule.nextRun}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Restore</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to restore the system from backup "{selectedBackup}"? 
              This will replace all current data with the backup data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(`Restoring from backup: ${selectedBackup}`);
                  setShowRestoreConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Backup</h3>
              <button 
                onClick={() => setShowCreateBackup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBackup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={backupForm.name}
                  onChange={handleBackupInputChange}
                  required
                  placeholder="e.g., Pre-Update Backup"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={backupForm.description}
                  onChange={handleBackupInputChange}
                  rows={3}
                  placeholder="Backup description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Type
                </label>
                <select
                  name="type"
                  value={backupForm.type}
                  onChange={handleBackupInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full">Full Backup</option>
                  <option value="incremental">Incremental Backup</option>
                  <option value="differential">Differential Backup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items to Backup
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(backupForm.items).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={() => handleCheckboxChange(key)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={key} className="ml-2 text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retention Period (days)
                </label>
                <select
                  name="retention"
                  value={backupForm.retention}
                  onChange={handleBackupInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <select
                  name="schedule"
                  value={backupForm.schedule}
                  onChange={handleBackupInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">One-time backup</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {backupForm.schedule !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    name="scheduleTime"
                    value={backupForm.scheduleTime}
                    onChange={handleBackupInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateBackup(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Backup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 