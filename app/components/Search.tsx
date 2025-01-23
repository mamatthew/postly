"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  saveListing,
  unsaveListing,
  fetchUserProfile,
} from "@/app/store/userSlice";
import { Category } from "@prisma/client";

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [listings, setListings] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.user.id !== "");
  const savedListings = useSelector(
    (state: RootState) => state.user.savedListings
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const res = await fetch(
        `/api/search?query=${query}&category=${
          category !== "All" ? category : ""
        }`
      );
      const data = await res.json();
      setListings(data);
      router.push(
        `/?query=${query}&category=${category !== "All" ? category : ""}`
      );
    }
  };

  const handleSave = async (listingId: string) => {
    if (savedListings.some((listing) => listing.id === listingId)) {
      console.log("unsaving listing");
      await dispatch(unsaveListing(listingId));
    } else {
      console.log("saving listing");
      await dispatch(saveListing(listingId));
    }
    dispatch(fetchUserProfile());
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
        <select
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
                {isLoggedIn && (
                  <button onClick={() => handleSave(listing.id)}>
                    {savedListings.some((saved) => saved.id === listing.id)
                      ? "Unsave"
                      : "Save"}
                  </button>
                )}
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
