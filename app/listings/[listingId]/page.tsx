// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/app/store";
// import { geocode } from "@/app/lib/geocode";
// import { MapContainer, TileLayer, Circle } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { setCurrentListingIndex } from "@/app/store/searchResultsSlice";
// import SaveListingButton from "@/app/components/SaveListingButton";

// export default function ListingPage() {
//   const { listingId } = useParams();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const dispatch = useDispatch<AppDispatch>();
//   const listings = useSelector(
//     (state: RootState) => state.searchResults.listings
//   );
//   const [currentListingIndex, setCurrentListingIndexState] = useState<
//     number | undefined
//   >(undefined);
//   const [coordinates, setCoordinates] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const index = listings.findIndex((listing) => listing.id === listingId);
//     if (index !== -1) {
//       setCurrentListingIndexState(index);
//       dispatch(setCurrentListingIndex(index));
//     }
//   }, [listingId, listings, dispatch]);

//   useEffect(() => {
//     if (currentListingIndex !== undefined && listings[currentListingIndex]) {
//       const listing = listings[currentListingIndex];
//       const fetchCoordinates = async () => {
//         const coords = await geocode(listing.postalCode, listing.city);
//         setCoordinates(coords);
//         setLoading(false);
//         console.log("Coordinates:", coords);
//       };
//       fetchCoordinates();
//     }
//   }, [currentListingIndex, listings]);

//   if (
//     loading ||
//     currentListingIndex === undefined ||
//     !listings[currentListingIndex]
//   ) {
//     return <div>Loading...</div>;
//   }

//   const listing = listings[currentListingIndex];

//   const handlePrevious = async () => {
//     if (currentListingIndex > 0) {
//       const previousListingId = listings[currentListingIndex - 1].id;
//       router.push(`/listings/${previousListingId}`);
//     }
//   };

//   const handleNext = async () => {
//     if (currentListingIndex < listings.length - 1) {
//       const nextListingId = listings[currentListingIndex + 1].id;
//       router.push(`/listings/${nextListingId}`);
//     }
//   };

//   const handleBackToResults = () => {
//     const query = searchParams.get("query") || "";
//     const category = searchParams.get("category") || "All";
//     const location = searchParams.get("location") || "All";
//     router.push(
//       `/search-listings?query=${query}&category=${category}&location=${location}&fromListingPage=true`
//     );
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       <div style={{ flex: 1 }}>
//         <h1>{listing.title}</h1>
//         <div>
//           {listing.imageUrls && listing.imageUrls.length > 0 ? (
//             listing.imageUrls.map((url, index) => (
//               <img
//                 key={index}
//                 src={url}
//                 alt={`Image ${index + 1}`}
//                 width="100"
//                 height="100"
//               />
//             ))
//           ) : (
//             <img
//               src="/placeholder.jpg"
//               alt="Placeholder"
//               width="100"
//               height="100"
//             />
//           )}
//         </div>
//         <p>{listing.description}</p>
//         <p>Posted on: {new Date(listing.createdAt).toLocaleDateString()}</p>
//         <p>Last updated: {new Date(listing.updatedAt).toLocaleDateString()}</p>
//         <SaveListingButton listing={listing} />
//         <button onClick={handlePrevious} disabled={currentListingIndex === 0}>
//           Previous
//         </button>
//         <button onClick={handleBackToResults}>Back to Results</button>
//         <button
//           onClick={handleNext}
//           disabled={currentListingIndex === listings.length - 1}
//         >
//           Next
//         </button>
//       </div>
//       {coordinates && (
//         <div style={{ flex: 1 }}>
//           <MapContainer
//             center={[coordinates.lat, coordinates.lng]}
//             zoom={12}
//             style={{ height: "300px", width: "300px" }}
//           >
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             <Circle center={[coordinates.lat, coordinates.lng]} radius={1500} />
//           </MapContainer>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { geocode } from "@/app/lib/geocode";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { setCurrentListingIndex } from "@/app/store/searchResultsSlice";
import SaveListingButton from "@/app/components/SaveListingButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export default function ListingPage() {
  const { listingId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const listings = useSelector(
    (state: RootState) => state.searchResults.listings
  );
  const [currentListingIndex, setCurrentListingIndexState] = useState<
    number | undefined
  >(undefined);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const index = listings.findIndex((listing) => listing.id === listingId);
    if (index !== -1) {
      setCurrentListingIndexState(index);
      dispatch(setCurrentListingIndex(index));
    }
  }, [listingId, listings, dispatch]);

  useEffect(() => {
    if (currentListingIndex !== undefined && listings[currentListingIndex]) {
      const listing = listings[currentListingIndex];
      const fetchCoordinates = async () => {
        const coords = await geocode(listing.postalCode, listing.city);
        setCoordinates(coords);
        setLoading(false);
      };
      fetchCoordinates();
    }
  }, [currentListingIndex, listings]);

  if (
    loading ||
    currentListingIndex === undefined ||
    !listings[currentListingIndex]
  ) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const listing = listings[currentListingIndex];

  const handlePrevious = () => {
    if (currentListingIndex > 0) {
      const previousListingId = listings[currentListingIndex - 1].id;
      router.push(`/listings/${previousListingId}`);
    }
  };

  const handleNext = () => {
    if (currentListingIndex < listings.length - 1) {
      const nextListingId = listings[currentListingIndex + 1].id;
      router.push(`/listings/${nextListingId}`);
    }
  };

  const handleBackToResults = () => {
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "All";
    const location = searchParams.get("location") || "All";
    router.push(
      `/search-listings?query=${query}&category=${category}&location=${location}&fromListingPage=true`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{listing.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9">
                {listing.imageUrls && listing.imageUrls.length > 0 ? (
                  <img
                    src={listing.imageUrls[0] || "/placeholder.svg"}
                    alt={listing.title}
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src="/placeholder.jpg"
                    alt="Placeholder"
                    className="object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {listing.imageUrls?.slice(1, 5).map((url, index) => (
                  <img
                    key={index}
                    src={url || "/placeholder.svg"}
                    alt={`Image ${index + 2}`}
                    className="object-cover aspect-square rounded-lg"
                  />
                ))}
              </div>
              <p className="text-gray-700">{listing.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <p>
                  Posted on: {new Date(listing.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Last updated:{" "}
                  {new Date(listing.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {coordinates && (
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Circle
                      center={[coordinates.lat, coordinates.lng]}
                      radius={1500}
                    />
                  </MapContainer>
                </div>
              )}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Location</h3>
                <p>
                  {listing.city}, {listing.postalCode}
                </p>
              </div>
              <SaveListingButton listing={listing} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleBackToResults} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
          </Button>
          <div className="space-x-2">
            <Button
              onClick={handlePrevious}
              disabled={currentListingIndex === 0}
              variant="outline"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentListingIndex === listings.length - 1}
              variant="outline"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
