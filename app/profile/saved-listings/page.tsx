"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import SaveListingButton from "@/app/components/SaveListingButton";

export default function SavedListings() {
  const savedListings = useSelector(
    (state: RootState) => state.user.savedListings
  );

  return (
    <div>
      <h1>Saved Listings</h1>
      <div>
        {savedListings.length > 0 ? (
          <ul>
            {savedListings.map((listing) => (
              <li key={listing.id}>
                <h3>{listing.title}</h3>
                <img
                  src={
                    listing.imageUrls?.length > 0
                      ? listing.imageUrls[0]
                      : "/placeholder.jpg"
                  }
                  alt={listing.title}
                  width="100"
                  height="100"
                />
                <p>{listing.description}</p>
                <p>${listing.price}</p>
                <SaveListingButton listing={listing} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved listings found</p>
        )}
      </div>
    </div>
  );
}
