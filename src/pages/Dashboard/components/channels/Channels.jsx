import React, { useState, useEffect, useCallback } from "react";
import { SearchBar, SendMessage } from "../../../../components";
import { AddChannelMembers, CreateChannel } from "./components";
import { Info, Phone, Video } from "lucide-react";


export function Channels() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataReady, setDataReady] = useState(false); //
  const [channelData, setChannelData] = useState();
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
        setDataReady(true);
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
      <>
        <div className="inbox">
          <header>
            <h1>CHANNELS</h1>
          </header>
          {!loading && dataReady && (
            <div className="inbox-messages">
              {channelData.data.map((result) => (
                <button
                  className="inbox-item"
                  key={result.id}
                  onClick={() => {
                    fetchMessage(result.id);
                    setChannelName(result.name);
                    setReceiverClass("Channel");
                    setReceiverId(result.id);
                  }}
                >
                  <div className="item-text">
                    <h1>{result.name}</h1>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="message-content">
          <header>
            {channelName ? (
              <>
              <div className="header-left">
                  <Info className="message-icons" />
                </div>
                <div className="header-name">
                  <h1>{channelName}</h1>
                </div>
                <div className="header-right">
                  <Phone className="message-icons" />
                  <Video className="message-icons" />
                </div>
              </>
            ) : null}
          </header>

          {/* <AddChannelMembers activeChannel={null} /> */}
          <div className="message-body-cont">
            <div className="message-body">
              <div className="message-box">
                {messageData?.data.map((result) => (
                  <div
                    className={
                      currentUser.data.email === result.sender.email
                        ? "receiver-message"
                        : "sender-message"
                    }
                    key={result.id}
                  >
                    <p>
                      {result.sender.uid !== currentUser.headers.uid
                        ? result.sender.uid
                        : null}{" "}
                      {result.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="message-input-box">
              {channelName ? (
                <div className="send-inner-cont">
                  <SendMessage
                    receiverClass={receiverClass}
                    receiverId={receiverId}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
