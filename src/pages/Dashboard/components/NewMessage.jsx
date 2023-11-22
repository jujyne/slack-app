import React, { useState } from "react";
import { Send } from "lucide-react";
import { SearchBar, SendMessage } from "../../../components";

export function NewMessage() {
  const [receiverId, setReceiverId] = useState();

  return (
    <div className="new-message-cont">
         <span>
          To: <SearchBar setReceiverId={setReceiverId}/>
        </span>
        <SendMessage receiverId={receiverId}/>
    </div>
  );
}
