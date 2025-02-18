'use client';

import { Globe, Check } from 'lucide-react';

export default function IdiomaPage() {
  const languages = [
    { code: 'en', name: 'English', active: true },
    { code: 'es', name: 'Español', active: false },
    { code: 'pt', name: 'Português', active: false },
    { code: 'fr', name: 'Français', active: false },
    { code: 'de', name: 'Deutsch', active: false },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">Language Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 divide-y">
          {languages.map((language) => (
            <div
              key={language.code}
              className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.name}</span>
                <span className="text-sm text-gray-500">({language.code})</span>
              </div>
              {language.active && (
                <Check className="h-5 w-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 