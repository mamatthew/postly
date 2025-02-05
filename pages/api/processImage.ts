import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { imageBuffer } = req.body;
      const buffer = Buffer.from(imageBuffer, "base64");
      const resizedBuffer = await sharp(buffer)
        .resize(100, 100, { fit: "cover" })
        .toBuffer();
      const resizedImage = resizedBuffer.toString("base64");
      res.status(200).json({ resizedImage });
    } catch (error) {
      res.status(500).json({ error: "Failed to process image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
