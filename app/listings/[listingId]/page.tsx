"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { geocode } from "@/app/lib/geocode";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  city: string;
  postalCode: string;
}

export default function ListingPage() {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      const response = await fetch(`/api/listings/${listingId}`);
      if (response.ok) {
        const data = await response.json();
        setListing(data);
        const coords = await geocode(data.postalCode, data.city);
        setCoordinates(coords);
      }
    };

    fetchListing();
  }, [listingId]);

  if (!listing || !coordinates) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <h1>{listing.title}</h1>
        <div>
          {listing.imageUrls.length > 0 ? (
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
      </div>
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
    </div>
  );
}
