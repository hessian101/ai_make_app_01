import React from 'react';
import { BookOpen, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddNew: () => void;
  isFiltering: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddNew, isFiltering }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-sm">
      <BookOpen size={64} className="text-gray-300 mb-6" />
      
      <h3 className="text-xl font-medium text-gray-800 mb-2">
        {isFiltering ? 'No matching bookmarks found' : 'Your bookshelf is empty'}
      </h3>
      
      <p className="text-gray-500 text-center max-w-md mb-6">
        {isFiltering 
          ? 'Try adjusting your search criteria or removing some filters to see more results.'
          : 'Start building your collection by adding your favorite websites and notes.'
        }
      </p>
      
      {!isFiltering && (
        <button
          onClick={onAddNew}
          className="btn-primary flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Your First Bookmark
        </button>
      )}
    </div>
  );
};

export default EmptyState;