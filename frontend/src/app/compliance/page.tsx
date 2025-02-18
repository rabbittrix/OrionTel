'use client';

import { Scale, Mic, Phone, FileText, Play, Pause, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface Complaint {
  id: string;
  date: string;
  time: string;
  phoneNumber: string;
  status: 'processing' | 'completed' | 'failed';
  transcription: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export default function CompliancePage() {
  const [showInfo, setShowInfo] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const [complaints] = useState<Complaint[]>([
    {
      id: '1',
      date: '2024-03-20',
      time: '10:30:45',
      phoneNumber: '+1 (555) 123-4567',
      status: 'completed',
      transcription: 'Customer reported issues with service quality and response time.',
      category: 'Service Quality',
      priority: 'high',
    },
    {
      id: '2',
      date: '2024-03-20',
      time: '09:15:30',
      phoneNumber: '+1 (555) 987-6543',
      status: 'processing',
      transcription: 'Processing voice transcription...',
      category: 'Technical Support',
      priority: 'medium',
    },
    {
      id: '3',
      date: '2024-03-19',
      time: '15:45:20',
      phoneNumber: '+1 (555) 246-8135',
      status: 'completed',
      transcription: 'Customer suggested improvements for the user interface.',
      category: 'Product Feedback',
      priority: 'low',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Scale className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Compliance Management</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Information"
          >
            <AlertCircle className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full" title="Refresh">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">About Compliance</h2>
          <p className="text-blue-600 mb-4">
            Compliance is a set of rules and practices that ensure a company adheres to laws,
            regulations, and standards. Our system uses advanced AI technology to process, transcribe,
            and classify customer complaints, ensuring efficient handling and documentation.
          </p>
          <h3 className="font-medium text-blue-800 mb-2">Compliance Objectives:</h3>
          <ul className="list-disc list-inside text-blue-600 space-y-1">
            <li>Ensure security and minimize risks</li>
            <li>Promote ethical practices</li>
            <li>Reduce the risk of sanctions or penalties</li>
            <li>Increase legal compliance</li>
            <li>Foster corporate governance</li>
          </ul>
          <div className="mt-4 bg-white rounded p-4">
            <h3 className="font-medium text-blue-800 mb-2">AI-Powered Features:</h3>
            <ul className="list-disc list-inside text-blue-600 space-y-1">
              <li>Real-time voice-to-text transcription</li>
              <li>Automatic complaint classification by category and priority</li>
              <li>Sentiment analysis for customer feedback</li>
              <li>Pattern recognition for identifying recurring issues</li>
              <li>Automated compliance risk assessment</li>
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Voice Complaint Line</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Call our dedicated line to register your complaint. Your voice will be automatically
            transcribed and processed by our AI system.
          </p>
          <div className="flex items-center space-x-2 text-lg font-medium text-blue-600">
            <Phone className="h-5 w-5" />
            <span>0800-COMPLIANCE</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mic className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Voice Processing</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">AI Transcription Service:</span>
              <span className="text-green-500 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Online
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Queue:</span>
              <span>2 items</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Processing Time:</span>
              <span>~2 minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Complaints</h2>
        </div>
        <div className="divide-y">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{complaint.phoneNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {complaint.date} {complaint.time}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority} priority
                  </span>
                  <button
                    onClick={() => setCurrentlyPlaying(currentlyPlaying === complaint.id ? null : complaint.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    disabled={complaint.status !== 'completed'}
                  >
                    {currentlyPlaying === complaint.id ? (
                      <Pause className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Play className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-gray-400 mt-1" />
                  <p className="text-sm text-gray-600 flex-1">{complaint.transcription}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Category: {complaint.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 