'use client';

import { BookmarkCheck, Plus } from 'lucide-react';

export default function BookmarksPage() {
  const bookmarks = [
    { name: 'System Dashboard', url: '/dashboard', category: 'System' },
    { name: 'Network Settings', url: '/network', category: 'Network' },
    { name: 'PBX Configuration', url: '/pbx-configuration', category: 'PBX' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bookmarks</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Add Bookmark</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 divide-y">
          {bookmarks.map((bookmark, index) => (
            <div key={index} className="p-4 flex items-center space-x-4 hover:bg-gray-50">
              <BookmarkCheck className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-medium">{bookmark.name}</h3>
                <p className="text-sm text-gray-500">{bookmark.url}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {bookmark.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 