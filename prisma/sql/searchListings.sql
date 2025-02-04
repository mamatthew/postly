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
    ts_rank_cd(
      setweight(to_tsvector('english', title), 'A') ||
      setweight(to_tsvector('english', description), 'B'),
      plainto_tsquery('english', $1)
    ) AS rank
  FROM
    "Listing"
  WHERE
    (to_tsvector('english', title) @@ plainto_tsquery('english', $1) OR
    to_tsvector('english', description) @@ plainto_tsquery('english', $1))
    AND ($2::text IS NULL OR category::text = $2)
    AND ($3::text IS NULL OR location::text = $3)
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
  rank
FROM
  ranked_listings
WHERE
  ($4::float IS NULL OR (rank < $4 AND $5 = 'next') OR (rank > $4 AND $5 = 'prev'))
ORDER BY
  rank DESC,
  id ASC
LIMIT $6 + 1;