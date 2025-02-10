WITH ranked_listings AS (
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
    city,
    email,
    ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) AS row_num
  FROM
    "Listing"
  WHERE
    ($1::text IS NULL OR category::text = $1)
    AND ($2::text IS NULL OR location::text = $2)
)
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
  city,
  email
FROM
  ranked_listings
WHERE
  ($3::timestamp IS NULL OR (
    ($4 = 'next' AND "createdAt" < $3::timestamp) OR
    ($4 = 'prev' AND "createdAt" > $3::timestamp)
  ))
ORDER BY
  "createdAt" DESC,
  id ASC
LIMIT $5 + 1;

    --   WITH ranked_listings AS (
    --     SELECT
    --       id,
    --       title,
    --       description,
    --       price,
    --       "createdAt",
    --       "updatedAt",
    --       "userId",
    --       "imageUrls",
    --       category,
    --       location,
    --       "postalCode",
    --       city,
    --       ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) AS row_num
    --     FROM
    --       "Listing"
    --     WHERE
    --       (${categoryValue}::text IS NULL OR "Listing".category = ${categoryValue}::"Category")
    --       AND (${locationValue}::text IS NULL OR "Listing".location = ${locationValue}::"Location")
    --   )
    --   SELECT
    --     id,
    --     title,
    --     description,
    --     price,
    --     "createdAt",
    --     "updatedAt",
    --     "userId",
    --     "imageUrls",
    --     category,
    --     location,
    --     "postalCode",
    --     city
    --   FROM
    --     ranked_listings
    --   WHERE
    --     (${parsedCursorValue}::timestamp IS NULL OR (
    --       (${directionValue} = 'next' AND "createdAt" < ${parsedCursorValue}::timestamp) OR
    --       (${directionValue} = 'prev' AND "createdAt" > ${parsedCursorValue}::timestamp)
    --     ))
    --   ORDER BY
    --     "createdAt" DESC,
    --     id ASC
    --   LIMIT ${limitValue + 1};
    -- `;