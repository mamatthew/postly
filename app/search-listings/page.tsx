"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  const searchParams = useSearchParams();

  const queryParam = searchParams.get("query") || "";
  const categoryParam = searchParams.get("category") || "All";
  const locationParam = searchParams.get("location") || "All";

  useEffect(() => {
    const fromListingPage = searchParams.get("fromListingPage") === "true";

    if (!fromListingPage) {
      dispatch(clearSearchResults());
      dispatch(
        fetchSearchResults({
          query: queryParam,
          category: categoryParam,
          location: locationParam,
        })
      );
    }
  }, [searchParams, dispatch, queryParam, categoryParam, locationParam]);

  const handleDetails = (index: number) => {
    dispatch(setCurrentListingIndex(index));
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing, index) => (
              <ListingPreview
                key={listing.id}
                listing={listing}
                index={index}
                searchParams={searchParams}
                onDetailsClick={handleDetails}
              />
            ))}
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
