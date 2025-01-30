import { PrismaClient } from "@prisma/client";
import { Category, Location } from "@prisma/client";
import {
  vancouverPostalCodes,
  northVancouverPostalCodes,
  burnabyPostalCodes,
  newWestminsterPostalCodes,
  deltaSurreyLangleyPostalCodes,
  tricitiesPostalCodes,
  richmondPostalCodes,
} from "../data/postal_codes.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dummyUsers = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/dummy_users.json"), "utf-8")
);
const dummyListings = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../data/dummy_listings.json"),
    "utf-8"
  )
);

const locationToPostalCodes = {
  [Location.CITY_OF_VANCOUVER]: vancouverPostalCodes,
  [Location.NORTH_SHORE]: northVancouverPostalCodes,
  [Location.BURNABY]: burnabyPostalCodes,
  [Location.NEW_WESTMINSTER]: newWestminsterPostalCodes,
  [Location.DELTA_SURREY_LANGLEY]: deltaSurreyLangleyPostalCodes,
  [Location.TRICITIES_PITT_MAPLE_RIDGE]: tricitiesPostalCodes,
  [Location.RICHMOND]: richmondPostalCodes,
  // Add other locations and their postal codes
};

async function main() {
  // Seed users
  const users = await Promise.all(
    dummyUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          password: hashedPassword,
        },
      });
    })
  );

  // Get all user IDs
  const userIds = users.map((user) => user.id);

  // Seed listings
  await Promise.all(
    dummyListings.map((listing) => {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      const randomCategory =
        Object.values(Category)[
          Math.floor(Math.random() * Object.values(Category).length)
        ];
      const randomLocation =
        Object.values(Location)[
          Math.floor(Math.random() * Object.values(Location).length)
        ];
      const randomPostalCode = getRandomPostalCode(randomLocation);

      return prisma.listing.create({
        data: {
          title: listing.title,
          description: listing.description,
          price: listing.price,
          email: listing.email,
          userId: randomUserId,
          category: randomCategory,
          location: randomLocation,
          city: randomLocation, // Make city the same as location
          postalCode: randomPostalCode,
          // Add other listing fields if necessary
        },
      });
    })
  );
}

function getRandomPostalCode(location) {
  const postalCodes = locationToPostalCodes[location];
  return postalCodes[Math.floor(Math.random() * postalCodes.length)];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
