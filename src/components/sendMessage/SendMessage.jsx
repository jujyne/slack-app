import React, { useState } from "react";
import { SearchBar, SearchResults } from "../search";
import { Send } from "lucide-react";

export function SendMessage() {
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };


  return (
    <div className="send-message-cont">
      <form className='send-message-box'>
        <span>To: {selectedUser && <span>{selectedUser}</span>}</span>
        <SearchBar setResults={setResults} onSelect={handleSelectUser} />
        <SearchResults results={results} onSelect={handleSelectUser} />
        <textarea name="" id="" cols="30" rows="10"></textarea>
        <button>send</button>
      </form>
    </div>
  );
}
