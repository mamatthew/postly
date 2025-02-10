import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import {
  searchListings,
  searchListingsByCategoryOrLocation,
} from "@prisma/client/sql";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

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
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { query, category, location, cursor, direction, limit } = req.query;

    try {
      let results;
      const queryValue = query === "null" ? null : query;
      const directionValue =
        direction && typeof direction === "string" ? direction : "next";
      const limitValue =
        limit && typeof limit === "string" ? parseInt(limit) : 10;

      const categoryValue = category === "null" ? null : category;
      const locationValue = location === "null" ? null : location;
      const cursorValue = cursor === "null" ? null : cursor;

      if (queryValue) {
        // log each query parameter to the console
        console.log(
          "Query",
          query,
          "Category",
          categoryValue,
          "Location",
          locationValue,
          "Cursor",
          cursorValue,
          "Direction",
          directionValue,
          "Limit",
          limitValue
        );
        const parsedCursorValue = cursorValue
          ? parseFloat(cursorValue as string)
          : null;
        results = await prisma.$queryRawTyped(
          searchListings(
            query,
            categoryValue && categoryValue !== "All" ? categoryValue : null,
            locationValue && locationValue !== "All" ? locationValue : null,
            parsedCursorValue,
            directionValue,
            limitValue // Fetch one extra listing
          )
        );
      } else if (categoryValue || locationValue) {
        console.log(
          "Category",
          categoryValue,
          "Location",
          locationValue,
          "Cursor",
          cursorValue,
          "Direction",
          directionValue,
          "Limit",
          limitValue
        );
        const parsedCursorValue = cursorValue
          ? new Date(cursorValue as string)
          : null;
        results = await prisma.$queryRawTyped(
          searchListingsByCategoryOrLocation(
            categoryValue && categoryValue !== "All" ? categoryValue : null,
            locationValue && locationValue !== "All" ? locationValue : null,
            parsedCursorValue,
            directionValue,
            limitValue // Fetch one extra listing
          )
        );
      } else {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      // log the results to the console
      console.log("Results", results);

      if (!results) {
        throw new Error("No results returned from the database");
      }

      const listings: Listing[] = results.map((listing) => ({
        ...listing,
        imageUrl:
          listing.imageUrls && listing.imageUrls.length > 0
            ? listing.imageUrls[0]
            : "/placeholder.jpg",
      }));

      res.status(200).json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        stack: error.stack,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
