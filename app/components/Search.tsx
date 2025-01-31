"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, Location } from "@prisma/client";
import { clearSearchResults } from "../store/searchResultsSlice";
import { useDispatch } from "react-redux";

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [location, setLocation] = useState<Location | "All">("All");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // clear the search results
    if (query.trim()) {
      router.push(
        `/search-listings?query=${query}&category=${
          category !== "All" ? category : ""
        }&location=${location !== "All" ? location : ""}`
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="query">Search Query:</label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for listings..."
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "All")}
          >
            <option value="All">All</option>
            {Object.values(Category).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value as Location | "All")}
          >
            <option value="All">All</option>
            {Object.values(Location).map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
