import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RateChangeList } from './RateChangeList';

export const CollapsibleRateHistory = ({ rateChanges, onChange, photoMode }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const rateCount = rateChanges.length;

    return (
        <div className={`rounded-lg overflow-hidden ${photoMode ? 'bg-gray-100' : 'bg-gray-700'}`}>
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full flex items-center justify-between p-3 ${
                    photoMode ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-200 hover:bg-gray-600'
                } transition-colors`}
            >
                <span className="text-sm font-medium">
                    Rate History ({rateCount} {rateCount === 1 ? 'rate' : 'rates'})
                </span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isExpanded && (
                <div className="p-3 pt-0">
                    <RateChangeList
                        rateChanges={rateChanges}
                        onChange={onChange}
                        photoMode={photoMode}
                    />
                </div>
            )}
        </div>
    );
};
