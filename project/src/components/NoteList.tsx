import React, { useState } from 'react';
import { Trash2, Clock, Bookmark, BookmarkCheck, Edit2, Hash, ArrowUpDown } from 'lucide-react';
import { Note, SortOption } from '../types';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onToggleSave: (id: string) => void;
}

export default function NoteList({ notes, onDelete, onEdit, onToggleSave }: NoteListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('created');

  const getTimeLeft = (expiresAt: number) => {
    const now = Date.now();
    const timeLeft = expiresAt - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const seconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    if (minutes > 0) return `${minutes}m left`;
    return `${seconds}s left`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      Personal: 'bg-blue-100 text-blue-800',
      Work: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-green-100 text-green-800',
      Ideas: 'bg-yellow-100 text-yellow-800',
      Tasks: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return category ? colors[category] : 'bg-gray-100 text-gray-800';
  };

  const getNoteColor = (color: string = 'default') => {
    const colors: Record<string, string> = {
      default: 'bg-white',
      red: 'bg-red-50',
      yellow: 'bg-yellow-50',
      green: 'bg-green-50',
      blue: 'bg-blue-50',
      purple: 'bg-purple-50'
    };
    return colors[color];
  };

  const getPriorityColor = (priority: string = 'medium') => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-yellow-100 text-yellow-600',
      high: 'bg-red-100 text-red-600'
    };
    return colors[priority];
  };

  const sortNotes = (notes: Note[]): Note[] => {
    return [...notes].sort((a, b) => {
      switch (sortBy) {
        case 'expiry':
          return a.expiresAt - b.expiresAt;
        case 'priority':
          const priorityWeight = { low: 0, medium: 1, high: 2 };
          return (priorityWeight[b.priority || 'medium'] - priorityWeight[a.priority || 'medium']);
        default:
          return b.createdAt - a.createdAt;
      }
    });
  };

  const formatContent = (note: Note) => {
    let formattedContent = note.content;
    const styles = [];
    
    if (note.format?.bold) {
      styles.push('font-bold');
    }
    if (note.format?.italic) {
      styles.push('italic');
    }
    if (note.format?.underline) {
      styles.push('underline');
    }
    
    return (
      <span className={styles.join(' ')}>
        {formattedContent}
      </span>
    );
  };

  const sortedNotes = sortNotes(notes);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <div className="inline-flex items-center space-x-2 bg-white rounded-lg shadow-sm px-4 py-2">
          <ArrowUpDown className="w-5 h-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm text-gray-600 bg-transparent border-none focus:ring-0"
          >
            <option value="created">Sort by Created Date</option>
            <option value="expiry">Sort by Expiry Time</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className={`${getNoteColor(note.color)} rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <button 
                  onClick={() => onToggleSave(note.id)}
                  className={`transition-colors ${note.saved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                  {note.saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeLeft(note.expiresAt)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {note.category && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                      <Hash className="w-3 h-3 mr-1" />
                      {note.category}
                    </span>
                  )}
                  {note.priority && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                      {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)} Priority
                    </span>
                  )}
                </div>

                <div className="text-gray-800 whitespace-pre-wrap">
                  {formatContent(note)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {formatDate(note.createdAt)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(note)}
                    className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
                    title="Edit note"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl">
            <p className="text-gray-500 text-lg text-center">No notes yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}