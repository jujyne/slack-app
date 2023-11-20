import React from "react";

export function SearchResults({ results, setSearchValue }) {
  if (results && results.length > 0) {
    return (
      <div className="results-list">
        {results.map((result, id) => (
          <div key={id} onClick={() => setSearchValue(result)}>
            {result.uid}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
