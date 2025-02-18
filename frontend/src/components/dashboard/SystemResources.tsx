'use client';

import { RefreshCw } from 'lucide-react';

interface GaugeProps {
  value: number;
  label: string;
  color: string;
}

const Gauge = ({ value, label, color }: GaugeProps) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const rotation = -90; // Start from top

  return (
    <div className="relative flex flex-col items-center">
      <svg width="180" height="180" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
        />
        {/* Progress circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="20"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '90px 90px',
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{value}%</span>
        <span className="text-gray-500">{label}</span>
      </div>
    </div>
  );
};

const SystemResources = () => {
  const systemInfo = {
    cpu: {
      value: 22.1,
      label: 'CPU',
      color: '#10B981', // Green
      details: {
        model: 'Intel(R) Celeron(R) CPU 2.40GHz',
        uptime: '2 days, 11 min',
        speed: '2,405.6 MHz',
      },
    },
    ram: {
      value: 70.3,
      label: 'RAM',
      color: '#3B82F6', // Blue
      details: {
        total: '471.10 Mb',
        used: 'SWAP: 959.99 Mb',
      },
    },
    swap: {
      value: 0,
      label: 'SWAP',
      color: '#EF4444', // Red
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recursos del Sistema</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <RefreshCw className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <Gauge {...systemInfo.cpu} />
        <Gauge {...systemInfo.ram} />
        <Gauge {...systemInfo.swap} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <div>
          <strong>CPU:</strong> {systemInfo.cpu.details.model}
        </div>
        <div>
          <strong>Uptime:</strong> {systemInfo.cpu.details.uptime}
        </div>
        <div>
          <strong>Velocidad CPU:</strong> {systemInfo.cpu.details.speed}
        </div>
        <div>
          <strong>Memoria Utilizada:</strong> {systemInfo.ram.details.used}
        </div>
      </div>
    </div>
  );
};

export default SystemResources; 