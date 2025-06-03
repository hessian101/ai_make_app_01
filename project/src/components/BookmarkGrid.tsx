import React, { useState } from 'react';
import BookmarkCard from './BookmarkCard';
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
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    // Tags filter
    let matchesTags = true;
    if (filterOptions.tags.length > 0) {
      if (filterOptions.tagFilterType === 'AND') {
        // All selected tags must be present
        matchesTags = filterOptions.tags.every((tag) =>
          bookmark.tags.includes(tag)
        );
      } else {
        // At least one selected tag must be present
        matchesTags = filterOptions.tags.some((tag) =>
          bookmark.tags.includes(tag)
        );
      }
    }

    // Bookmarked filter
    const matchesBookmarked = !filterOptions.onlyBookmarked || bookmark.isBookmarked;

    return matchesSearch && matchesTags && matchesBookmarked;
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
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-6 text-center">
          <p className="text-lg text-gray-600 mb-2">No bookmarks found</p>
          <p className="text-sm text-gray-500">
            {filterOptions.search || filterOptions.tags.length > 0 || filterOptions.onlyBookmarked
              ? 'Try changing your filters or search term'
              : 'Add your first bookmark using the + button above'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {sortedBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={onEditBookmark}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this bookmark? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkGrid;