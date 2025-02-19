'use client';

import { Calendar as CalendarIcon, Clock, Plus, Users, MapPin, Search, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventFormData {
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'meeting' | 'call' | 'task';
  location: string;
  attendees: string;
  description: string;
}

interface FilterOptions {
  startDate: Date;
  endDate: Date;
  type: string;
  search: string;
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: new Date(),
    endDate: new Date(),
    type: '',
    search: ''
  });
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: '',
    date: '',
    time: '09:00',
    duration: '1h',
    type: 'meeting',
    location: '',
    attendees: '',
    description: ''
  });

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

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const calendarDays = daysInMonth.map(date => ({
    date,
    isCurrentMonth: true,
    isToday: isToday(date)
  }));

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleFilterChange = (name: string, value: any) => {
    setFilterOptions(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New event:', eventForm);
    setShowEventModal(false);
    setEventForm({
      title: '',
      date: currentDate ? currentDate.toISOString().split('T')[0] : '',
      time: '09:00',
      duration: '1h',
      type: 'meeting',
      location: '',
      attendees: '',
      description: ''
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
              <p className="text-sm text-gray-500">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleToday}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Hoje
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={filterOptions.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilterModal(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <Filter className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Evento</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-7 gap-[1px] bg-yellow-100">
            {weekDays.map((day) => (
              <div key={day} className="bg-white py-4 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-[1px] bg-yellow-100">
            {calendarDays.map(({ date, isToday }, index) => (
              <div
                key={index}
                className={`min-h-[120px] bg-white p-2 ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <span className={`text-sm font-medium ${
                  isToday ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {format(date, 'd')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filtrar Eventos</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500">Início</label>
                    <input
                      type="date"
                      value={format(filterOptions.startDate, 'yyyy-MM-dd')}
                      onChange={(e) => handleFilterChange('startDate', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Fim</label>
                    <input
                      type="date"
                      value={format(filterOptions.endDate, 'yyyy-MM-dd')}
                      onChange={(e) => handleFilterChange('endDate', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Evento
                </label>
                <select
                  value={filterOptions.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="meeting">Reunião</option>
                  <option value="call">Chamada</option>
                  <option value="task">Tarefa</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-4 border-t">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Novo Evento</h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventForm.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Título do evento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={eventForm.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração
                  </label>
                  <select
                    name="duration"
                    value={eventForm.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30m">30 minutos</option>
                    <option value="1h">1 hora</option>
                    <option value="1h30m">1 hora e 30 minutos</option>
                    <option value="2h">2 horas</option>
                    <option value="3h">3 horas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    name="type"
                    value={eventForm.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting">Reunião</option>
                    <option value="call">Chamada</option>
                    <option value="task">Tarefa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventForm.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Local ou link da reunião"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participantes
                </label>
                <input
                  type="text"
                  name="attendees"
                  value={eventForm.attendees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email dos participantes (separados por vírgula)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição do evento"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Criar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 