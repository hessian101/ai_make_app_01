import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bookmark, Eye, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { BookmarkItem } from '../types';
import { useBookmarkStore } from '../store/bookmarkStore';

interface BookmarkCardProps {
  bookmark: BookmarkItem;
  onEdit: (bookmark: BookmarkItem) => void;
  onDelete: (id: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ 
  bookmark,
  onEdit,
  onDelete
}) => {
  const { incrementViewCount, toggleBookmark } = useBookmarkStore();
  
  const handleVisit = () => {
    incrementViewCount(bookmark.id);
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };
  
  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(bookmark.id);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(bookmark);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(bookmark.id);
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  return (
    <div 
      className="bookmark-card group cursor-pointer"
      onClick={bookmark.type === 'bookmark' ? handleVisit : handleEdit}
    >
      <div className="relative">
        {/* Thumbnail Image */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          {bookmark.thumbnail ? (
            <img 
              src={bookmark.thumbnail} 
              alt={bookmark.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <span className="text-primary-600">{bookmark.type === 'memo' ? 'Memo' : 'No Image'}</span>
            </div>
          )}
          
          {/* View count badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Eye size={12} className="mr-1" />
            <span>{bookmark.viewCount}</span>
          </div>
        </div>
        
        {/* Bookmark icon */}
        <button 
          className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
            bookmark.isBookmarked ? 'text-accent-500 bg-white bg-opacity-90' : 'text-white bg-black bg-opacity-50 opacity-0 group-hover:opacity-100'
          }`}
          onClick={handleToggleBookmark}
          title={bookmark.isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark size={16} fill={bookmark.isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 mb-1">{bookmark.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{bookmark.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {bookmark.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag-badge">#{tag}</span>
          ))}
          {bookmark.tags.length > 3 && (
            <span className="tag-badge">+{bookmark.tags.length - 3}</span>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span title={new Date(bookmark.createdAt).toLocaleString()}>
            {getTimeAgo(new Date(bookmark.createdAt))}
          </span>
          
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="p-1 hover:text-primary-600" 
              onClick={handleEdit}
              title="Edit"
            >
              <Edit size={14} />
            </button>
            <button 
              className="p-1 hover:text-red-600" 
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
            {bookmark.type === 'bookmark' && (
              <button 
                className="p-1 hover:text-primary-600" 
                onClick={handleVisit}
                title="Open link"
              >
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;