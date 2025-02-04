"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  fetchSearchResults,
  setCurrentListingIndex,
  clearSearchResults,
} from "@/app/store/searchResultsSlice";
import SearchBar from "@/app/components/SearchBar";
import ListingPreview from "@/app/components/ListingPreview";
import type { Category, Location } from "@/prisma/client";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const listings = useSelector(
    (state: RootState) => state.searchResults.listings
  );
  const searchStatus = useSelector(
    (state: RootState) => state.searchResults.status
  );
  const cursor = useSelector((state: RootState) => state.searchResults.cursor);
  const limit = useSelector((state: RootState) => state.searchResults.limit);

  const searchParams = useSearchParams();

  const queryParam = searchParams.get("query");
  const categoryParam = searchParams.get("category");
  const locationParam = searchParams.get("location");

  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  useEffect(() => {
    const fromListingPage = searchParams.get("fromListingPage") === "true";

    if (!fromListingPage) {
      console.log("performing new search");
      console.log("Query Parameters:", {
        query: queryParam,
        category: categoryParam,
        location: locationParam,
      });
      dispatch(clearSearchResults());
      dispatch(
        fetchSearchResults({
          query: queryParam,
          category: categoryParam,
          location: locationParam,
          cursor: null,
          direction: "next",
          limit,
        })
      ).then((action) => {
        const listings = action.payload as Listing[];
        setHasNextPage(listings.length > limit); // Enable "Next" button if there are more listings
        setHasPreviousPage(false); // Initial load has no previous page
      });
    }
  }, [searchParams, dispatch, queryParam, categoryParam, locationParam, limit]);

  const handleDetails = (index: number) => {
    dispatch(setCurrentListingIndex(index));
  };

  const handleNextPage = () => {
    if (listings.length === 0) return;
    const newCursor = queryParam
      ? listings[listings.length - 1].rank
      : listings[listings.length - 1]?.createdAt;
    dispatch(
      fetchSearchResults({
        query: queryParam,
        category: categoryParam,
        location: locationParam,
        cursor: newCursor,
        direction: "next",
        limit,
      })
    ).then((action) => {
      const listings = action.payload as Listing[];
      setHasNextPage(listings.length > limit); // Enable "Next" button if there are more listings
      setHasPreviousPage(true); // Moving to the next page means there is a previous page
    });
  };

  const handlePreviousPage = () => {
    if (listings.length === 0) return;
    const newCursor = queryParam ? listings[0].rank : listings[0]?.createdAt;
    dispatch(
      fetchSearchResults({
        query: queryParam,
        category: categoryParam,
        location: locationParam,
        cursor: newCursor,
        direction: "prev",
        limit,
      })
    ).then((action) => {
      const listings = action.payload as Listing[];
      setHasNextPage(true); // Moving to the previous page means there is a next page
      setHasPreviousPage(listings.length > limit); // Enable "Previous" button if there are more listings
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <SearchBar
          initialQuery={queryParam}
          initialCategory={categoryParam as Category | "All"}
          initialLocation={locationParam as Location | "All"}
        />
      </div>
      <div>
        {searchStatus === "loading" ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        ) : listings.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.slice(0, limit).map((listing, index) => (
                <ListingPreview
                  key={listing.id}
                  listing={listing}
                  index={index}
                  searchParams={searchParams}
                  onDetailsClick={handleDetails}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="btn"
                onClick={handlePreviousPage}
                disabled={!hasPreviousPage || searchStatus === "loading"}
              >
                Previous
              </button>
              <button
                className="btn"
                onClick={handleNextPage}
                disabled={!hasNextPage || searchStatus === "loading"}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No listings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
