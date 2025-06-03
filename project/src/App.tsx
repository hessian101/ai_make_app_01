import React, { useEffect, useState } from 'react';
import { useBookmarkStore } from './store/bookmarkStore';
import { BookmarkItem } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BookmarkGrid from './components/BookmarkGrid';
import BookmarkForm from './components/BookmarkForm';
import AddButton from './components/AddButton';

function App() {
  const {
    bookmarks,
    fetchBookmarks,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    filterOptions,
    modalOpen,
    currentBookmark,
    setModalOpen,
    setCurrentBookmark,
  } = useBookmarkStore();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchBookmarks();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fetchBookmarks]);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleFormSubmit = async (bookmarkData: Omit<BookmarkItem, 'id'>) => {
    if (currentBookmark) {
      await updateBookmark(currentBookmark.id, bookmarkData);
    } else {
      await addBookmark(bookmarkData);
    }
    setModalOpen(false);
  };

  const handleEditBookmark = (bookmark: BookmarkItem) => {
    setCurrentBookmark(bookmark);
    setModalOpen(true);
  };

  const handleDeleteBookmark = async (id: string) => {
    await deleteBookmark(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onAddNew={handleAddClick} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {!isMobile && (
            <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
              <Sidebar />
            </div>
          )}
          
          <div className="flex-1">
            <BookmarkGrid
              bookmarks={bookmarks}
              filterOptions={filterOptions}
              onEditBookmark={handleEditBookmark}
              onDeleteBookmark={handleDeleteBookmark}
            />
          </div>
        </div>
      </main>
      
      <AddButton onClick={handleAddClick} />
      
      {modalOpen && (
        <BookmarkForm
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
          initialData={currentBookmark || undefined}
        />
      )}
      
      {isMobile && filterOptions.tags.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 bg-white p-2 shadow-md flex items-center space-x-2 overflow-x-auto z-10">
          <span className="text-xs text-gray-500 whitespace-nowrap pl-2">Active tags:</span>
          {filterOptions.tags.map(tag => (
            <span key={tag} className="tag-badge whitespace-nowrap">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;