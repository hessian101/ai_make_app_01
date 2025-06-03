import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, BookOpen } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';

interface HeaderProps {
  onAddNew: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddNew }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { filterOptions, setFilterOptions } = useBookmarkStore();
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({ search: e.target.value });
  };

  const clearSearch = () => {
    setFilterOptions({ search: '' });
  };

  const handleSortChange = (sortBy: typeof filterOptions.sortBy, sortDirection: typeof filterOptions.sortDirection) => {
    setFilterOptions({ sortBy, sortDirection });
    setSortMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <BookOpen size={28} className="text-primary-600 mr-2" />
          <h1 className="text-xl font-bold text-primary-800 hidden sm:block">BookShelf</h1>
        </div>

        {/* Search and actions - responsive layout */}
        <div className={`flex items-center ${isSearchExpanded ? 'flex-1 mx-4' : ''}`}>
          {/* Search */}
          <div className={`relative ${isSearchExpanded ? 'w-full' : 'w-auto'}`}>
            <div className="relative flex items-center">
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className={`p-2 text-gray-500 ${isSearchExpanded ? 'hidden sm:block' : 'block'}`}
              >
                <Search size={20} />
              </button>
              {(isSearchExpanded || window.innerWidth > 640) && (
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={filterOptions.search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                />
              )}
              {isSearchExpanded && (
                <div className="absolute right-2 flex items-center">
                  {filterOptions.search && (
                    <button 
                      onClick={clearSearch} 
                      className="text-gray-400 hover:text-gray-600 mr-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => setIsSearchExpanded(false)}
                    className="text-gray-400 hover:text-gray-600 sm:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                {!isSearchExpanded && <Search size={16} />}
              </div>
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="relative ml-2">
            <button 
              className="p-2 text-gray-600 hover:text-primary-600 rounded-md hover:bg-gray-100"
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
            >
              <SlidersHorizontal size={20} />
            </button>
            
            {sortMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">Sort by</div>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${filterOptions.sortBy === 'createdAt' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'}`}
                  onClick={() => handleSortChange('createdAt', 'desc')}
                >
                  Newest First
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${filterOptions.sortBy === 'createdAt' && filterOptions.sortDirection === 'asc' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'}`}
                  onClick={() => handleSortChange('createdAt', 'asc')}
                >
                  Oldest First
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${filterOptions.sortBy === 'title' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'}`}
                  onClick={() => handleSortChange('title', 'asc')}
                >
                  Title A-Z
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left ${filterOptions.sortBy === 'viewCount' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'}`}
                  onClick={() => handleSortChange('viewCount', 'desc')}
                >
                  Most Viewed
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add button */}
        <button 
          onClick={onAddNew}
          className="btn-primary flex items-center"
          aria-label="Add new bookmark"
        >
          <span className="mr-1">+</span> Add New
        </button>
      </div>
    </header>
  );
};

export default Header;