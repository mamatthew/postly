import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "@/app/lib/session";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = req.cookies.session;
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = await decrypt(session);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("userId", payload.userId);

    try {
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

      console.log("user", user);

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
