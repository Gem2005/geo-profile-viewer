
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, filterBy: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filterBy, setFilterBy] = useState('name');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filterBy);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('', filterBy);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Search profiles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Select
        value={filterBy}
        onValueChange={setFilterBy}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="location">Location</SelectItem>
          <SelectItem value="occupation">Occupation</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" className="gap-2">
        <Search size={18} />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
};

export default SearchBar;
