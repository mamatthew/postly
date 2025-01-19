import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { searchListings } from "@prisma/client/sql";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { query } = req.query;
    console.log("query", query);
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const results = await prisma.$queryRawTyped(searchListings(query));
    res.status(200).json(results);
  }
}
