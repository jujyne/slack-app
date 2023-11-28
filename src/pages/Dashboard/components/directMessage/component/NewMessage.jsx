import React, { useState } from "react";
import { SearchBar, SendMessage } from "../../../../../components";

export function NewMessage({ setNewMessageModal }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receiverId, setReceiverId] = useState();
  const [message, setMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  async function handleSendMessage(event) {
    event.preventDefault();
    setLoading(true);
    console.log("sending message to", receiverId);

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
        setMessage("");
        setNewMessageModal(false);
      } else {
        console.error("Failed to send message. Response:", response);
      }
    } catch (error) {
      console.error("Error sending message", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="new-message-cont">
      <h1>NEW MESSAGE</h1>
      <div className="new-message-form">
        <span className="new-message-receiver">
          <SearchBar className="nm-search" setReceiverId={setReceiverId} />
        </span>
        <form onSubmit={handleSendMessage} className="new-message-form">
          <div className="nm-textarea-cont">
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                console.log(message);
              }}
            ></textarea>
          </div>
          <div className="nm-send-button-cont">
            <button type="submit">Send</button>
            <button onClick={() => setNewMessageModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
