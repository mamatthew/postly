SELECT
  id,
  title,
  description,
  price,
  "createdAt",
  "updatedAt",
  "userId",
  "imageUrls",
  ts_rank_cd(
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', description), 'B'),
    plainto_tsquery('english', $1)
  ) AS rank
FROM
  "Listing"
WHERE
  to_tsvector('english', title) @@ plainto_tsquery('english', $1) OR
  to_tsvector('english', description) @@ plainto_tsquery('english', $1)
ORDER BY
  rank DESC;

