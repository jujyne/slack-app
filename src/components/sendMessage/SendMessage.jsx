import React, { useState } from "react";
import { SendHorizontal, Image, Smile, Mic } from "lucide-react";
import { ClipLoader } from "react-spinners";

export function SendMessage({ receiverId, receiverClass, fetchMessage, fetchData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
          receiver_class: receiverClass,
          body: message,
        }),
      });

      if (response.ok) {
        console.log("message sent");
        fetchMessage(receiverId);
        fetchData();
        setMessage("");
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
    <div className="send-message-cont">
      <form onSubmit={handleSendMessage} className="send-message-box">
        <div className="send-message-icons-cont">
          <Image className="message-icons" />
          <Mic className="message-icons" />
          <Smile className="message-icons" />
        </div>

        <div className="textarea-cont">
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              console.log(message);
            }}
          ></textarea>
        </div>
        <div className="send-button-cont">
          <button type="submit" disabled={!message.trim()}>
            {loading ? (
              <ClipLoader color={"#Ffc07f"} speedMultiplier={0.8} size={"2rem"} />
            ) : (
              <SendHorizontal className="message-icons" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
