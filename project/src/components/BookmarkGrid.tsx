import React, { useState } from 'react';
import BookshelfLayout from './BookshelfLayout';
import { BookmarkItem, FilterOptions } from '../types';

interface BookmarkGridProps {
  bookmarks: BookmarkItem[];
  filterOptions: FilterOptions;
  onEditBookmark: (bookmark: BookmarkItem) => void;
  onDeleteBookmark: (id: string) => void;
}

const BookmarkGrid: React.FC<BookmarkGridProps> = ({
  bookmarks,
  filterOptions,
  onEditBookmark,
  onDeleteBookmark,
}) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Apply filters and sorting
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    // Search filter
    const searchLower = filterOptions.search.toLowerCase();
    const matchesSearch =
      !filterOptions.search ||
      bookmark.title.toLowerCase().includes(searchLower) ||
      (bookmark.description?.toLowerCase() || '').includes(searchLower) ||
      (bookmark.memo?.toLowerCase() || '').includes(searchLower) ||
      (bookmark.siteName?.toLowerCase() || '').includes(searchLower) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    // Tags filter
    let matchesTags = true;
    if (filterOptions.tags.length > 0) {
      if (filterOptions.tagFilterType === 'AND') {
        matchesTags = filterOptions.tags.every((tag) =>
          bookmark.tags.includes(tag)
        );
      } else {
        matchesTags = filterOptions.tags.some((tag) =>
          bookmark.tags.includes(tag)
        );
      }
    }

    // Bookmarked filter
    const matchesBookmarked = !filterOptions.onlyBookmarked || bookmark.isBookmarked;

    // Shelf type filter
    const matchesShelfType = !filterOptions.shelfType || 
      filterOptions.shelfType === 'all' || 
      bookmark.type === filterOptions.shelfType;

    return matchesSearch && matchesTags && matchesBookmarked && matchesShelfType;
  });

  // Sort the filtered bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    const sortDir = filterOptions.sortDirection === 'asc' ? 1 : -1;
    
    switch (filterOptions.sortBy) {
      case 'title':
        return a.title.localeCompare(b.title) * sortDir;
      case 'createdAt':
        return ((new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime()) * sortDir;
      case 'updatedAt':
        return ((new Date(a.updatedAt)).getTime() - (new Date(b.updatedAt)).getTime()) * sortDir;
      case 'viewCount':
        return (a.viewCount - b.viewCount) * sortDir;
      case 'lastViewed':
        if (!a.lastViewed) return 1;
        if (!b.lastViewed) return -1;
        return ((new Date(a.lastViewed)).getTime() - (new Date(b.lastViewed)).getTime()) * sortDir;
      default:
        return 0;
    }
  });

  const handleDelete = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteAction = () => {
    if (confirmDelete) {
      onDeleteBookmark(confirmDelete);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="w-full">
      {sortedBookmarks.length === 0 ? (
        <div className="empty-bookshelf">
          <div className="empty-shelf-content">
            <div className="empty-shelf-icon">📚</div>
            <h3 className="empty-shelf-title">本棚が空です</h3>
            <p className="empty-shelf-description">
              {filterOptions.search || filterOptions.tags.length > 0 || filterOptions.onlyBookmarked
                ? 'フィルターを変更するか、検索条件を調整してください'
                : '最初のブックマークを追加して、あなたの本棚を作り始めましょう'}
            </p>
          </div>
        </div>
      ) : (
        <BookshelfLayout
          bookmarks={sortedBookmarks}
          onEditBookmark={onEditBookmark}
          onDeleteBookmark={handleDelete}
        />
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <h3 className="text-lg font-medium mb-4">削除の確認</h3>
            <p className="mb-6">このブックマークを削除してもよろしいですか？この操作は取り消せません。</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-secondary"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkGrid;