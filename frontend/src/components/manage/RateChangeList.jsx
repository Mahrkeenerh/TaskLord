import React from 'react';
import { Plus, X } from 'lucide-react';

export const RateChangeList = ({ rateChanges, onChange, photoMode }) => {
    // Create indexed array, then sort for display
    const indexedRates = rateChanges.map((rate, index) => ({ ...rate, _index: index }));
    const sortedRates = [...indexedRates].sort((a, b) => {
        if (a.effective_date === null) return -1;
        if (b.effective_date === null) return 1;
        return a.effective_date.localeCompare(b.effective_date);
    });

    const handleAddRate = () => {
        const today = new Date().toISOString().split('T')[0];
        onChange([...rateChanges, { hourly_rate: '', effective_date: today }]);
    };

    const handleUpdateRate = (index, field, value) => {
        const updated = rateChanges.map((r, i) => {
            if (i === index) {
                return { ...r, [field]: value };
            }
            return r;
        });
        onChange(updated);
    };

    const handleDeleteRate = (index) => {
        if (rateChanges.length <= 1) {
            alert('Cannot delete the only rate');
            return;
        }
        onChange(rateChanges.filter((_, i) => i !== index));
    };

    const canDelete = rateChanges.length > 1;

    return (
        <div className="space-y-2">
            {sortedRates.map((rate) => (
                <div
                    key={rate._index}
                    className={`flex items-center gap-2 p-2 rounded ${
                        photoMode ? 'bg-gray-100' : 'bg-gray-600'
                    }`}
                >
                    <div className="flex-1">
                        {rate.effective_date === null ? (
                            <span className={`text-sm ${photoMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                Original
                            </span>
                        ) : (
                            <input
                                type="date"
                                value={rate.effective_date}
                                onChange={(e) => handleUpdateRate(rate._index, 'effective_date', e.target.value)}
                                className={`text-sm ${
                                    photoMode
                                        ? 'bg-white border border-gray-200 rounded p-1 text-gray-800'
                                        : 'bg-gray-700 rounded p-1'
                                }`}
                            />
                        )}
                    </div>
                    <input
                        type="number"
                        step="1"
                        value={rate.hourly_rate}
                        onChange={(e) => handleUpdateRate(rate._index, 'hourly_rate', e.target.value)}
                        placeholder="Rate"
                        className={`w-20 ${
                            photoMode
                                ? 'bg-white border border-gray-200 rounded p-1 text-gray-800'
                                : 'bg-gray-700 rounded p-1'
                        }`}
                        required
                    />
                    <span className={`text-sm ${photoMode ? 'text-gray-600' : 'text-gray-400'}`}>€/h</span>
                    {canDelete && rate.effective_date !== null && (
                        <button
                            type="button"
                            onClick={() => handleDeleteRate(rate._index)}
                            className="text-red-500 hover:text-red-400 p-1"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddRate}
                className={`flex items-center gap-1 text-sm ${
                    photoMode ? 'text-blue-600' : 'text-blue-400'
                } hover:underline`}
            >
                <Plus size={14} />
                Add rate change
            </button>
        </div>
    );
};
