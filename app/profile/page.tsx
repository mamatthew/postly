"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import {
  fetchUserProfile,
  clearUserListings,
  clearSavedListings,
} from "@/app/store/userSlice";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      const resultAction = await dispatch(fetchUserProfile());
      if (fetchUserProfile.rejected.match(resultAction)) {
        router.push("/");
      }
    };

    fetchUserProfileData();
  }, [router, dispatch]);

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      dispatch(clearUserListings());
      dispatch(clearSavedListings());
      router.push("/");
    }
  };

  const handleDelete = async (listingId: string) => {
    const response = await fetch(`/api/listings/${listingId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(fetchUserProfile());
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <Link href="/create-listing">
        <button>Create New Listing</button>
      </Link>
      <div>
        <h2>Your Listings</h2>
        {user.listings.length > 0 ? (
          <ul>
            {user.listings.map((listing) => (
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
                <Link href={`/profile/edit-listing/${listing.id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(listing.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No listings found</p>
        )}
      </div>
      <div>
        <h2>Your Saved Listings</h2>
        {user.savedListings.length > 0 ? (
          <ul>
            {user.savedListings.map((listing) => (
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
                {listing.userId !== user.id && <button>Save</button>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved listings found</p>
        )}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
