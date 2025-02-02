import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SaveListingButton from "@/app/components/SaveListingButton";
import type { Listing } from "@/types"; // Assuming you have a Listing type defined

interface ListingPreviewProps {
  listing: Listing;
  index: number;
  searchParams: URLSearchParams;
  onDetailsClick: (index: number) => void;
}

export default function ListingPreview({
  listing,
  index,
  searchParams,
  onDetailsClick,
}: ListingPreviewProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={listing.imageUrl || "/placeholder.svg"}
          alt={listing.title}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <CardContent className="flex-grow p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          {listing.title}
        </h2>
        <p className="text-lg font-bold text-primary mb-2">
          ${listing.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          Posted on: {new Date(listing.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <SaveListingButton listing={listing} />
        <Link
          href={`/listings/${listing.id}?query=${searchParams.get(
            "query"
          )}&category=${searchParams.get(
            "category"
          )}&location=${searchParams.get("location")}&fromListingPage=true`}
        >
          <Button onClick={() => onDetailsClick(index)} variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
