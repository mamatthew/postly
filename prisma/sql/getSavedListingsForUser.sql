SELECT
  l.id,
  l.title,
  l.description,
  l.price,
  l."createdAt",
  l."updatedAt",
  l."userId"
FROM
  "Listing" l
JOIN
  "_Saved_Listings" sl ON l.id = sl."A"
WHERE
  sl."B" = $1;
