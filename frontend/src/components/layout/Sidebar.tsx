'use client';

import { Bookmark, FileText, Monitor, History, Shield, Settings, Phone, Satellite, MapPin, BarChart, Scale } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Monitor },
    { name: 'Call Map', href: '/call-map', icon: MapPin },
    { name: 'Call Reports', href: '/call-reports', icon: BarChart },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Language', href: '/language', icon: FileText },
    { name: 'Asterisk File Editor', href: '/asterisk-file-editor', icon: FileText },
    { name: 'Monitoring', href: '/monitoring', icon: Monitor },
    { name: 'History', href: '/history', icon: History },
    { name: 'Addons', href: '/addons', icon: Settings },
    { name: 'Firewall Rules', href: '/firewall-rules', icon: Shield },
    { name: 'Advanced Settings', href: '/advanced-settings', icon: Settings },
    { name: 'PBX Configuration', href: '/pbx-configuration', icon: Phone },
    { name: 'Satellite', href: '/satellite', icon: Satellite },
  ];

  const governanceItems = [
    { name: 'Compliance', href: '/compliance', icon: Scale },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Governance
          </h3>
          <div className="mt-2 space-y-1">
            {governanceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 