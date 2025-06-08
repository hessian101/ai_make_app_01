import React, { useState, useEffect } from 'react';
import { Tag, X, ChevronDown, ChevronUp, Search, Bookmark, FileText, Grid } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';
import { getAllTagsWithCount } from '../db/supabaseHelpers';

const Sidebar: React.FC = () => {
  const [allTags, setAllTags] = useState<{ tag: string; count: number }[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const { filterOptions, setFilterOptions, resetFilters } = useBookmarkStore();
  
  useEffect(() => {
    const fetchTags = async () => {
      const tagsWithCount = await getAllTagsWithCount();
      setAllTags(tagsWithCount);
    };
    
    fetchTags();
  }, []);
  
  const filteredTags = allTags.filter(({ tag }) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );
  
  const handleTagClick = (tag: string) => {
    const newTags = filterOptions.tags.includes(tag)
      ? filterOptions.tags.filter(t => t !== tag)
      : [...filterOptions.tags, tag];
      
    setFilterOptions({ tags: newTags });
  };
  
  const toggleTagFilterType = () => {
    setFilterOptions({
      tagFilterType: filterOptions.tagFilterType === 'AND' ? 'OR' : 'AND'
    });
  };
  
  const toggleBookmarked = () => {
    setFilterOptions({ onlyBookmarked: !filterOptions.onlyBookmarked });
  };

  const setShelfFilter = (shelfType: 'all' | 'bookmark' | 'memo') => {
    setFilterOptions({ shelfType });
  };
  
  const handleReset = () => {
    resetFilters();
    setTagSearch('');
  };
  
  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <Tag size={18} className="mr-2" />
          フィルター
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="expand-btn"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="sidebar-content">
          {/* Shelf Type Filter */}
          <div className="filter-section">
            <h3 className="filter-section-title">棚の種類</h3>
            <div className="shelf-filter-buttons">
              <button
                onClick={() => setShelfFilter('all')}
                className={`shelf-filter-btn ${(!filterOptions.shelfType || filterOptions.shelfType === 'all') ? 'active' : ''}`}
              >
                <Grid size={16} className="mr-2" />
                すべて
              </button>
              <button
                onClick={() => setShelfFilter('bookmark')}
                className={`shelf-filter-btn ${filterOptions.shelfType === 'bookmark' ? 'active' : ''}`}
              >
                <Bookmark size={16} className="mr-2" />
                ブックマーク
              </button>
              <button
                onClick={() => setShelfFilter('memo')}
                className={`shelf-filter-btn ${filterOptions.shelfType === 'memo' ? 'active' : ''}`}
              >
                <FileText size={16} className="mr-2" />
                メモ
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(filterOptions.tags.length > 0 || filterOptions.onlyBookmarked) && (
            <div className="filter-section">
              <div className="active-filters-header">
                <h3 className="filter-section-title">アクティブフィルター</h3>
                <button 
                  onClick={handleReset}
                  className="reset-btn"
                >
                  すべてリセット
                </button>
              </div>
              <div className="active-filters">
                {filterOptions.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="active-filter-tag"
                  >
                    #{tag}
                    <button 
                      onClick={() => handleTagClick(tag)}
                      className="remove-filter-btn"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                
                {filterOptions.onlyBookmarked && (
                  <span className="active-filter-bookmark">
                    ブックマークのみ
                    <button 
                      onClick={toggleBookmarked}
                      className="remove-filter-btn"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
              
              {filterOptions.tags.length > 1 && (
                <div className="tag-logic-toggle">
                  <span className="tag-logic-label">マッチ条件:</span>
                  <button
                    onClick={toggleTagFilterType}
                    className={`logic-btn ${filterOptions.tagFilterType === 'AND' ? 'active' : ''}`}
                  >
                    AND
                  </button>
                  <button
                    onClick={toggleTagFilterType}
                    className={`logic-btn ${filterOptions.tagFilterType === 'OR' ? 'active' : ''}`}
                  >
                    OR
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Bookmark filter */}
          <div className="filter-section">
            <button
              onClick={toggleBookmarked}
              className={`bookmark-filter-btn ${filterOptions.onlyBookmarked ? 'active' : ''}`}
            >
              <Bookmark size={16} className="mr-2" />
              ブックマークのみ
            </button>
          </div>
          
          {/* Tags list */}
          <div className="filter-section">
            <h3 className="filter-section-title">ハッシュタグ</h3>
            
            {/* Tag search */}
            <div className="tag-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="タグを検索..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="tag-search-input"
              />
            </div>
            
            <div className="tags-list">
              {filteredTags.length === 0 ? (
                <p className="no-tags">
                  {tagSearch ? '該当するタグがありません' : 'タグがまだありません'}
                </p>
              ) : (
                filteredTags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`tag-item ${filterOptions.tags.includes(tag) ? 'selected' : ''}`}
                  >
                    <span className="tag-name">#{tag}</span>
                    <span className="tag-count">{count}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;