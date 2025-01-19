"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch(`/api/search?query=${query}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
