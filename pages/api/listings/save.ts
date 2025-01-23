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

  if (req.method === "POST" || req.method === "DELETE") {
    const { listingId } = req.body;
    console.log("listingId ", listingId);
    if (!listingId || typeof listingId !== "string") {
      return res.status(400).json({ error: "Listing ID is required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { saved_listings: true },
      });

      if (req.method === "POST") {
        const isSaved = user?.saved_listings.some(
          (listing) => listing.id === listingId
        );

        const updatedUser = await prisma.user.update({
          where: { id: session.userId },
          data: {
            saved_listings: {
              [isSaved ? "disconnect" : "connect"]: { id: listingId },
            },
          },
          include: { saved_listings: true },
        });

        res.status(200).json(updatedUser);
      } else if (req.method === "DELETE") {
        const updatedUser = await prisma.user.update({
          where: { id: session.userId },
          data: {
            saved_listings: {
              disconnect: { id: listingId },
            },
          },
          include: { saved_listings: true },
        });

        res.status(200).json(updatedUser);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
