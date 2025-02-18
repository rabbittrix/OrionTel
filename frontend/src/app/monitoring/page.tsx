'use client';

import { Activity, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonitoringPage() {
  const generateData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      calls: Math.floor(Math.random() * 100),
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
    }));
  };

  const data = generateData();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">System Monitoring</h1>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">System Performance</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calls" stroke="#EF4444" name="Active Calls" />
                <Line type="monotone" dataKey="cpu" stroke="#10B981" name="CPU Usage" />
                <Line type="monotone" dataKey="memory" stroke="#3B82F6" name="Memory Usage" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Active Calls</h3>
            <div className="text-3xl font-bold text-red-500">{data[data.length - 1].calls}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">CPU Usage</h3>
            <div className="text-3xl font-bold text-green-500">{data[data.length - 1].cpu}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
            <div className="text-3xl font-bold text-blue-500">{data[data.length - 1].memory}%</div>
          </div>
        </div>
      </div>
    </div>
  );
} 