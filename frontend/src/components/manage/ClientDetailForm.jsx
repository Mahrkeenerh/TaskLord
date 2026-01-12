import React from 'react';
import { Trash2 } from 'lucide-react';
import { Input, Button, Label } from './StyledComponents';

export const ClientDetailForm = ({
    formData,
    setFormData,
    photoMode,
    onSubmit,
    onCancel,
    onDelete,
    onLogoChange,
    isEditing
}) => (
    <form onSubmit={onSubmit} className="p-4 space-y-4">
        <div className="flex justify-between items-center">
            <h3 className={`font-medium ${photoMode ? "text-gray-800" : ""}`}>
                {isEditing ? 'Edit Client' : 'New Client'}
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
            <Label photoMode={photoMode}>Client Name</Label>
            <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                photoMode={photoMode}
                required
            />
        </div>

        <div>
            <Label photoMode={photoMode}>Client Logo</Label>
            <Input
                type="file"
                accept="image/*"
                onChange={onLogoChange}
                photoMode={photoMode}
            />
            {formData.logo_path && (
                <div className="mt-2 flex items-center gap-2">
                    <img
                        src={formData.logo_path}
                        alt="Logo preview"
                        className="h-16 object-contain"
                    />
                </div>
            )}
        </div>

        <div className="flex space-x-3 pt-2">
            <Button type="submit" photoMode={photoMode} className="flex-1">
                {isEditing ? 'Save Changes' : 'Create Client'}
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
