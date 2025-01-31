"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  fetchSearchResults,
  setCurrentListingIndex,
} from "@/app/store/searchResultsSlice";
import { Category, Location } from "@prisma/client";
import Link from "next/link";
import SaveListingButton from "@/app/components/SaveListingButton";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [location, setLocation] = useState<Location | "All">("All");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const listings = useSelector(
    (state: RootState) => state.searchResults.listings
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    const categoryParam = searchParams.get("category") || "All";
    const locationParam = searchParams.get("location") || "All";

    setQuery(queryParam);
    setCategory(categoryParam as Category | "All");
    setLocation(locationParam as Location | "All");

    const fromListingPage = searchParams.get("fromListingPage") === "true";

    if (!fromListingPage || listings.length === 0) {
      dispatch(
        fetchSearchResults({
          query: queryParam,
          category: categoryParam,
          location: locationParam,
        })
      );
    }
  }, [searchParams, dispatch, listings.length]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/search-listings?query=${query}&category=${
        category !== "All" ? category : ""
      }&location=${location !== "All" ? location : ""}`
    );
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category | "All";
    setCategory(newCategory);
    router.push(
      `/search-listings?query=${query}&category=${
        newCategory !== "All" ? newCategory : ""
      }&location=${location !== "All" ? location : ""}`
    );
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocation = e.target.value as Location | "All";
    setLocation(newLocation);
    router.push(
      `/search-listings?query=${query}&category=${
        category !== "All" ? category : ""
      }&location=${newLocation !== "All" ? newLocation : ""}`
    );
  };

  const handleDetails = (index: number) => {
    dispatch(setCurrentListingIndex(index));
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
            onChange={handleCategoryChange}
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
            onChange={handleLocationChange}
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
      <div>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing, index) => (
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
                <SaveListingButton listing={listing} />
                <Link
                  href={`/listings/${listing.id}?query=${query}&category=${category}&location=${location}&fromListingPage=true`}
                >
                  <button onClick={() => handleDetails(index)}>Details</button>
                </Link>
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
