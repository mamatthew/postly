"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category, Location } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

interface SearchProps {
  initialQuery: string | null;
  initialCategory: Category | null;
  initialLocation: Location | null;
}

export default function SearchBar({
  initialQuery = null,
  initialCategory = null,
  initialLocation = null,
}: SearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [location, setLocation] = useState<Location | null>(initialLocation);
  const router = useRouter();

  useEffect(() => {
    setQuery(initialQuery);
    setCategory(initialCategory);
    setLocation(initialLocation);
  }, [initialQuery, initialCategory, initialLocation]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (query) queryParams.append("query", query);
    if (category && category !== "All")
      queryParams.append("category", category);
    if (location && location !== "All")
      queryParams.append("location", location);
    router.push(`/search-listings?${queryParams.toString()}`);
  };

  const formatCategory = (cat: string) => {
    return cat
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" & ");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto p-4"
    >
      <div className="flex-grow">
        <Input
          type="text"
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for listings..."
          className="w-full"
        />
      </div>
      <Select
        value={category}
        onValueChange={(value) => setCategory(value as Category | null)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {Object.values(Category).map((cat) => (
            <SelectItem key={cat} value={cat}>
              {formatCategory(cat)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={location}
        onValueChange={(value) => setLocation(value as Location | null)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Locations</SelectItem>
          {Object.values(Location).map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full md:w-auto">
        <SearchIcon className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
