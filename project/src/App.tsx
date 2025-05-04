import React, { useState, useEffect } from 'react';
import { Note, TimeUnit, Filter, User } from './types';
import Navbar from './components/Navbar';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import Auth from './components/Auth';
import { Search, LogOut, User as UserIcon, Bell } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCount, setActiveCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleLogin = (userData: User) => {
    const nameFromEmail = userData.email.split('@')[0];
    setUser({
      ...userData,
      name: userData.name || nameFromEmail
    });
    addNotification(`Welcome back, ${userData.name || nameFromEmail}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setNotes([]);
    setNotifications([]);
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== message));
    }, 5000);
  };

  const calculateExpiryTime = (duration: number, unit: TimeUnit): number => {
    const now = Date.now();
    const multipliers: Record<TimeUnit, number> = {
      seconds: 1000,
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      months: 30 * 24 * 60 * 60 * 1000,
      years: 365 * 24 * 60 * 60 * 1000
    };
    return now + (duration * multipliers[unit]);
  };

  const addNote = (
    content: string,
    duration: number,
    unit: TimeUnit,
    category?: string,
    color?: string,
    priority?: 'low' | 'medium' | 'high',
    format?: any
  ) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content,
      createdAt: Date.now(),
      expiresAt: calculateExpiryTime(duration, unit),
      saved: false,
      category,
      color,
      priority,
      format
    };
    setNotes(prev => [...prev, newNote]);
    addNotification('Note created successfully');
  };

  const updateNote = (
    id: string,
    content: string,
    duration: number,
    unit: TimeUnit,
    category?: string,
    color?: string,
    priority?: 'low' | 'medium' | 'high',
    format?: any
  ) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? {
            ...note,
            content,
            expiresAt: calculateExpiryTime(duration, unit),
            category,
            color,
            priority,
            format
          }
        : note
    ));
    setEditingNote(null);
    addNotification('Note updated successfully');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    addNotification('Note deleted');
  };

  const toggleSaveNote = (id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, saved: !note.saved }
        : note
    ));
    addNotification('Note saved status updated');
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
  };

  const cancelEditing = () => {
    setEditingNote(null);
  };

  const isNoteActive = (note: Note): boolean => {
    const now = Date.now();
    return !note.saved && note.expiresAt > now;
  };

  const filteredNotes = notes
    .filter(note => {
      const now = Date.now();
      if (filter === 'saved') return note.saved;
      if (filter === 'active') return isNoteActive(note);
      return true;
    })
    .filter(note => 
      searchTerm === '' || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const expiredNotes = notes.filter(note => !note.saved && note.expiresAt <= now);
      if (expiredNotes.length > 0) {
        addNotification(`${expiredNotes.length} note(s) expired`);
      }
      setNotes(prev => prev.filter(note => note.expiresAt > now || note.saved));
      
      const activeNotes = notes.filter(isNoteActive);
      setActiveCount(activeNotes.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [notes]);

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const userName = user.name ? user.name.split(' ')[0] : 'User';

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10">
        <Navbar 
          filter={filter} 
          onFilterChange={setFilter}
          savedCount={notes.filter(note => note.saved).length}
          activeCount={activeCount}
        />
        
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-lg animate-fade-in max-w-sm"
            >
              {notification}
            </div>
          ))}
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Welcome, {userName}</h1>
                  <p className="text-gray-500 mt-1">You have {activeCount} active notes</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search notes by content or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <NoteForm 
                onSubmit={addNote} 
                editingNote={editingNote}
                onUpdate={updateNote}
                onCancel={cancelEditing}
              />
            </div>

            <div className="mt-12">
              <NoteList 
                notes={filteredNotes} 
                onDelete={deleteNote}
                onEdit={startEditing}
                onToggleSave={toggleSaveNote}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;