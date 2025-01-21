"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState([]);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json();
      setListings(data);
      router.push(`/?query=${query}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for listings..."
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing) => (
              <li key={listing.id}>
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  width="100"
                  height="100"
                />
                <h2>{listing.title}</h2>
                <p>{listing.description}</p>
                <p>${listing.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No listings found</p>
        )}
      </div>
    </div>
  );
}
