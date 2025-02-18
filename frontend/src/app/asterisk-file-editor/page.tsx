'use client';

import { FileEdit, Save, FolderOpen } from 'lucide-react';

export default function AsteriskFileEditorPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileEdit className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Asterisk File Editor</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            <FolderOpen className="h-4 w-4" />
            <span>Open</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-4 py-3">
          <select className="w-full p-2 border rounded-md">
            <option value="sip.conf">sip.conf</option>
            <option value="extensions.conf">extensions.conf</option>
            <option value="voicemail.conf">voicemail.conf</option>
          </select>
        </div>
        <div className="p-4">
          <textarea
            className="w-full h-[500px] p-4 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select a file to edit..."
          />
        </div>
      </div>
    </div>
  );
} 