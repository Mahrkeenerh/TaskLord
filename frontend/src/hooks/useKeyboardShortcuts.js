import { useEffect } from 'react';
import { parseDate, formatDate } from '../utils/dateHelpers';

export const useKeyboardShortcuts = (
    isManageWindowActive,
    isTaskWindowActive,
    setIsManageWindowActive,
    setIsTaskWindowActive,
    setSelectedDate
) => {
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (isManageWindowActive) {
                if (e.key === 'Escape') {
                    setIsManageWindowActive(false);
                }
                return;
            }
            if (isTaskWindowActive) {
                if (e.key === 'Escape') {
                    setIsTaskWindowActive(false);
                }
                return;
            }

            const keyHandlers = {
                'A': () => e.shiftKey && setIsTaskWindowActive(true),
                'ArrowLeft': () => updateSelectedDate(-1),
                'ArrowRight': () => updateSelectedDate(1),
                'ArrowUp': () => updateSelectedDate(-7),
                'ArrowDown': () => updateSelectedDate(7)
            };

            const handler = keyHandlers[e.key];
            if (handler) handler();
        };

        const updateSelectedDate = (days) => {
            setSelectedDate(prev => {
                const date = parseDate(prev);
                date.setDate(date.getDate() + days);
                return formatDate(date);
            });
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isManageWindowActive, isTaskWindowActive, setIsManageWindowActive, setIsTaskWindowActive, setSelectedDate]);
};
