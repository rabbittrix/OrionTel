'use client';

import { Mail, Calendar, Phone, MessageSquare, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const TopHeader = () => {
  const mainNavItems = [
    { name: 'System', href: '/system', icon: Settings },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Email', href: '/email', icon: Mail },
    { name: 'Fax', href: '/fax', icon: Phone },
    { name: 'PBX', href: '/pbx', icon: Phone },
    { name: 'IM', href: '/im', icon: MessageSquare },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  const secondaryNavItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Network', href: '/network' },
    { name: 'Users', href: '/users' },
    { name: 'Shutdown', href: '/shutdown' },
    { name: 'Hardware Detector', href: '/hardware-detector' },
    { name: 'Updates', href: '/updates' },
    { name: 'Backup/Restore', href: '/backup-restore' },
    { name: 'Preferences', href: '/preferences' },
  ];

  return (
    <header className="bg-blue-600">
      <div className="container mx-auto">
        {/* Main Navigation */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center -ml-8">
            <Image
              src="/logo1.png"
              alt="OrionTel Logo"
              width={240}
              height={60}
              className="h-16 w-auto"
            />
          </div>
          <nav className="flex space-x-4">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="bg-gray-700">
          <nav className="flex space-x-4 px-4 py-2">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default TopHeader; 