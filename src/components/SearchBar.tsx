
import { useState } from "react";
import { Search, X, Loader2, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (query: string, type: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("video");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim(), searchType);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search videos, channels or playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-11 bg-secondary/50 border-secondary focus:border-primary"
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[180px] h-11 bg-secondary/50 border-secondary">
              <SelectValue placeholder="Search type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="channel">Channels</SelectItem>
                <SelectItem value="playlist">Playlists</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button type="submit" className="h-11 px-6" disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
