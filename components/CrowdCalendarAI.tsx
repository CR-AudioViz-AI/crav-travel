'use client'

import { useState } from 'react'
import {
  Calendar, Users, TrendingUp, TrendingDown, Sun, CloudRain,
  Star, Clock, AlertCircle, ChevronLeft, ChevronRight, Info,
  DollarSign, Sparkles, Target, Thermometer
} from 'lucide-react'

interface DayForecast {
  date: string
  crowdLevel: number // 1-10
  parks: ParkCrowd[]
  weather: { high: number; low: number; rain: number; condition: string }
  events: string[]
  priceLevel: 'value' | 'regular' | 'peak'
  recommendation: string
}

interface ParkCrowd {
  name: string
  icon: string
  level: number
  bestTime: string
  worstTime: string
  waitTimes: { ride: string; wait: number }[]
}

const MONTH_DATA: DayForecast[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1
  const date = `2025-03-${day.toString().padStart(2, '0')}`
  const isWeekend = [1, 2, 8, 9, 15, 16, 22, 23, 29, 30].includes(day)
  const isSpringBreak = day >= 15 && day <= 22
  const crowdLevel = isSpringBreak ? Math.floor(Math.random() * 2) + 8 : isWeekend ? Math.floor(Math.random() * 3) + 6 : Math.floor(Math.random() * 4) + 2
  
  return {
    date,
    crowdLevel,
    parks: [
      { name: 'Magic Kingdom', icon: '🏰', level: crowdLevel + Math.floor(Math.random() * 2) - 1, bestTime: '8-10 AM', worstTime: '12-3 PM', waitTimes: [{ ride: 'Seven Dwarfs', wait: crowdLevel * 8 }, { ride: 'Space Mountain', wait: crowdLevel * 6 }] },
      { name: 'EPCOT', icon: '🌐', level: Math.max(1, crowdLevel - 1), bestTime: '9-11 AM', worstTime: '2-5 PM', waitTimes: [{ ride: 'Guardians', wait: crowdLevel * 7 }, { ride: 'Test Track', wait: crowdLevel * 5 }] },
      { name: 'Hollywood Studios', icon: '🎬', level: Math.min(10, crowdLevel + 1), bestTime: '7-9 AM', worstTime: '11 AM-2 PM', waitTimes: [{ ride: 'Rise of Resistance', wait: crowdLevel * 10 }, { ride: 'Slinky Dog', wait: crowdLevel * 8 }] },
      { name: 'Animal Kingdom', icon: '🦁', level: Math.max(1, crowdLevel - 2), bestTime: '8-10 AM', worstTime: '11 AM-1 PM', waitTimes: [{ ride: 'Flight of Passage', wait: crowdLevel * 9 }, { ride: 'Everest', wait: crowdLevel * 4 }] },
    ],
    weather: { high: 75 + Math.floor(Math.random() * 15), low: 55 + Math.floor(Math.random() * 10), rain: Math.floor(Math.random() * 40), condition: Math.random() > 0.7 ? 'Partly Cloudy' : 'Sunny' },
    events: isSpringBreak ? ['Spring Break Peak'] : day === 17 ? ['St. Patrick\'s Day'] : [],
    priceLevel: isSpringBreak ? 'peak' : isWeekend ? 'regular' : 'value',
    recommendation: crowdLevel <= 3 ? 'Excellent day to visit! Low crowds expected.' : crowdLevel <= 6 ? 'Good day to visit with moderate crowds.' : crowdLevel <= 8 ? 'Consider rope dropping or evening visits.' : 'Very crowded. Plan strategically or consider another day.'
  }
})

export default function CrowdCalendarAI() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2, 1)) // March 2025
  const [selectedDate, setSelectedDate] = useState<DayForecast | null>(MONTH_DATA[14])
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  const getCrowdColor = (level: number) => {
    if (level <= 3) return 'bg-green-500'
    if (level <= 5) return 'bg-yellow-500'
    if (level <= 7) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getCrowdBgColor = (level: number) => {
    if (level <= 3) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (level <= 5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    if (level <= 7) return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const getCrowdLabel = (level: number) => {
    if (level <= 2) return 'Ghost Town'
    if (level <= 3) return 'Low'
    if (level <= 5) return 'Moderate'
    if (level <= 7) return 'High'
    if (level <= 9) return 'Very High'
    return 'Extreme'
  }

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'value': return 'text-green-400'
      case 'regular': return 'text-yellow-400'
      case 'peak': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Crowd Calendar</h1>
            <p className="text-indigo-200">Predict crowds & plan the perfect visit</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { level: '1-3', label: 'Low', color: 'bg-green-500' },
            { level: '4-5', label: 'Moderate', color: 'bg-yellow-500' },
            { level: '6-7', label: 'High', color: 'bg-orange-500' },
            { level: '8-10', label: 'Extreme', color: 'bg-red-500' },
          ].map(item => (
            <div key={item.level} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${item.color}`} />
              <span className="text-sm text-white">{item.label} ({item.level})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-700 p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-gray-800 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-gray-800 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm text-gray-400 py-2">{day}</div>
            ))}

            {/* Empty cells for first week */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days */}
            {MONTH_DATA.slice(0, daysInMonth).map((day, i) => (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square p-1 rounded-lg transition-all hover:ring-2 hover:ring-blue-500 ${
                  selectedDate?.date === day.date ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className={`h-full rounded-lg ${getCrowdColor(day.crowdLevel)} bg-opacity-20 flex flex-col items-center justify-center`}>
                  <span className="text-sm font-medium">{i + 1}</span>
                  <div className={`w-6 h-1.5 rounded-full mt-1 ${getCrowdColor(day.crowdLevel)}`} />
                  {day.events.length > 0 && <span className="text-xs mt-0.5">⭐</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="space-y-4">
          {selectedDate ? (
            <>
              {/* Day Overview */}
              <div className={`rounded-xl border p-4 ${getCrowdBgColor(selectedDate.crowdLevel)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">
                    {new Date(selectedDate.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCrowdBgColor(selectedDate.crowdLevel)}`}>
                    {selectedDate.crowdLevel}/10
                  </span>
                </div>
                <p className="text-2xl font-bold mb-2">{getCrowdLabel(selectedDate.crowdLevel)}</p>
                <p className="text-sm opacity-80">{selectedDate.recommendation}</p>

                {selectedDate.events.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    {selectedDate.events.map((event, i) => (
                      <span key={i} className="text-sm">⭐ {event}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Weather */}
              <div className="bg-gray-900 rounded-xl border border-gray-700 p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-400" /> Weather Forecast
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{selectedDate.weather.high}°F</p>
                    <p className="text-sm text-gray-400">Low: {selectedDate.weather.low}°F</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg">{selectedDate.weather.condition}</p>
                    <p className="text-sm text-gray-400">{selectedDate.weather.rain}% rain</p>
                  </div>
                </div>
              </div>

              {/* Ticket Price */}
              <div className="bg-gray-900 rounded-xl border border-gray-700 p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" /> Ticket Pricing
                </h4>
                <p className={`text-lg font-bold capitalize ${getPriceColor(selectedDate.priceLevel)}`}>
                  {selectedDate.priceLevel} Season
                </p>
              </div>

              {/* Park Breakdown */}
              <div className="bg-gray-900 rounded-xl border border-gray-700 p-4">
                <h4 className="font-semibold mb-3">Park by Park</h4>
                <div className="space-y-3">
                  {selectedDate.parks.map(park => (
                    <div key={park.name} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2">
                          <span>{park.icon}</span>
                          <span className="text-sm font-medium">{park.name}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getCrowdBgColor(park.level)}`}>
                          {park.level}/10
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <div>
                          <span className="text-green-400">Best:</span> {park.bestTime}
                        </div>
                        <div>
                          <span className="text-red-400">Avoid:</span> {park.worstTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a date to see crowd predictions</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-indigo-300">AI Best Days This Month</h4>
            <p className="text-sm text-gray-300 mt-1">
              Based on crowd predictions, weather, and pricing: <strong>March 4-6</strong> and <strong>March 11-13</strong> 
              offer the best combination of low crowds and value pricing. Avoid March 15-22 (Spring Break peak).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
