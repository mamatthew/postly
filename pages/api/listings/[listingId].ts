import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "@/app/lib/session";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.cookies.session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const session = await decrypt(req.cookies.session);
  if (!session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { listingId } = req.query;
  if (!listingId || typeof listingId !== "string") {
    return res.status(400).json({ error: "Listing ID is required" });
  }

  if (req.method === "GET") {
    try {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
      });
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.status(200).json(listing);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else if (req.method === "PUT") {
    const { title, description, price, imageUrls } = req.body;
    try {
      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: { title, description, price: parseFloat(price), imageUrls },
      });
      res.status(200).json(updatedListing);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.listing.delete({
        where: { id: listingId },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
