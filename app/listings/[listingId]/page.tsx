"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { geocode } from "@/app/lib/geocode";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { setCurrentListingIndex } from "@/app/store/searchResultSlices";

export default function ListingPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const listings = useSelector(
    (state: RootState) => state.searchResults.listings
  );
  const currentListingIndex = useSelector(
    (state: RootState) => state.searchResults.currentListingIndex
  );
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    console.log("Current listing index:", currentListingIndex);
    if (currentListingIndex !== undefined && listings[currentListingIndex]) {
      const listing = listings[currentListingIndex];
      const fetchCoordinates = async () => {
        const coords = await geocode(listing.postalCode, listing.city);
        setCoordinates(coords);
        console.log("Coordinates:", coords);
      };
      fetchCoordinates();
    }
  }, [currentListingIndex, listings]);

  if (currentListingIndex === undefined || !listings[currentListingIndex]) {
    return <div>Loading...</div>;
  }

  const listing = listings[currentListingIndex];

  const handlePrevious = () => {
    if (currentListingIndex > 0) {
      const previousListingId = listings[currentListingIndex - 1].id;
      dispatch(setCurrentListingIndex(currentListingIndex - 1));
      router.push(`/listings/${previousListingId}`);
    }
  };

  const handleNext = () => {
    if (currentListingIndex < listings.length - 1) {
      const nextListingId = listings[currentListingIndex + 1].id;
      dispatch(setCurrentListingIndex(currentListingIndex + 1));
      router.push(`/listings/${nextListingId}`);
    }
  };

  const handleBackToResults = () => {
    router.push("/");
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <h1>{listing.title}</h1>
        <div>
          {listing.imageUrls && listing.imageUrls.length > 0 ? (
            listing.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                width="100"
                height="100"
              />
            ))
          ) : (
            <img
              src="/placeholder.jpg"
              alt="Placeholder"
              width="100"
              height="100"
            />
          )}
        </div>
        <p>{listing.description}</p>
        <p>Posted on: {new Date(listing.createdAt).toLocaleDateString()}</p>
        <p>Last updated: {new Date(listing.updatedAt).toLocaleDateString()}</p>
        <button onClick={handlePrevious} disabled={currentListingIndex === 0}>
          Previous
        </button>
        <button onClick={handleBackToResults}>Back to Results</button>
        <button
          onClick={handleNext}
          disabled={currentListingIndex === listings.length - 1}
        >
          Next
        </button>
      </div>
      {coordinates && (
        <div style={{ flex: 1 }}>
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={12}
            style={{ height: "300px", width: "300px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Circle center={[coordinates.lat, coordinates.lng]} radius={1500} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
