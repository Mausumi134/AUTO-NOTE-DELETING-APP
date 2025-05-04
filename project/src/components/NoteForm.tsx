import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Hash, Palette, AlertTriangle, Bold, Italic, Underline } from 'lucide-react';
import { TimeUnit, Note, CATEGORIES, COLORS, MAX_CHARS } from '../types';

interface NoteFormProps {
  onSubmit: (content: string, duration: number, unit: TimeUnit, category?: string, color?: string, priority?: 'low' | 'medium' | 'high', format?: any) => void;
  onUpdate?: (id: string, content: string, duration: number, unit: TimeUnit, category?: string, color?: string, priority?: 'low' | 'medium' | 'high', format?: any) => void;
  onCancel?: () => void;
  editingNote: Note | null;
}

export default function NoteForm({ onSubmit, onUpdate, onCancel, editingNote }: NoteFormProps) {
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(1);
  const [unit, setUnit] = useState<TimeUnit>('hours');
  const [category, setCategory] = useState<string>('');
  const [color, setColor] = useState<string>('default');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [format, setFormat] = useState({ bold: false, italic: false, underline: false });
  const [charCount, setCharCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setContent(editingNote.content);
      setCategory(editingNote.category || '');
      setColor(editingNote.color || 'default');
      setPriority(editingNote.priority || 'medium');
      setFormat(editingNote.format || { bold: false, italic: false, underline: false });
      const remaining = Math.ceil((editingNote.expiresAt - Date.now()) / 1000);
      if (remaining > 0) {
        setDuration(remaining);
        setUnit('seconds');
      }
    }
  }, [editingNote]);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      if (editingNote && onUpdate) {
        onUpdate(editingNote.id, content, duration, unit, category, color, priority, format);
      } else {
        onSubmit(content, duration, unit, category, color, priority, format);
      }
      setContent('');
      setDuration(1);
      setUnit('hours');
      setCategory('');
      setColor('default');
      setPriority('medium');
      setFormat({ bold: false, italic: false, underline: false });
    }
  };

  const toggleFormat = (type: 'bold' | 'italic' | 'underline') => {
    setFormat(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const getFormattedContent = () => {
    let formatted = content;
    if (format.bold) formatted = `**${formatted}**`;
    if (format.italic) formatted = `_${formatted}_`;
    if (format.underline) formatted = `__${formatted}__`;
    return formatted;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          onClick={() => toggleFormat('bold')}
          className={`p-2 rounded ${format.bold ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('italic')}
          className={`p-2 rounded ${format.italic ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => toggleFormat('underline')}
          className={`p-2 rounded ${format.underline ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
        >
          <Underline className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setContent(e.target.value);
            }
          }}
          placeholder="Write your note here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {charCount}/{MAX_CHARS}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as TimeUnit)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-gray-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-gray-400" />
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-gray-400" />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="flex-grow"></div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {editingNote ? (
              <>
                <Save className="w-5 h-5 mr-2" />
                Update Note
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Add Note
              </>
            )}
          </button>
          {editingNote && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Preview:</h3>
          <div className="whitespace-pre-wrap">{getFormattedContent()}</div>
        </div>
      )}
    </form>
  );
}