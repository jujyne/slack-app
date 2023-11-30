import React, { useState, useEffect, useCallback, useRef } from "react";
import { SendMessage } from "../../../../components";
import { Info, Plus } from "lucide-react";
import { UserPlus } from "lucide-react";
import {
  AddChannelMembers,
  CreateChannel,
  GetChannelDetails,
} from "./components";
import { HashLoader, PulseLoader } from "react-spinners";
import channelGif from "../../../../assets/images/channel-gif.gif";
import waiting from "../../../../assets/images/waiting.gif";
import teatime from "../../../../assets/images/tea-time.gif";

export function Channels() {
  const messageBoxRef = useRef();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [activeChannel, setActiveChannel] =useState(null)
  const [dataReady, setDataReady] = useState(false); //
  const [channelData, setChannelData] = useState();
  const [channelName, setChannelName] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverClass, setReceiverClass] = useState("");
  const [createChannelModal, setCreateChannelModal] = useState(false);
  const [showChannelDetails, setShowChannelDetails] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    setLoading(true);
    fetchChannels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messageData]);

  function fetchChannels(){
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
  }

  const fetchMessage = useCallback(
    (receiverId) => {
      console.log("Fetching messages:", receiverId);
      setLoadingChat(true);
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
          setLoadingChat(false);
        })
        .catch((error) => {
          console.error("Error fetching message data:", error);
          setError(error);

          // Check if the error status code indicates no available channels
          if (error.response && error.response.status === 404) {
            setMessageData(data);
          }
        });
    },
    [currentUser.headers]
  );

  const toggleChannelDetails = () => {
    setShowChannelDetails(!showChannelDetails);
  };

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  return (
    <div className="direct-message-cont">
      {modal ? (
        <div className="add-member-modal">
          <AddChannelMembers setModal={setModal} activeChannel={activeChannel}/>
        </div>
      ) : null}
      {createChannelModal ? (
        <div className="add-channel-modal">
          <CreateChannel fetchChannels={fetchChannels}setCreateChannelModal={setCreateChannelModal} />
        </div>
      ) : null}
      <>
        <div className="inbox">
          <header>
            <h1>CHANNELS</h1>
            <div className="create-channel">
              <Plus
                onClick={() => setCreateChannelModal(true)}
                className="add-channel-icon"
              />
            </div>
          </header>
          {!loading && dataReady && channelData && channelData.data ? (
            <div className="inbox-messages">
              {channelData.data.map((result) => (
                <button
                  className="inbox-item"
                  key={result.id}
                  onClick={async () => {
                    await fetchMessage(result.id);
                    setChannelName(result.name);
                    setReceiverClass("Channel");
                    setReceiverId(result.id);
                    setActiveChannel(result.id);
                  }}
                >
                  <div className="item-text">
                    <h1>{result.name}</h1>
                  </div>
                </button>
              ))}
            </div>
          ) : !loading && dataReady ? (
            <div
              className="inbox-messages"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <p>No messages yet</p>
            </div>
          ) : (
            <div
              className="inbox-messages"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <HashLoader color={"#Ffc07f"} speedMultiplier={0.8} />
            </div>
          )}
        </div>
        <div className="message-content">
          <header>
            {channelName ? (
              <>
                <div className="header-left">
                  <Info
                    onClick={toggleChannelDetails}
                    className="message-icons"
                  />
                  {showChannelDetails ? (
                    <div className="get-channel-details-modal">
                      <GetChannelDetails receiverId={receiverId} />
                    </div>
                  ) : null}
                </div>
                <div className="header-name">
                  <h1>{channelName}</h1>
                </div>
                <div className="header-right">
                  <UserPlus
                    className="message-icons"
                    onClick={() => setModal(true)}
                  />
                </div>
              </>
            ) : null}
          </header>

          <div className="message-body-cont">
            <div className="message-body">
              {!messageData && loadingChat ? (
                <div
                  className="message-box"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img style={{
                        background:
                          "linear-gradient(to top right, #f659a3, #Ffc07f)",
                      }} src={waiting} alt="" />
                  <PulseLoader color={"#Ffc07f"} speedMultiplier={0.8} />
                </div>
              ) : messageData && !loadingChat ? (
                messageData.data.length > 0 ? (
                  <div className="message-box" ref={messageBoxRef}>
                    {messageData.data.map((result) => (
                      <div
                        className={
                          currentUser.data.email === result.sender.email
                            ? "receiver-message"
                            : "sender-message"
                        }
                        key={result.id}
                      >
                        <p>
                          <span>
                            {result.sender.uid !== currentUser.headers.uid
                              ? result.sender.uid.split("@")[0]
                              : null}{" "}
                          </span>
                          {result.body}
                        </p>
                      </div>
                    ))}
                  </div>) : (
                  <div
                    className="message-box"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{
                        background:
                          "linear-gradient(to top right, #f659a3, #Ffc07f)",
                      }}
                      src={channelGif}
                      alt=""
                    />
                  </div>
                )
              ) : (
                <div
                  className="message-box"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(to top right, #f659a3, #Ffc07f)",
                  }}
                >
                  <img src={teatime} alt="" />
                </div>
              )}
            </div>
            <div className="message-input-box">
              {channelName ? (
                <div className="send-inner-cont">
                  <SendMessage
                    receiverClass={receiverClass}
                    receiverId={receiverId} 
                    fetchMessage={fetchMessage}
                    
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
