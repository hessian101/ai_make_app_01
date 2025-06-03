import React from 'react';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button
      className="fixed right-6 bottom-6 w-14 h-14 bg-accent-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-accent-600 transition-all duration-300 hover:scale-110 z-10"
      onClick={onClick}
      aria-label="Add new bookmark"
    >
      <Plus size={24} className="transition-transform duration-300 hover:rotate-90" />
    </button>
  );
};

export default AddButton;