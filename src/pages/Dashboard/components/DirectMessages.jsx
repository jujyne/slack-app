import React, { useEffect, useState } from "react";
import { SendMessage } from "../../../components";

export function DirectMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [activeName, setActiveName] = useState(null);
  const [messageName, setMessageName] = useState(null);
  const [rawMessage, setRawMessage]= useState(null);
  const [senderMessage, setSenderMessage] = useState(null);
  const [receiverMessage, setReceiverMessage] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [receiverId, setReceiverId] = useState(4530);

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://206.189.91.54/api/v1/messages?receiver_id=${receiverId}&receiver_class=User`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          client: currentUser.headers.client,
          uid: currentUser.headers.uid,
          expiry: currentUser.headers.expiry,
          "access-token": currentUser.headers.accessToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched message data:", data);
        setMessageData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching message data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching message data</p>;
  }

  if (messageData && messageData.data && messageData.data.length > 0) {
    return (
      <div className="direct-message-cont">
        <div className="inbox">
          
            <button>
              
            </button>
          
        </div>
        <div className="message-content">
          <h1>{messageName}</h1>
          <div className="message-body">
          {messageData.data.map((result) => (
            <div
              className={currentUser.data.email === result.sender.email? 'receiver-message': 'sender-message'}
              key={result.id}
            >
              {result.body}
            </div>
          ))}
          </div>
          {/* {messageName ? <SendMessage /> : null} */}
        </div>
      </div>
    );
  }

  return <p>No message data available.</p>;
}
