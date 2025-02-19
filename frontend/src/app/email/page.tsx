'use client';

import { Mail, Inbox, Send, Archive, Trash2, Star, Search, Plus, Filter, RefreshCw, X, Paperclip, Heart } from 'lucide-react';
import { useState } from 'react';

interface EmailFormData {
  to: string;
  subject: string;
  content: string;
  attachments: File[];
}

interface FilterOptions {
  dateRange: 'all' | 'today' | 'week' | 'month';
  read: 'all' | 'read' | 'unread';
  hasAttachments: boolean;
}

export default function EmailPage() {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    dateRange: 'all',
    read: 'all',
    hasAttachments: false
  });
  const [emailForm, setEmailForm] = useState<EmailFormData>({
    to: '',
    subject: '',
    content: '',
    attachments: []
  });

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: 12 },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'favorites', name: 'Favorites', icon: Heart, count: 3 },
    { id: 'archive', name: 'Archive', icon: Archive, count: 0 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 0 },
  ];

  const [emails, setEmails] = useState([
    {
      id: 1,
      from: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Project Update Meeting',
      preview: 'Hi team, I wanted to share the latest updates from our project meeting yesterday...',
      date: '10:30 AM',
      isRead: false,
      isFavorite: true,
      folder: 'inbox',
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
      isFavorite: false,
      folder: 'inbox',
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
      isFavorite: false,
      folder: 'inbox',
      attachments: 1,
    },
  ]);

  const handleMoveEmail = (emailId: number, targetFolder: string) => {
    setEmails(prevEmails => 
      prevEmails.map(email => 
        email.id === emailId 
          ? { ...email, folder: targetFolder }
          : email
      )
    );
  };

  const handleToggleFavorite = (emailId: number) => {
    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === emailId
          ? { ...email, isFavorite: !email.isFavorite }
          : email
      )
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular uma atualização dos emails
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Aqui você faria uma chamada real para atualizar os emails
    setIsRefreshing(false);
  };

  const filteredEmails = emails.filter(email => {
    // Filtro de pasta
    if (selectedFolder === 'favorites' && !email.isFavorite) return false;
    if (selectedFolder !== 'favorites' && email.folder !== selectedFolder) return false;

    // Filtros adicionais
    if (filterOptions.read !== 'all') {
      if (filterOptions.read === 'read' && !email.isRead) return false;
      if (filterOptions.read === 'unread' && email.isRead) return false;
    }

    if (filterOptions.hasAttachments && email.attachments === 0) return false;

    if (filterOptions.dateRange !== 'all') {
      const emailDate = new Date();
      const today = new Date();
      const weekAgo = new Date();
      const monthAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      monthAgo.setMonth(today.getMonth() - 1);

      if (filterOptions.dateRange === 'today' && emailDate.toDateString() !== today.toDateString()) return false;
      if (filterOptions.dateRange === 'week' && emailDate < weekAgo) return false;
      if (filterOptions.dateRange === 'month' && emailDate < monthAgo) return false;
    }

    return true;
  });

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
          <button 
            onClick={() => setShowComposeModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
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
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button 
                onClick={handleRefresh}
                className={`p-2 hover:bg-gray-100 rounded-full ${isRefreshing ? 'animate-spin' : ''}`}
                disabled={isRefreshing}
              >
                <RefreshCw className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="divide-y overflow-auto h-[calc(100vh-16rem)]">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className="relative group"
                >
                  <button
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
                        </div>
                        <div className="text-sm text-gray-500 truncate">{email.subject}</div>
                        <div className="text-sm text-gray-500 truncate">{email.preview}</div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">{email.date}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(email.id);
                            }}
                            className="p-1"
                            title={email.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart className={`h-4 w-4 ${email.isFavorite ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveEmail(email.id, 'archive');
                            }}
                            className="p-1"
                            title="Archive"
                          >
                            <Archive className="h-4 w-4 text-gray-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveEmail(email.id, 'trash');
                            }}
                            className="p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                        {email.attachments > 0 && (
                          <div className="mt-1 flex justify-end">
                            <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                              {email.attachments} files
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
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
                  <button 
                    onClick={() => {
                      const selectedEmailData = emails.find((e) => e.id === selectedEmail);
                      setEmailForm({
                        to: selectedEmailData?.email || '',
                        subject: `Re: ${selectedEmailData?.subject}`,
                        content: '',
                        attachments: []
                      });
                      setShowReplyModal(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
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

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">New Message</h2>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('Sending email:', emailForm);
              setShowComposeModal(false);
              setEmailForm({ to: '', subject: '', content: '', attachments: [] });
            }} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="email"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="recipient@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={emailForm.content}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your message here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div className="mt-1 flex items-center">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                    <span>Add files</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setEmailForm(prev => ({
                          ...prev,
                          attachments: [...prev.attachments, ...files]
                        }));
                      }}
                    />
                  </label>
                  {emailForm.attachments.length > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      {emailForm.attachments.length} file(s) selected
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Reply</h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('Sending reply:', emailForm);
              setShowReplyModal(false);
              setEmailForm({ to: '', subject: '', content: '', attachments: [] });
            }} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="email"
                  value={emailForm.to}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={emailForm.content}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your reply here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div className="mt-1 flex items-center">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                    <span>Add files</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setEmailForm(prev => ({
                          ...prev,
                          attachments: [...prev.attachments, ...files]
                        }));
                      }}
                    />
                  </label>
                  {emailForm.attachments.length > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      {emailForm.attachments.length} file(s) selected
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filter Emails</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={filterOptions.dateRange}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, dateRange: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Status
                </label>
                <select
                  value={filterOptions.read}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, read: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasAttachments"
                  checked={filterOptions.hasAttachments}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, hasAttachments: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasAttachments" className="ml-2 block text-sm text-gray-700">
                  Has attachments
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFilterOptions({
                      dateRange: 'all',
                      read: 'all',
                      hasAttachments: false
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 