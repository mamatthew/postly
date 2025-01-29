SELECT
  id,
  title,
  description,
  price,
  "createdAt",
  "updatedAt",
  "userId",
  "imageUrls",
  category,
  location,
  "postalCode",
  city
FROM
  "Listing"
WHERE
  ($1::text IS NULL OR category::text = $1)
  AND ($2::text IS NULL OR location::text = $2)
ORDER BY
  "createdAt" DESC;
