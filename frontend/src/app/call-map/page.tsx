'use client';

import { MapPin, Phone, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';

interface ActiveCall {
  id: string;
  from: string;
  to: string;
  duration: string;
  status: 'connected' | 'ringing' | 'holding';
  type: 'internal' | 'external' | 'conference';
  recording: boolean;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
}

export default function CallMapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([
    {
      id: '1',
      from: '+1 (555) 123-4567',
      to: 'Extension 101',
      duration: '00:05:23',
      status: 'connected',
      type: 'external',
      recording: true,
      location: {
        lat: 40.7128,
        lng: -74.0060,
        city: 'New York',
        country: 'USA',
      },
    },
    {
      id: '2',
      from: 'Extension 102',
      to: 'Extension 103',
      duration: '00:02:45',
      status: 'connected',
      type: 'internal',
      recording: true,
      location: {
        lat: -23.5505,
        lng: -46.6333,
        city: 'São Paulo',
        country: 'Brazil',
      },
    },
    {
      id: '3',
      from: '+44 20 7123 4567',
      to: 'Conference Room 1',
      duration: '00:15:30',
      status: 'connected',
      type: 'conference',
      recording: true,
      location: {
        lat: 51.5074,
        lng: -0.1278,
        city: 'London',
        country: 'UK',
      },
    },
  ]);

  const filteredCalls = activeCalls.filter(
    (call) =>
      call.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'ringing':
        return 'bg-yellow-100 text-yellow-800';
      case 'holding':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internal':
        return 'text-blue-500';
      case 'external':
        return 'text-green-500';
      case 'conference':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Active Calls Map</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map View */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4">
            {/* Here you would integrate a map component (e.g., Google Maps, Mapbox) */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Map Component Placeholder
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Connected</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Ringing</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Holding</span>
              </div>
            </div>
            <span>{activeCalls.length} Active Calls</span>
          </div>
        </div>

        {/* Call List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Active Calls</h2>
          </div>
          <div className="divide-y overflow-auto max-h-[600px]">
            {filteredCalls.map((call) => (
              <div key={call.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Phone className={`h-4 w-4 ${getTypeIcon(call.type)}`} />
                      <span className="font-medium">
                        {call.from} → {call.to}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {call.location.city}, {call.location.country}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                    <span className="mt-1 text-sm text-gray-500">{call.duration}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type: {call.type}</span>
                  {call.recording && (
                    <span className="text-red-500 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>Recording</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 