import React from 'react';
import { Trash2 } from 'lucide-react';
import { Input, Button, Label } from './StyledComponents';
import { CollapsibleRateHistory } from './CollapsibleRateHistory';

export const ProjectDetailForm = ({
    formData,
    setFormData,
    clients,
    photoMode,
    onSubmit,
    onCancel,
    onDelete,
    isEditing
}) => (
    <form onSubmit={onSubmit} className="p-4 space-y-4">
        <div className="flex justify-between items-center">
            <h3 className={`font-medium ${photoMode ? "text-gray-800" : ""}`}>
                {isEditing ? 'Edit Project' : 'New Project'}
            </h3>
            {isEditing && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm"
                >
                    <Trash2 size={14} />
                    Delete
                </button>
            )}
        </div>

        <div>
            <Label photoMode={photoMode}>Client</Label>
            <select
                value={formData.client_id}
                onChange={e => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                className={`w-full rounded-lg p-2 ${
                    photoMode
                        ? "bg-white border border-gray-200 text-gray-800"
                        : "bg-gray-700"
                }`}
                required
            >
                <option value="">Select a client</option>
                {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                ))}
            </select>
        </div>

        <div>
            <Label photoMode={photoMode}>Project Name</Label>
            <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                photoMode={photoMode}
                required
            />
        </div>

        <div>
            <Label photoMode={photoMode}>Color</Label>
            <Input
                type="color"
                value={formData.color}
                onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="h-10 p-1 cursor-pointer"
                photoMode={photoMode}
            />
        </div>

        <CollapsibleRateHistory
            rateChanges={formData.rate_changes || [{ hourly_rate: '', effective_date: null }]}
            onChange={(newRates) => setFormData(prev => ({ ...prev, rate_changes: newRates }))}
            photoMode={photoMode}
        />

        <div className="flex space-x-3 pt-2">
            <Button type="submit" photoMode={photoMode} className="flex-1">
                {isEditing ? 'Save Changes' : 'Create Project'}
            </Button>
            <Button
                type="button"
                variant="secondary"
                photoMode={photoMode}
                onClick={onCancel}
                className="flex-1"
            >
                Cancel
            </Button>
        </div>
    </form>
);
