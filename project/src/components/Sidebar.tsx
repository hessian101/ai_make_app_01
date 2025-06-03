import React, { useState, useEffect } from 'react';
import { Tag, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';
import * as db from '../db';

const Sidebar: React.FC = () => {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const { filterOptions, setFilterOptions, resetFilters } = useBookmarkStore();
  
  useEffect(() => {
    const fetchTags = async () => {
      const tagsWithCount = await db.getAllTagsWithCount();
      setAllTags(tagsWithCount.map(({ tag }) => tag));
    };
    
    fetchTags();
  }, []);
  
  const handleTagClick = (tag: string) => {
    // If tag is already selected, remove it; otherwise add it
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
  
  const handleReset = () => {
    resetFilters();
  };
  
  return (
    <aside className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Tag size={18} className="mr-2" />
          Filters
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {isExpanded && (
        <>
          {/* Active filters */}
          {(filterOptions.tags.length > 0 || filterOptions.onlyBookmarked) && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
                <button 
                  onClick={handleReset}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Reset All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-primary-600 text-white"
                  >
                    #{tag}
                    <button 
                      onClick={() => handleTagClick(tag)}
                      className="ml-1 text-white hover:text-gray-200"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                
                {filterOptions.onlyBookmarked && (
                  <span 
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-accent-500 text-white"
                  >
                    Bookmarked Only
                    <button 
                      onClick={toggleBookmarked}
                      className="ml-1 text-white hover:text-gray-200"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
              
              {filterOptions.tags.length > 1 && (
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Match:</span>
                  <button
                    onClick={toggleTagFilterType}
                    className={`text-xs px-2 py-1 rounded ${
                      filterOptions.tagFilterType === 'AND'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    AND
                  </button>
                  <button
                    onClick={toggleTagFilterType}
                    className={`text-xs px-2 py-1 rounded ml-1 ${
                      filterOptions.tagFilterType === 'OR'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    OR
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Bookmark filter */}
          <div className="mb-4">
            <button
              onClick={toggleBookmarked}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                filterOptions.onlyBookmarked
                  ? 'bg-accent-100 text-accent-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className={`mr-2 ${filterOptions.onlyBookmarked ? 'text-accent-600' : 'text-gray-400'}`}>
                <Tag size={16} />
              </span>
              Bookmarked Only
            </button>
          </div>
          
          {/* Tags list */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            <div className="max-h-96 overflow-y-auto pr-1">
              {allTags.length === 0 ? (
                <p className="text-sm text-gray-500">No tags yet</p>
              ) : (
                allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 flex items-center ${
                      filterOptions.tags.includes(tag)
                        ? 'bg-primary-100 text-primary-800'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className={`mr-2 ${filterOptions.tags.includes(tag) ? 'text-primary-600' : 'text-gray-400'}`}>
                      #
                    </span>
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;