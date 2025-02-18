'use client';

import { RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString(),
      calls: Math.floor(Math.random() * 10),
      cpu: 20 + Math.random() * 10,
      memory: 60 + Math.random() * 20,
    });
  }
  return data;
};

const PerformanceGraph = () => {
  const data = generateMockData();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Performance Graphic</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <RefreshCw className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
            />
            <YAxis yAxisId="left" label={{ value: 'Calls', angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'CPU/Memory %', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="calls"
              stroke="#EF4444"
              name="Sim. calls"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cpu"
              stroke="#10B981"
              name="CPU usage"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="memory"
              stroke="#3B82F6"
              name="Memory usage"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceGraph; 