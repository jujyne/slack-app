import { useState, useRef } from "react";
import { SearchResults } from "./component/SearchResults";

export function SearchBar({setReceiverId}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
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
    setShowResults(true)
  }

  const fetchData = (value) => {
    console.log("searching");
    fetch("http://206.189.91.54/api/v1/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        client: currentUser.headers.client,
        uid: currentUser.headers.uid,
        expiry: currentUser.headers.expiry,
        "access-token": currentUser.headers.accessToken,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && Array.isArray(json.data)) {
          const results = json.data
            .filter(
              (user) =>
                value &&
                user &&
                user.uid &&
                user.uid.toLowerCase().startsWith(value.toLowerCase())
            )
            .sort((a, b) => a.uid.localeCompare(b.uid)); // Sort alphabetically
          setResults(results);
        } else {
          console.error(
            "Invalid API response format. Expected 'data' array in the response."
          );
          setResults([]); // Set an empty array or handle accordingly
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  const setSearchValue = (selectedResult) => {
    setInput(selectedResult.uid); // Update input with the selected result UID
    // Trigger fetchData to update the results based on the selected value
    fetchData(selectedResult.uid);
    setReceiverId(selectedResult.id)
    console.log(selectedResult.id)
    setShowResults(false);
    
  };

  return (
    <>
      <div className="search-bar-cont">
        <input
          type="text"
          placeholder="Search"
          id="search"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {showResults? 
  <SearchResults results={results} setSearchValue={setSearchValue} />
: null}
    </>
  );
}
