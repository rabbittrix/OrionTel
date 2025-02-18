'use client';

import { RefreshCw } from 'lucide-react';

const NewsFeed = () => {
  const news = [
    {
      date: '2012.03.12',
      title: 'OrionTel 2.3.0 RC 1',
      link: '#',
    },
    {
      date: '2012.03.12',
      title: 'New PBXMate Addon',
      link: '#',
    },
    {
      date: '2012.03.05',
      title: 'Reglas de lista general en español',
      link: '#',
    },
    {
      date: '2012.02.29',
      title: 'OrionTel will be present at CeBIT 2012',
      link: '#',
    },
    {
      date: '2012.02.13',
      title: 'OrionTel Training 2012 in English and Spanish',
      link: '#',
    },
    {
      date: '2012.02.02',
      title: 'OrionTel 2.3.0 beta 2',
      link: '#',
    },
    {
      date: '2012.01.26',
      title: 'OrionTel Silver Sponsor Asterisk World',
      link: '#',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">News</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <RefreshCw className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-3">
        {news.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-20 text-sm text-gray-500">
              {item.date}
            </div>
            <a
              href={item.link}
              className="flex-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed; 