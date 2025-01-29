"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { unsaveListing } from "@/app/store/userSlice";

export default function SavedListings() {
  const dispatch = useDispatch<AppDispatch>();
  const savedListings = useSelector(
    (state: RootState) => state.user.savedListings
  );

  const handleUnsave = async (listingId: string) => {
    await dispatch(unsaveListing(listingId));
  };

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
                    listing.imageUrls.length > 0
                      ? listing.imageUrls[0]
                      : "/placeholder.jpg"
                  }
                  alt={listing.title}
                  width="100"
                  height="100"
                />
                <p>{listing.description}</p>
                <p>${listing.price}</p>
                <button onClick={() => handleUnsave(listing.id)}>Unsave</button>
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
