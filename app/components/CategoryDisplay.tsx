"use client";

import Link from "next/link";
import { Category } from "@prisma/client";

export default function CategoryDisplay() {
  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {Object.values(Category).map((cat) => (
          <li key={cat}>
            <Link href={`/search-listings?category=${cat}`}>
              <div>{cat}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
