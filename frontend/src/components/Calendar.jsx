import React, { useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, parseDate } from '../utils/dateHelpers';

const CalendarHeader = ({ currentMonth, onMonthChange, photoMode }) => (
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
            {currentMonth.toLocaleString('default', {
                month: 'long',
                year: 'numeric'
            })}
        </h2>
        {!photoMode && (
            <div className="flex space-x-2">
                <button
                    onClick={() => onMonthChange(-1)}
                    className="p-2 rounded-lg border border-gray-800 hover:bg-gray-600"
                    aria-label="Previous month"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => onMonthChange(1)}
                    className="p-2 rounded-lg border border-gray-800 hover:bg-gray-600"
                    aria-label="Next month"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        )}
    </div>
);

const CalendarDay = ({ date, tasks, isSelected, isToday, onClick, photoMode, projects }) => {
    if (!date) {
        return (
            <div
                className={`aspect-square ${photoMode
                    ? 'border border-gray-100 bg-gray-50'
                    : 'border border-gray-700 bg-gray-700 bg-opacity-25'
                    } rounded`}
            />
        );
    }

    return (
        <button
            onClick={onClick}
            className={`aspect-square ${photoMode
                ? 'border border-gray-200'
                : 'border border-gray-700'
                } p-2 rounded relative ${isSelected && !photoMode
                    ? 'bg-blue-600 text-white hover:bg-blue-600'
                    : isToday && !photoMode ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-gray-600'
                }`}
        >
            <span className="absolute top-1 left-2">{date.getDate()}</span>
            {isToday && !photoMode && (
                <span className="absolute top-1 right-2 text-xs text-gray-400">Today</span>
            )}
            <div className="mt-6 space-y-1">
                {tasks.map((task) => {
                    const project = projects.find(p => p.id === task.project_id);
                    return (
                        <div
                            key={task.id}
                            className="text-xs truncate px-1 py-0.5 rounded text-white"
                            style={{ backgroundColor: project?.color || '#FF0000' }}
                            title={task.notes ? `${task.title} - ${task.notes}` : task.title}
                        >
                            {task.title}: {task.hours}h
                        </div>
                    );
                })}
            </div>
        </button>
    );
};

export const Calendar = ({
    selectedDate,
    setSelectedDate,
    tasks,
    projects,
    filter,
    photoMode
}) => {
    const [currentMonth, setCurrentMonth] = React.useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    useEffect(() => {
        const date = parseDate(selectedDate);
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }, [selectedDate]);

    // Memoized calendar data calculations
    const { weeks, today } = useMemo(() => {
        const daysInMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
        ).getDate();

        const firstDayOfMonth = (new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
        ).getDay() + 6) % 7;

        const weeks = [];
        let days = [];
        let day = 1;

        // Fill in empty days at start
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        // Fill in days of the month
        while (day <= daysInMonth) {
            days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
            if (days.length === 7) {
                weeks.push(days);
                days = [];
            }
            day++;
        }

        // Fill in empty days at end
        if (days.length > 0) {
            while (days.length < 7) {
                days.push(null);
            }
            weeks.push(days);
        }

        return {
            weeks,
            today: formatDate(new Date())
        };
    }, [currentMonth]);

    // Memoized task filtering function
    const getTasksForDay = useMemo(() => (date) => {
        if (!date) return [];
        const dateString = formatDate(date);
        return tasks.filter(task => {
            if (filter.project && task.project_id !== filter.project) return false;
            if (filter.client) {
                const project = projects.find(p => p.id === task.project_id);
                if (project && project.client_id !== filter.client) return false;
            }
            return task.date === dateString;
        });
    }, [tasks, filter, projects]);

    const handleMonthChange = (direction) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentMonth(newDate);
        setSelectedDate(formatDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1)));
    };

    return (
        <div className={`${photoMode ? 'bg-white' : 'bg-gray-800'} rounded-lg p-6`}>
            <CalendarHeader
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                photoMode={photoMode}
            />

            <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div
                        key={day}
                        className={`text-center ${photoMode ? 'text-gray-600' : 'text-gray-400'
                            } font-medium py-2`}
                    >
                        {day}
                    </div>
                ))}

                {weeks.map((week, weekIndex) => (
                    <React.Fragment key={weekIndex}>
                        {week.map((date, dayIndex) => (
                            <CalendarDay
                                key={date ? date.getTime() : `empty-${dayIndex}`}
                                date={date}
                                tasks={date ? getTasksForDay(date) : []}
                                isSelected={date && formatDate(date) === selectedDate}
                                isToday={date && formatDate(date) === today}
                                onClick={() => date && setSelectedDate(formatDate(date))}
                                photoMode={photoMode}
                                projects={projects}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
