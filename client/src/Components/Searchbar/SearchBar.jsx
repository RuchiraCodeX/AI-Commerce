import React from "react";
import { useState } from "react";

function SearchBar({ onResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      try {
        const res = await fetch(`http://localhost:5000/products/search/${value}`);
        const data = await res.json();
        onResults(data); // send results back to App
      } catch (err) {
        console.error("❌ Search error:", err);
      }
    } else {
      onResults([]);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={query}
      onChange={handleSearch}
      className="w-full px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 text-base transition"
    />
  );
}

export default SearchBar;
