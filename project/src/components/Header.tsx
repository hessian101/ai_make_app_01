import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, BookOpen, Plus } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';
import UserMenu from './UserMenu';

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
    <header className="header-container">
      <div className="header-content">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-icon">
            <BookOpen size={32} className="text-primary-600" />
          </div>
          <div className="logo-text">
            <h1 className="logo-title">BookShelf</h1>
            <p className="logo-subtitle">ブックマーク管理</p>
          </div>
        </div>

        {/* Search and actions */}
        <div className={`search-section ${isSearchExpanded ? 'expanded' : ''}`}>
          {/* Search */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="ブックマークを検索..."
                value={filterOptions.search}
                onChange={handleSearchChange}
                className="search-input"
              />
              {filterOptions.search && (
                <button 
                  onClick={clearSearch} 
                  className="clear-search-btn"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="sort-dropdown">
            <button 
              className="sort-btn"
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
            >
              <SlidersHorizontal size={20} />
            </button>
            
            {sortMenuOpen && (
              <div className="sort-menu">
                <div className="sort-menu-header">並び替え</div>
                <button 
                  className={`sort-option ${filterOptions.sortBy === 'createdAt' && filterOptions.sortDirection === 'desc' ? 'active' : ''}`}
                  onClick={() => handleSortChange('createdAt', 'desc')}
                >
                  新しい順
                </button>
                <button 
                  className={`sort-option ${filterOptions.sortBy === 'createdAt' && filterOptions.sortDirection === 'asc' ? 'active' : ''}`}
                  onClick={() => handleSortChange('createdAt', 'asc')}
                >
                  古い順
                </button>
                <button 
                  className={`sort-option ${filterOptions.sortBy === 'title' ? 'active' : ''}`}
                  onClick={() => handleSortChange('title', 'asc')}
                >
                  タイトル順
                </button>
                <button 
                  className={`sort-option ${filterOptions.sortBy === 'viewCount' ? 'active' : ''}`}
                  onClick={() => handleSortChange('viewCount', 'desc')}
                >
                  閲覧回数順
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Add button */}
          <button 
            onClick={onAddNew}
            className="add-btn"
            aria-label="新しいブックマークを追加"
          >
            <Plus size={20} className="mr-2" />
            <span className="add-btn-text">追加</span>
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;