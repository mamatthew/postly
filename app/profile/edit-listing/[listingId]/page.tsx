"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditListing() {
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    imageUrls: [],
  });
  const router = useRouter();
  const { listingId } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const response = await fetch(`/api/listings/${listingId}`);
      if (response.ok) {
        const result = await response.json();
        setListing(result);
      } else {
        router.push("/profile");
      }
    };

    fetchListing();
  }, [listingId, router]);

  const handleSave = async () => {
    const response = await fetch(`/api/listings/${listingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
    });
    if (response.ok) {
      router.push("/profile");
    }
  };

  return (
    <div>
      <h1>Edit Listing</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <label>Title</label>
          <input
            type="text"
            value={listing.title}
            onChange={(e) => setListing({ ...listing, title: e.target.value })}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={listing.description}
            onChange={(e) =>
              setListing({ ...listing, description: e.target.value })
            }
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={listing.price}
            onChange={(e) => setListing({ ...listing, price: e.target.value })}
          />
        </div>
        <div>
          <label>Image URLs</label>
          <input
            type="text"
            value={listing.imageUrls.join(", ")}
            onChange={(e) =>
              setListing({ ...listing, imageUrls: e.target.value.split(", ") })
            }
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
