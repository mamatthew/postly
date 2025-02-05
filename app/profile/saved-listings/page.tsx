// "use client";

// import { useSelector } from "react-redux";
// import type { RootState } from "@/app/store";
// import SaveListingButton from "@/app/components/SaveListingButton";

// export default function SavedListings() {
//   const savedListings = useSelector(
//     (state: RootState) => state.user.savedListings
//   );

//   return (
//     <div>
//       <h1>Saved Listings</h1>
//       <div>
//         {savedListings.length > 0 ? (
//           <ul>
//             {savedListings.map((listing) => (
//               <li key={listing.id}>
//                 <h3>{listing.title}</h3>
//                 <img
//                   src={
//                     listing.imageUrls?.length > 0
//                       ? listing.imageUrls[0]
//                       : "/placeholder.jpg"
//                   }
//                   alt={listing.title}
//                   width="100"
//                   height="100"
//                 />
//                 <p>{listing.description}</p>
//                 <p>${listing.price}</p>
//                 <SaveListingButton listing={listing} />
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No saved listings found</p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import SaveListingButton from "@/app/components/SaveListingButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SavedListings() {
  const savedListings = useSelector(
    (state: RootState) => state.user.savedListings
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Listings</h1>
      {savedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      listing.imageUrls?.length > 0
                        ? listing.imageUrls[0]
                        : "/placeholder.jpg"
                    }
                    alt={listing.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">{listing.title}</CardTitle>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {listing.description}
                </p>
                <p className="text-2xl font-bold text-primary">
                  ${listing.price.toLocaleString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
                <SaveListingButton listing={listing} />
                <Link href={`/listings/${listing.id}`} passHref>
                  <Button variant="outline">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Grid className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No saved listings
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start saving listings to see them here!
          </p>
          <Link href="/" passHref>
            <Button className="mt-6">Browse Listings</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
