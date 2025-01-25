import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "@/app/lib/session";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      title,
      description,
      price,
      category,
      images,
      city,
      postalCode,
      email,
      location,
    } = req.body;

    if (!req.cookies.session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await decrypt(req.cookies.session);
    if (!session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const newListing = await prisma.listing.create({
        data: {
          title,
          description,
          price: parseFloat(price),
          category,
          imageUrls: images,
          city,
          postalCode,
          email,
          location,
          userId: session.userId,
        },
      });

      res.status(201).json(newListing);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else if (req.method === "DELETE") {
    if (!req.cookies.session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await decrypt(req.cookies.session);
    if (!session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { listingId } = req.query;
    console.log("Listing ID", listingId);
    if (!listingId || typeof listingId !== "string") {
      return res.status(400).json({ error: "Listing ID is required" });
    }

    try {
      await prisma.listing.delete({
        where: {
          id: listingId,
        },
      });

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
