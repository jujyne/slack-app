import { useState, useRef } from "react";
import { SearchResults } from "./component/SearchResults";
import { Search } from "lucide-react";

export function SearchBar({ setReceiverId }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [results, setResults] = useState([]);

  // Use useRef to store the timeout ID
  const debounceTimeoutRef = useRef(null);

  function handleChange(value) {
    setInput(value);

    // Clear previous timeout
    clearTimeout(debounceTimeoutRef.current);
    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchData(value);
    }, 500); // Adjust the delay as needed (e.g., 500 milliseconds)
    setShowResults(true);
  }

  const fetchData = (value) => {
    console.log("searching");

    // Filter the local userData based on the search value
    const localResults = userData.filter(
      (user) =>
        value &&
        user &&
        user.uid &&
        user.uid.toLowerCase().startsWith(value.toLowerCase())
    );

    // Sort alphabetically
    const sortedResults = localResults.sort((a, b) => a.uid.localeCompare(b.uid));

    setResults(sortedResults);
  };

  const setSearchValue = (selectedResult) => {
    setInput(selectedResult.uid);
    setReceiverId(selectedResult.id);
    setShowResults(false);
    console.log(selectedResult.id);
  };

  return (
    <>
      <div className="search-bar-cont">
        <Search className="search-icon"/>
        <input
          type="text"
          placeholder="Search"
          id="search"
          className="search-input"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {showResults ? (
        <SearchResults results={results} setSearchValue={setSearchValue} />
      ) : null}
      
      </>
  );
}
