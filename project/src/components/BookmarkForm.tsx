import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { BookmarkItem } from '../types';
import { fetchOgpData, generateAutoTags, parseTagsFromInput } from '../utils/fetchOgp';

interface BookmarkFormProps {
  onSubmit: (bookmarkData: Omit<BookmarkItem, 'id'>) => void;
  onCancel: () => void;
  initialData?: BookmarkItem;
}

const BookmarkForm: React.FC<BookmarkFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const [type, setType] = useState<'bookmark' | 'memo'>(initialData?.type || 'bookmark');
  const [url, setUrl] = useState(initialData?.url || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const isEditing = !!initialData;

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
  };

  const fetchOgp = async () => {
    if (!url || type !== 'bookmark') return;
    
    setIsLoading(true);
    setFetchError('');
    
    try {
      const ogpData = await fetchOgpData(url);
      const autoTags = generateAutoTags(url);
      
      if (ogpData) {
        // Only update fields if they're empty or this is a new bookmark
        if (!isEditing || !title) setTitle(ogpData.title || '');
        if (!isEditing || !description) setDescription(ogpData.description || '');
        if (!isEditing || !thumbnail) setThumbnail(ogpData.image || '');
        
        // Merge auto tags with existing tags
        if (autoTags.length > 0) {
          const existingTags = parseTagsFromInput(tagsInput);
          const mergedTags = [...new Set([...existingTags, ...autoTags])];
          setTagsInput(mergedTags.join(', '));
        }
      }
    } catch (error) {
      setFetchError('Failed to fetch page information. Please enter details manually.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (url && !isEditing && type === 'bookmark') {
      const timer = setTimeout(() => {
        fetchOgp();
      }, 1000); // Debounce OGP fetching
      
      return () => clearTimeout(timer);
    }
  }, [url, isEditing, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags from input
    const tags = parseTagsFromInput(tagsInput);
    
    const bookmarkData: Omit<BookmarkItem, 'id'> = {
      type,
      title: title.trim() || 'Untitled',
      description: description.trim(),
      thumbnail,
      memo: memo.trim(),
      tags,
      url: type === 'bookmark' ? url : undefined,
      isBookmarked: initialData?.isBookmarked || false,
      viewCount: initialData?.viewCount || 0,
      lastViewed: initialData?.lastViewed,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
      ogpData: {
        title,
        description,
        image: thumbnail,
        siteName: url ? new URL(url).hostname.replace('www.', '') : undefined
      }
    };
    
    onSubmit(bookmarkData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit' : 'Add New'} {type === 'bookmark' ? 'Bookmark' : 'Memo'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Type selection */}
          <div className="mb-4">
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={type === 'bookmark'}
                  onChange={() => setType('bookmark')}
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Bookmark</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={type === 'memo'}
                  onChange={() => setType('memo')}
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Memo</span>
              </label>
            </div>
          </div>
          
          {/* URL field for bookmarks */}
          {type === 'bookmark' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <div className="flex">
                <input
                  type="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://example.com"
                  className="input-field"
                  required={type === 'bookmark'}
                />
                <button 
                  type="button" 
                  onClick={fetchOgp}
                  disabled={isLoading || !url}
                  className="ml-2 btn-secondary flex items-center"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="mr-1 animate-spin" />
                  ) : (
                    'Fetch'
                  )}
                </button>
              </div>
              {fetchError && <p className="text-red-500 text-sm mt-1">{fetchError}</p>}
            </div>
          )}
          
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="input-field"
              required
            />
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="input-field"
            />
          </div>
          
          {/* Thumbnail URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input-field"
              />
              {thumbnail && (
                <div className="w-12 h-12 ml-2 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Memo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Memo
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add your notes here (supports Markdown)"
              className="input-field min-h-24"
              rows={4}
            />
          </div>
          
          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated or with # prefix)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="tag1, tag2, #tag3"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: tech, design, #react, #web
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                isEditing ? 'Update' : 'Add'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkForm;