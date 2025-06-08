import React from 'react';
import { BookOpen, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { BookmarkItem } from '../types';
import BookmarkCard from './BookmarkCard';

interface BookshelfLayoutProps {
  bookmarks: BookmarkItem[];
  onEditBookmark: (bookmark: BookmarkItem) => void;
  onDeleteBookmark: (id: string) => void;
}

const BookshelfLayout: React.FC<BookshelfLayoutProps> = ({
  bookmarks,
  onEditBookmark,
  onDeleteBookmark,
}) => {
  const [bookmarkShelfCollapsed, setBookmarkShelfCollapsed] = React.useState(false);
  const [memoShelfCollapsed, setMemoShelfCollapsed] = React.useState(false);

  const bookmarkItems = bookmarks.filter(item => item.type === 'bookmark');
  const memoItems = bookmarks.filter(item => item.type === 'memo');

  const ShelfHeader = ({ 
    title, 
    icon, 
    count, 
    isCollapsed, 
    onToggle 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    count: number; 
    isCollapsed: boolean; 
    onToggle: () => void; 
  }) => (
    <div className="shelf-header">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-amber-100 to-amber-50 border-b-4 border-amber-800 shadow-lg hover:from-amber-200 hover:to-amber-100 transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <div className="text-amber-800 text-2xl">{icon}</div>
          <h2 className="text-xl font-bold text-amber-900">{title}</h2>
          <span className="bg-amber-800 text-white text-sm px-3 py-1 rounded-full">
            {count}
          </span>
        </div>
        <div className="text-amber-800">
          {isCollapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </div>
      </button>
    </div>
  );

  const ShelfContent = ({ 
    items, 
    isCollapsed 
  }: { 
    items: BookmarkItem[]; 
    isCollapsed: boolean; 
  }) => (
    <div className={`shelf-content ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="shelf-board">
        {items.length === 0 ? (
          <div className="empty-shelf">
            <p className="text-gray-500 text-center py-12">この棚は空です</p>
          </div>
        ) : (
          <div className="books-grid">
            {items.map((item) => (
              <div key={item.id} className="book-slot">
                <BookmarkCard
                  bookmark={item}
                  onEdit={onEditBookmark}
                  onDelete={onDeleteBookmark}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bookshelf-container">
      {/* Bookmarks Shelf */}
      <div className="shelf-section">
        <ShelfHeader
          title="ブックマーク棚"
          icon={<BookOpen />}
          count={bookmarkItems.length}
          isCollapsed={bookmarkShelfCollapsed}
          onToggle={() => setBookmarkShelfCollapsed(!bookmarkShelfCollapsed)}
        />
        <ShelfContent items={bookmarkItems} isCollapsed={bookmarkShelfCollapsed} />
      </div>

      {/* Memo Shelf */}
      <div className="shelf-section">
        <ShelfHeader
          title="メモ棚"
          icon={<FileText />}
          count={memoItems.length}
          isCollapsed={memoShelfCollapsed}
          onToggle={() => setMemoShelfCollapsed(!memoShelfCollapsed)}
        />
        <ShelfContent items={memoItems} isCollapsed={memoShelfCollapsed} />
      </div>
    </div>
  );
};

export default BookshelfLayout;