import React, { useState } from "react";
import { SearchBar } from "../search";
import { Send } from "lucide-react";

export function SendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receiverId, setReceiverId] = useState();
  const [message, setMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  

  async function handleSendMessage(event) {
    event.preventDefault();
    setLoading(true);
    console.log("sending message");
    try {
      let response = await fetch("http://206.189.91.54/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          client: currentUser.headers.client,
          uid: currentUser.headers.uid,
          expiry: currentUser.headers.expiry,
          "access-token": currentUser.headers.accessToken,
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          receiver_class: "User",
          body: message,
        }),
      });
  
      if (response.ok) {
        console.log("message sent");
        setMessage("")
      }
    } catch (error) {
      console.error("Error sending message", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="send-message-cont">
      <form onSubmit={handleSendMessage} className="send-message-box">
        <span>
          To: <SearchBar setReceiverId={setReceiverId}/>
        </span>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            console.log(message);
          }}
          cols="30"
          rows="10"
        ></textarea>
        <button type="submit">send</button>
      </form>
    </div>
  );
}
