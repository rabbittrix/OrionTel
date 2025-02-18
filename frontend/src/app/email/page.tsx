'use client';

import { Mail, Inbox, Send, Archive, Trash2, Star, Search, Plus, Filter, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function EmailPage() {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: 12 },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'starred', name: 'Starred', icon: Star, count: 3 },
    { id: 'archive', name: 'Archive', icon: Archive, count: 0 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 0 },
  ];

  const emails = [
    {
      id: 1,
      from: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Project Update Meeting',
      preview: 'Hi team, I wanted to share the latest updates from our project meeting yesterday...',
      date: '10:30 AM',
      isRead: false,
      isStarred: true,
      attachments: 2,
    },
    {
      id: 2,
      from: 'Support Team',
      email: 'support@oriontel.com',
      subject: 'New Ticket Assignment',
      preview: 'A new support ticket has been assigned to you. Please review and respond...',
      date: '9:15 AM',
      isRead: true,
      isStarred: false,
      attachments: 0,
    },
    {
      id: 3,
      from: 'System Notifications',
      email: 'noreply@oriontel.com',
      subject: 'System Backup Complete',
      preview: 'The scheduled system backup has been completed successfully...',
      date: 'Yesterday',
      isRead: true,
      isStarred: false,
      attachments: 1,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Mail className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Email</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span>Compose</span>
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg shadow overflow-hidden">
        <div className="w-64 border-r">
          <div className="p-4">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between p-2 rounded-md ${
                  selectedFolder === folder.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <folder.icon className="h-5 w-5" />
                  <span>{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex">
          <div className={`w-96 border-r ${selectedEmail ? 'block' : 'hidden md:block'}`}>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">Filter</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <RefreshCw className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="divide-y overflow-auto h-[calc(100vh-16rem)]">
              {emails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 ${
                    selectedEmail === email.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${email.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                          {email.from}
                        </span>
                        {email.isStarred && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{email.subject}</div>
                      <div className="text-sm text-gray-500 truncate">{email.preview}</div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <span className="text-xs text-gray-500">{email.date}</span>
                      {email.attachments > 0 && (
                        <span className="mt-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                          {email.attachments} files
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`flex-1 ${selectedEmail ? 'block' : 'hidden md:block'}`}>
            {selectedEmail ? (
              <div className="h-full flex flex-col">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-semibold mb-4">
                    {emails.find((e) => e.id === selectedEmail)?.subject}
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {emails.find((e) => e.id === selectedEmail)?.from.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">
                          {emails.find((e) => e.id === selectedEmail)?.from}
                        </div>
                        <div className="text-sm text-gray-500">
                          {emails.find((e) => e.id === selectedEmail)?.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {emails.find((e) => e.id === selectedEmail)?.date}
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-auto">
                  <div className="prose max-w-none">
                    <p>{emails.find((e) => e.id === selectedEmail)?.preview}</p>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Mail className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Select an email to read</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose an email from the list to view its contents
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 