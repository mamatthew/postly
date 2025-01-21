import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "@/app/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log("GET /api/profile");
    const prisma = new PrismaClient();
    const session = req.cookies.session;
    console.log("session", session);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = await decrypt(session);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        listings: true,
        saved_listings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: { username: user.username, email: user.email },
      listings: user.listings,
      savedListings: user.saved_listings,
    });
  }
}
