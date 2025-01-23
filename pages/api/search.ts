import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { searchListings, searchListingsByCategory } from "@prisma/client/sql";
import { Category } from "@prisma/client";

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
  rank: number | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { query, category } = req.query;
    console.log("query", query, "category", category);
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
      let results;
      if (category && typeof category === "string" && category !== "All") {
        results = await prisma.$queryRawTyped(
          searchListingsByCategory(query, category as keyof typeof Category)
        );
      } else {
        results = await prisma.$queryRawTyped(searchListings(query));
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
