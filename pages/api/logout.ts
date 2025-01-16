import { NextApiRequest, NextApiResponse } from "next";
import { deleteSession } from "@/app/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await deleteSession(req, res);
    return res.status(200).json({ message: "Logout successful" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
