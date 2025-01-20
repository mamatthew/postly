import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.cookies.session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const images = req.body; // Directly use req.body
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid images data" });
    }

    try {
      const urls = await Promise.all(
        images.map(async (image) => {
          const { fileName, fileType } = image;
          const key = `${uuidv4()}-${fileName}`;
          const params = {
            Bucket: process.env.AWS_S3_POSTLY_LISTINGS_BUCKET,
            Key: key,
            ContentType: fileType,
            Expires: 120,
          };
          console.log("fetching signed url for", key);
          const url = await s3.getSignedUrlPromise("putObject", params);
          return url;
        })
      );
      res.status(200).json({ urls });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
