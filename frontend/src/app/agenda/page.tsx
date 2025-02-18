'use client';

import { Calendar as CalendarIcon, Clock, Plus, Users, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function AgendaPage() {
  const [currentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [events] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      date: '2024-02-18',
      time: '10:00 AM',
      duration: '1h',
      type: 'meeting',
      attendees: ['John Doe', 'Jane Smith', 'Bob Johnson'],
      location: 'Conference Room A',
    },
    {
      id: 2,
      title: 'Client Call',
      date: '2024-02-18',
      time: '2:00 PM',
      duration: '30m',
      type: 'call',
      attendees: ['John Doe', 'Client Name'],
      location: 'Virtual',
    },
    {
      id: 3,
      title: 'Project Review',
      date: '2024-02-19',
      time: '11:00 AM',
      duration: '2h',
      type: 'meeting',
      attendees: ['Development Team'],
      location: 'Conference Room B',
    },
  ]);

  const daysInMonth = Array.from({ length: 35 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - currentDate.getDay() + 1);
    return {
      date,
      isCurrentMonth: date.getMonth() === currentDate.getMonth(),
      events: events.filter(event => event.date === date.toISOString().split('T')[0]),
    };
  });

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Calendar</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-md ${
                view === 'month' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md ${
                view === 'week' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {view === 'month' ? (
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {weekDays.map((day) => (
              <div key={day} className="bg-gray-50 p-2 text-sm font-medium text-gray-700 text-center">
                {day.slice(0, 3)}
              </div>
            ))}
            {daysInMonth.map(({ date, isCurrentMonth, events }, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                  {date.getDate()}
                </div>
                <div className="mt-1 space-y-1">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 truncate"
                    >
                      {event.time} - {event.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            <div className="bg-gray-50" />
            {weekDays.map((day) => (
              <div key={day} className="bg-gray-50 p-2 text-sm font-medium text-gray-700 text-center">
                {day}
              </div>
            ))}
            {hours.map((hour) => (
              <>
                <div key={hour} className="bg-white p-2 text-sm text-gray-500">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {weekDays.map((_, dayIndex) => (
                  <div key={`${hour}-${dayIndex}`} className="bg-white border-t border-l relative">
                    {events
                      .filter(
                        (event) =>
                          new Date(event.date).getDay() === dayIndex &&
                          parseInt(event.time.split(':')[0]) === hour
                      )
                      .map((event) => (
                        <div
                          key={event.id}
                          className="absolute left-0 right-0 m-1 p-2 text-xs bg-blue-50 text-blue-700 rounded-md"
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="flex items-center text-blue-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">{event.title}</h3>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.date} at {event.time} ({event.duration})
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees.join(', ')}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 