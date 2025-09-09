import { useState } from 'react';
import { Search } from 'lucide-react';
import { PostCategory } from '@/types';

interface PostSearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: PostCategory | null) => void;
  categories: PostCategory[];
  activeCategory: PostCategory | null;
}

export default function PostSearch({ 
  onSearch, 
  onCategoryChange, 
  categories,
  activeCategory 
}: PostSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="mb-8 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Cari
        </button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            !activeCategory 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}