import React from 'react';
import { NotebookPen, Archive, Clock, Settings } from 'lucide-react';
import { Filter } from '../types';

interface NavbarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  savedCount: number;
  activeCount: number;
}

export default function Navbar({ filter, onFilterChange, savedCount, activeCount }: NavbarProps) {
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <NotebookPen className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Ephemeral Notes</span>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onFilterChange('saved')}
              className={`flex items-center transition-colors ${
                filter === 'saved' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Archive className="h-5 w-5 mr-1" />
              <span>Saved</span>
              <span className="ml-1 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {savedCount}
              </span>
            </button>
            <button 
              onClick={() => onFilterChange('active')}
              className={`flex items-center transition-colors ${
                filter === 'active' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Clock className="h-5 w-5 mr-1" />
              <span>Active</span>
              <span className="ml-1 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {activeCount}
              </span>
            </button>
            <button 
              onClick={() => onFilterChange('all')}
              className={`flex items-center transition-colors ${
                filter === 'all' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Settings className="h-5 h-5 mr-1" />
              <span>All</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}