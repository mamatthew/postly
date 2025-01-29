import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import {
  searchListings,
  searchListingsByCategoryOrLocation,
} from "@prisma/client/sql";

const prisma = new PrismaClient();

export interface Listing {
  imageUrl: string;
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  imageUrls: string[] | null;
  category: string;
  city: string;
  postalCode: string;
  rank: number | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { query, category, location } = req.query;
    console.log("query", query, "category", category, "location", location);

    try {
      let results;
      if (query && typeof query === "string") {
        results = await prisma.$queryRawTyped(
          searchListings(
            query,
            category && category !== "All" ? category : null,
            location && location !== "All" ? location : null
          )
        );
      } else if (category || location) {
        results = await prisma.$queryRawTyped(
          searchListingsByCategoryOrLocation(
            category && category !== "All" ? category : null,
            location && location !== "All" ? location : null
          )
        );
      } else {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      // log the results to the console
      console.log("Results", results);

      const listings: Listing[] = results.map((listing) => ({
        ...listing,
        imageUrl:
          listing.imageUrls && listing.imageUrls.length > 0
            ? listing.imageUrls[0]
            : "/placeholder.jpg",
      }));

      res.status(200).json(listings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error ", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
