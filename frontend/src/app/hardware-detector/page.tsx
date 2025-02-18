'use client';

import { HardDrive, RefreshCw, Cpu, MemoryStick, Wifi, Usb } from 'lucide-react';

export default function HardwareDetectorPage() {
  const hardware = {
    cpu: {
      model: 'Intel(R) Celeron(R) CPU 2.40GHz',
      cores: 2,
      threads: 4,
      frequency: '2.40 GHz',
      cache: '3 MB',
    },
    memory: {
      total: '8 GB',
      type: 'DDR4',
      speed: '2400 MHz',
      slots: [
        { id: 1, size: '4 GB', status: 'active' },
        { id: 2, size: '4 GB', status: 'active' },
        { id: 3, size: '-', status: 'empty' },
        { id: 4, size: '-', status: 'empty' },
      ],
    },
    storage: [
      {
        device: '/dev/sda',
        type: 'SSD',
        model: 'Samsung 860 EVO',
        size: '500 GB',
        status: 'active',
      },
      {
        device: '/dev/sdb',
        type: 'HDD',
        model: 'Western Digital Blue',
        size: '1 TB',
        status: 'active',
      },
    ],
    network: [
      {
        type: 'Ethernet',
        model: 'Intel I211 Gigabit',
        speed: '1000 Mbps',
        status: 'connected',
      },
      {
        type: 'WiFi',
        model: 'Intel AX200',
        speed: '867 Mbps',
        status: 'disconnected',
      },
    ],
    usb: [
      {
        port: 'USB 3.0',
        device: 'Logitech Mouse',
        speed: '5 Gbps',
        status: 'connected',
      },
      {
        port: 'USB 2.0',
        device: 'Generic Keyboard',
        speed: '480 Mbps',
        status: 'connected',
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <HardDrive className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Hardware Detection</h1>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <RefreshCw className="h-4 w-4" />
          <span>Scan Hardware</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Cpu className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Processor</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Model:</span>
              <span className="font-medium">{hardware.cpu.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cores/Threads:</span>
              <span className="font-medium">{hardware.cpu.cores}/{hardware.cpu.threads}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frequency:</span>
              <span className="font-medium">{hardware.cpu.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cache:</span>
              <span className="font-medium">{hardware.cpu.cache}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MemoryStick className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Memory</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{hardware.memory.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{hardware.memory.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Speed:</span>
                <span className="font-medium">{hardware.memory.speed}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Memory Slots</h3>
              <div className="grid grid-cols-4 gap-2">
                {hardware.memory.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-2 rounded text-center ${
                      slot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-xs font-medium">Slot {slot.id}</div>
                    <div className="text-sm">{slot.size}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <HardDrive className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Storage Devices</h2>
          </div>
          <div className="space-y-4">
            {hardware.storage.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{device.model}</div>
                  <div className="text-sm text-gray-500">{device.device}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{device.size}</div>
                  <div className="text-xs text-gray-500">{device.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Wifi className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Network Interfaces</h2>
          </div>
          <div className="space-y-4">
            {hardware.network.map((interface_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{interface_.model}</div>
                  <div className="text-sm text-gray-500">{interface_.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{interface_.speed}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    interface_.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {interface_.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <Usb className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">USB Devices</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hardware.usb.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{device.device}</div>
                  <div className="text-sm text-gray-500">{device.port}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{device.speed}</div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {device.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 