"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    null
  );
  const [listings, setListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const result = await response.json();
        setUser(result.user);
        setListings(result.listings);
        setSavedListings(result.savedListings);
      } else {
        router.push("/");
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      router.push("/");
    }
  };

  const handleDelete = async (listingId: string) => {
    const response = await fetch(`/api/listings/${listingId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setListings(listings.filter((listing) => listing.id !== listingId));
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user.username}!</p>
      <p>Email: {user.email}</p>
      <Link href="/create-listing">
        <button>Create New Listing</button>
      </Link>
      <div>
        <h2>Your Listings</h2>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing) => (
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
