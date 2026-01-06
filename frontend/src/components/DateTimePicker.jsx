import React, { useState, useEffect, useRef } from 'react';

const DateTimePicker = ({
  eventDate,
  eventTime,
  onDateChange,
  onTimeChange,
  required = false
}) => {
  const [selectedDate, setSelectedDate] = useState(eventDate || '');
  const [selectedTime, setSelectedTime] = useState(eventTime || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);

  // Generate time options (every 15 minutes for professional scheduling)
  const generateTimeOptions = () => {
    const periods = [
      {
        label: 'Morning',
        icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        range: '6:00 AM - 11:59 AM',
        times: []
      },
      {
        label: 'Afternoon',
        icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        range: '12:00 PM - 4:59 PM',
        times: []
      },
      {
        label: 'Evening',
        icon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
        range: '5:00 PM - 8:59 PM',
        times: []
      },
      {
        label: 'Night',
        icon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
        range: '9:00 PM - 5:59 AM',
        times: []
      }
    ];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        const timeObj = { value: timeString, display: displayTime, hour };

        if (hour >= 6 && hour < 12) periods[0].times.push(timeObj);
        else if (hour >= 12 && hour < 17) periods[1].times.push(timeObj);
        else if (hour >= 17 && hour < 21) periods[2].times.push(timeObj);
        else periods[3].times.push(timeObj);
      }
    }
    return periods;
  };

  const timeOptions = generateTimeOptions();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
        setShowTimePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (date) => {
    let dateString;
    if (typeof date === 'string') {
      dateString = date;
    } else {
      // Create date string without timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateString = `${year}-${month}-${day}`;
    }
    setSelectedDate(dateString);
    onDateChange(dateString);
    setTimeout(() => setShowDatePicker(false), 200);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    onTimeChange(time);
    setTimeout(() => setShowTimePicker(false), 150);
  };

  const formatSelectedDate = (date) => {
    if (!date) return '';
    // Fix timezone issue by creating date with explicit UTC parsing
    const [year, month, day] = date.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSelectedTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!selectedDate || !date) return false;
    // Fix date comparison by avoiding timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return selectedDate === dateString;
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getTimePeriod = (hour) => {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div ref={datePickerRef}>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Event Date {required && <span className="text-red-500 ml-1">*</span>}
          </div>
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`w-full px-4 py-3 text-left border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ${selectedDate 
              ? 'border-blue-500 ring-1 ring-blue-500' 
              : 'border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-md mr-3 ${
                  selectedDate 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-gray-50 text-gray-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  {selectedDate ? (
                    <div>
                      <div className="text-gray-900 font-medium">{formatSelectedDate(selectedDate)}</div>
                      <div className="text-xs text-gray-500">Selected</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-700">Select event date</div>
                      <div className="text-xs text-gray-400">Click to choose</div>
                    </div>
                  )}
                </div>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Calendar Dropdown */}
          {showDatePicker && (
            <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {/* Calendar Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => navigateMonth(-1)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-sm font-medium text-gray-900">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateMonth(1)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((date, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => date && !isPastDate(date) && handleDateChange(date)}
                      disabled={!date || isPastDate(date)}
                      className={`
                        h-8 w-8 text-sm font-medium rounded transition-colors relative flex items-center justify-center
                        ${!date ? 'invisible' : ''}
                        ${isPastDate(date) 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'hover:bg-gray-100 cursor-pointer text-gray-700'
                        }
                        ${isSelected(date) 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : ''
                        }
                        ${isToday(date) && !isSelected(date) 
                          ? 'bg-blue-50 text-blue-600 font-semibold' 
                          : ''
                        }
                      `}
                    >
                      {date?.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hidden native date input for form submission */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="sr-only"
            required={required}
          />
        </div>
      </div>

      {/* Time Selection */}
      <div ref={timePickerRef}>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Time {required && <span className="text-red-500 ml-1">*</span>}
          </div>
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTimePicker(!showTimePicker)}
            className={`w-full px-4 py-3 text-left border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ${selectedTime 
              ? 'border-blue-500 ring-1 ring-blue-500' 
              : 'border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-md mr-3 ${
                  selectedTime 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-gray-50 text-gray-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  {selectedTime ? (
                    <div>
                      <div className="text-gray-900 font-medium flex items-center">
                        <span className="text-xs text-gray-500 mr-2 px-2 py-0.5 bg-gray-100 rounded-full">
                          {getTimePeriod(parseInt(selectedTime.split(':')[0]))}
                        </span>
                        {formatSelectedTime(selectedTime)}
                      </div>
                      <div className="text-xs text-gray-500">Selected</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-700">Select start time</div>
                      <div className="text-xs text-gray-400">Click to choose</div>
                    </div>
                  )}
                </div>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showTimePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Time Dropdown */}
          {showTimePicker && (
            <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Select Time</h3>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {timeOptions.map((period) => (
                  <div key={period.label} className="border-b border-gray-50 last:border-b-0">
                    <div className="px-4 py-2 bg-gray-25">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          {period.label}
                        </h4>
                        <span className="text-xs text-gray-400">{period.range}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {period.times.map((time) => (
                        <button
                          key={time.value}
                          type="button"
                          onClick={() => handleTimeChange(time.value)}
                          className={`px-2 py-1.5 text-xs rounded transition-colors text-center ${selectedTime === time.value
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                          {time.display}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden native time input for form submission */}
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="sr-only"
            required={required}
          />
        </div>
      </div>

      {/* Summary Card */}
      {selectedDate && selectedTime && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start">
            <div className="p-2 bg-green-100 rounded-md mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h4 className="text-sm font-medium text-gray-900 mr-2">Schedule Confirmed</h4>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{formatSelectedDate(selectedDate)}</span>
                </div>

                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">{formatSelectedTime(selectedTime)}</span>
                  <span className="ml-2 text-xs text-gray-500 px-1.5 py-0.5 bg-gray-200 rounded">
                    {getTimePeriod(parseInt(selectedTime.split(':')[0]))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;