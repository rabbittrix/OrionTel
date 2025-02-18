'use client';

import { MessageSquare, Users, Search, Phone, Video, Image, Paperclip, Send, MoreVertical, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function IMPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');

  const contacts = [
    {
      id: 1,
      name: 'Support Team',
      type: 'group',
      members: 5,
      lastMessage: 'New ticket assigned to the team',
      time: '10:30 AM',
      unread: 2,
      status: 'online',
    },
    {
      id: 2,
      name: 'John Doe',
      type: 'individual',
      lastMessage: 'Can you check the server status?',
      time: '09:45 AM',
      unread: 0,
      status: 'online',
    },
    {
      id: 3,
      name: 'Technical Team',
      type: 'group',
      members: 8,
      lastMessage: 'System maintenance scheduled',
      time: 'Yesterday',
      unread: 0,
      status: 'online',
    },
  ];

  const messages = [
    {
      id: 1,
      chatId: 1,
      sender: 'Alice Smith',
      content: 'New support ticket #1234 has been assigned to our team.',
      time: '10:30 AM',
      type: 'text',
    },
    {
      id: 2,
      chatId: 1,
      sender: 'Bob Johnson',
      content: "I'll take a look at it right away.",
      time: '10:31 AM',
      type: 'text',
    },
    {
      id: 3,
      chatId: 1,
      sender: 'You',
      content: 'Thanks Bob. Please update the ticket status once you start working on it.',
      time: '10:32 AM',
      type: 'text',
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const selectedChatDetails = contacts.find((contact) => contact.id === selectedChat);

  return (
    <div className="p-6">
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Messages</h2>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <UserPlus className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedChat(contact.id)}
                className={`w-full p-4 flex items-start hover:bg-gray-50 ${
                  selectedChat === contact.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {contact.type === 'group' ? (
                      <Users className="h-5 w-5 text-blue-600" />
                    ) : (
                      <span className="text-blue-600 font-medium">{contact.name[0]}</span>
                    )}
                  </div>
                  {contact.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{contact.name}</span>
                    <span className="text-xs text-gray-500">{contact.time}</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {contact.type === 'group' && `${contact.members} members • `}
                    {contact.lastMessage}
                  </div>
                </div>
                {contact.unread > 0 && (
                  <div className="ml-2 bg-blue-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {contact.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <div className="font-medium">{selectedChatDetails?.name}</div>
                {selectedChatDetails?.type === 'group' && (
                  <div className="ml-2 text-sm text-gray-500">
                    {selectedChatDetails.members} members
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter((msg) => msg.chatId === selectedChat)
                .map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === 'You'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.sender !== 'You' && (
                        <div className="text-xs text-gray-500 mb-1">{message.sender}</div>
                      )}
                      <div>{message.content}</div>
                      <div className="text-xs mt-1 opacity-70">{message.time}</div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Image className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a contact or group to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 