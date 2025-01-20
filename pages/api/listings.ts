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

  if (req.method === "POST") {
    const { title, description, price, category, images } = req.body;
    // log the request body
    console.log("Request body", req.body);
    console.log("UserId", session.userId);

    try {
      const listing = await prisma.listing.create({
        data: {
          title,
          description,
          price: parseFloat(price),
          category,
          images,
          userId: session.userId, // Ensure userId is provided
        },
      });

      console.log("Listing created", listing);
      res.status(201).json(listing);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
