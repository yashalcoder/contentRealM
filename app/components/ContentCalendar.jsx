"use client"
import { useState } from "react"

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Sample calendar data
  const calendarEvents = {
    "2024-01-15": [
      { type: "Instagram Reel", title: "Morning Motivation", time: "9:00 AM", status: "scheduled" },
      { type: "LinkedIn Post", title: "Leadership Tips", time: "2:00 PM", status: "scheduled" },
    ],
    "2024-01-16": [
      { type: "YouTube Short", title: "Quick Win Strategy", time: "10:00 AM", status: "draft" },
      { type: "Blog Post", title: "Content Marketing Guide", time: "3:00 PM", status: "scheduled" },
    ],
    "2024-01-17": [{ type: "Twitter Thread", title: "Industry Insights", time: "11:00 AM", status: "published" }],
    "2024-01-18": [
      { type: "Email Newsletter", title: "Weekly Roundup", time: "8:00 AM", status: "scheduled" },
      { type: "Instagram Story", title: "Behind the Scenes", time: "4:00 PM", status: "draft" },
    ],
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getEventsForDate = (day) => {
    if (!day) return []
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    return calendarEvents[dateKey] || []
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Content Calendar</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 text-muted-foreground hover:text-primary-foreground rounded-lg hover:bg-secondary"
          >
            ←
          </button>
          <h4 className="text-lg font-medium text-white min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 text-muted-foreground hover:text-primary-foreground rounded-lg hover:bg-secondary"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {getDaysInMonth(currentDate).map((day, index) => {
          const events = getEventsForDate(day)
          const hasEvents = events.length > 0
          const isToday =
            day &&
            new Date().getDate() === day &&
            new Date().getMonth() === currentDate.getMonth() &&
            new Date().getFullYear() === currentDate.getFullYear()

          return (
            <div
              key={index}
              className={`min-h-[80px] p-1 border border-border rounded-lg cursor-pointer transition-colors ${
                day ? "hover:bg-secondary" : ""
              } ${isToday ? "bg-primary/10 border-primary" : ""}`}
              onClick={() => day && setSelectedDate(day)}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-white"}`}>{day}</div>
                  <div className="space-y-1">
                    {events.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`text-xs p-1 rounded text-center truncate ${
                          event.status === "scheduled"
                            ? "bg-green-900/30 text-green-300"
                            : event.status === "draft"
                              ? "bg-yellow-900/30 text-yellow-300"
                              : "bg-blue-900/30 text-blue-300"
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">+{events.length - 2} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-900/30 rounded"></div>
          <span className="text-muted-foreground">Scheduled</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-900/30 rounded"></div>
          <span className="text-muted-foreground">Draft</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-900/30 rounded"></div>
          <span className="text-muted-foreground">Published</span>
        </div>
      </div>
    </div>
  )
}
