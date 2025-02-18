'use client';

import SystemResources from '@/components/dashboard/SystemResources';
import PerformanceGraph from '@/components/dashboard/PerformanceGraph';
import DiskUsage from '@/components/dashboard/DiskUsage';
import NewsFeed from '@/components/dashboard/NewsFeed';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <SystemResources />
        <PerformanceGraph />
        <DiskUsage />
        <NewsFeed />
      </div>
    </div>
  );
} 