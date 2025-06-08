import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bookmark, Eye, ExternalLink, Edit, Trash2, FileText } from 'lucide-react';
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
    if (bookmark.url) {
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    }
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

  const renderThumbnail = () => {
    if (bookmark.type === 'memo') {
      return (
        <div className="memo-thumbnail">
          <div className="memo-icon-container">
            <FileText size={32} className="text-primary-600" />
          </div>
          <div className="memo-preview">
            <p className="text-sm text-gray-700 line-clamp-3">
              {bookmark.memo || bookmark.description || 'メモ'}
            </p>
          </div>
        </div>
      );
    }

    if (bookmark.thumbnail || bookmark.customImage) {
      return (
        <img 
          src={bookmark.customImage || bookmark.thumbnail} 
          alt={bookmark.title}
          className="thumbnail-image"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }

    return (
      <div className="site-name-display">
        <div className="site-name-text">
          {bookmark.siteName || bookmark.title}
        </div>
      </div>
    );
  };
  
  return (
    <div 
      className="bookmark-card-3d group cursor-pointer"
      onClick={bookmark.type === 'bookmark' ? handleVisit : handleEdit}
    >
      <div className="card-spine"></div>
      <div className="card-content">
        {/* Thumbnail/Content Area */}
        <div className="thumbnail-container">
          {renderThumbnail()}
          
          {/* View count badge */}
          <div className="view-badge">
            <Eye size={12} className="mr-1" />
            <span>{bookmark.viewCount}</span>
          </div>
          
          {/* Bookmark icon */}
          <button 
            className={`bookmark-icon ${bookmark.isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleToggleBookmark}
            title={bookmark.isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark size={16} fill={bookmark.isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
        
        {/* Content */}
        <div className="card-info">
          <h3 className="card-title">{bookmark.title}</h3>
          {bookmark.description && (
            <p className="card-description">{bookmark.description}</p>
          )}
          
          {/* Tags */}
          <div className="tags-container">
            {bookmark.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag-badge">#{tag}</span>
            ))}
            {bookmark.tags.length > 3 && (
              <span className="tag-badge">+{bookmark.tags.length - 3}</span>
            )}
          </div>
          
          {/* Footer */}
          <div className="card-footer">
            <span className="timestamp" title={new Date(bookmark.createdAt).toLocaleString()}>
              {getTimeAgo(new Date(bookmark.createdAt))}
            </span>
            
            <div className="action-buttons">
              <button 
                className="action-btn edit-btn" 
                onClick={handleEdit}
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button 
                className="action-btn delete-btn" 
                onClick={handleDelete}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
              {bookmark.type === 'bookmark' && bookmark.url && (
                <button 
                  className="action-btn visit-btn" 
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
    </div>
  );
};

export default BookmarkCard;