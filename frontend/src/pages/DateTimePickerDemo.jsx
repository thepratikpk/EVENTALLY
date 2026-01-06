import React, { useState } from 'react';
import DateTimePicker from '../components/DateTimePicker';

const DateTimePickerDemo = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🎨 Creative Date & Time Picker
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience our beautifully designed, interactive date and time picker with smooth animations,
            modern UI elements, and intuitive user experience.
          </p>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Try It Out! 🚀
          </h2>

          <DateTimePicker
            eventDate={selectedDate}
            eventTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            required={true}
          />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Beautiful Design</h3>
            <p className="text-slate-600">Modern gradient backgrounds, smooth animations, and professional styling</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Responsive</h3>
            <p className="text-slate-600">Works perfectly on all devices with touch-friendly interactions</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive</h3>
            <p className="text-slate-600">Smooth hover effects, click animations, and visual feedback</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl mb-4">🌅</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Time Periods</h3>
            <p className="text-slate-600">Organized by morning, afternoon, evening, and night with icons</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Custom Calendar</h3>
            <p className="text-slate-600">Interactive calendar with today highlighting and past date prevention</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Summary</h3>
            <p className="text-slate-600">Beautiful confirmation card with all selected details</p>
          </div>
        </div>

        {/* Current Selection Display */}
        {(selectedDate || selectedTime) && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Current Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm font-medium text-slate-600">Selected Date</p>
                <p className="text-lg font-bold text-slate-900">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Not selected'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm font-medium text-slate-600">Selected Time</p>
                <p className="text-lg font-bold text-slate-900">
                  {selectedTime ? new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) : 'Not selected'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimePickerDemo;