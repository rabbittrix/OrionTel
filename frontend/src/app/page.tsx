import SystemResources from '@/components/dashboard/SystemResources';
import PerformanceGraph from '@/components/dashboard/PerformanceGraph';
import DiskUsage from '@/components/dashboard/DiskUsage';
import NewsFeed from '@/components/dashboard/NewsFeed';

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SystemResources />
      <PerformanceGraph />
      <DiskUsage />
      <NewsFeed />
    </div>
  );
}
