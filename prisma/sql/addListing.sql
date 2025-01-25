INSERT INTO "Listing" (
  id,
  title,
  description,
  price,
  "createdAt",
  "updatedAt",
  "userId",
  category
) VALUES (
  $1,  -- id
  $2,  -- title
  $3,  -- description
  $4,  -- price
  NOW(),  -- createdAt
  NOW(),  -- updatedAt
  $5,  -- userId
  $6   -- category
);
