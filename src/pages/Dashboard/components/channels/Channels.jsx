import React, { useState, useEffect, useCallback } from "react";
import { SendMessage } from "../../../../components";
import { AddChannelMembers, CreateChannel } from "./components";

export function Channels() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverClass, setReceiverClass] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    setLoading(true);
    fetch("http://206.189.91.54/api/v1/channels", {
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
      .then((data) => {
        console.log("Fetched channel data:", data);
        setChannelData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching channel data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const fetchMessage = useCallback(
    (receiverId) => {
      console.log("Fetching messages:", receiverId);
      if (messageData) {
        setMessageData(null);
      }
      fetch(
        `http://206.189.91.54/api/v1/messages?receiver_id=${receiverId}&receiver_class=Channel`,
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
        });
    },
    [currentUser.headers]
  );

  const renderChannelMessage = channelName && receiverId && receiverClass;

  return (
    <div className="direct-message-cont">
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching channel data: {error.message}</p>}
      {channelData && channelData.data && channelData.data.length > 0 && (
        <>
        <CreateChannel/>
          <div className="inbox">
            {channelData.data.map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  fetchMessage(result.id)
                  setChannelName(result.name);
                  setReceiverClass("Channel");
                  setReceiverId(result.id);
                }}
              >
                {result.name}
              </button>
            ))}
          </div>
          {renderChannelMessage && (
            <div className="message-content">
              <h1>{channelName}</h1>
              <AddChannelMembers activeChannel={null} />
              <div className="message-body">
              {messageData?.data.map((result) => (
                <div
                  className={
                    currentUser.data.email === result.sender.email
                      ? "receiver-message"
                      : "sender-message"
                  }
                  key={result.id}
                >
                  {result.sender.uid !== currentUser.headers.uid? result.sender.uid : null } {result.body}
                </div>
              ))}
            </div>
            <div className="message-input-box">
            {channelName?<SendMessage receiverClass={receiverClass} receiverId={receiverId}/>:null}
            </div>
             
            </div>
          )}
        </>
      )}
      {!loading && !error && !channelData?.data?.length && <p>No channel data available.</p>}
    </div>
  );
}
