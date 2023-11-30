import React, { useEffect, useState, useCallback, useRef } from "react";
import { SearchBar, SendMessage } from "../../../../components";
import { NewMessage } from "./component";
import pic from "../../../../assets/images/profile-pic.png";
import { Info, Phone, Plus, Video, MailPlus } from "lucide-react";
import { HashLoader, PulseLoader } from "react-spinners";
import channelGif from "../../../../assets/images/channel-gif.gif";
import waiting from "../../../../assets/images/waiting.gif";
import teatime from "../../../../assets/images/tea-time.gif";
import toast from "react-hot-toast";

export function DirectMessages() {
  const messageBoxRef = useRef();
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const [messageName, setMessageName] = useState("");
  const [userDisplay, setUserDisplay] = useState([]);
  const [receiverClass, setReceiverClass] = useState("");
  const [arrangedUserDisplay, setArrangedUserDisplay] = useState([]);
  const [newMessageModal, setNewMessageModal] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData")) || null;
  const userIds = userData.map((user) => ({ id: user.id, email: user.email }));

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [receiverId, setReceiverId] = useState();

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messageData]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    console.log(userIds);
    try {
      for (const userId of userIds) {
        await fetchUserIds(userId);
      }
      setDataReady(true);
    } catch (error) {
      toast.error("Error fetching message data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserIds = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://206.189.91.54/api/v1/messages?receiver_id=${id.id}&receiver_class=User`,
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
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched message data:", data);

          const highestMessageId =
            data.data.length > 0
              ? data.data.reduce((maxId, currentMessage) => {
                  const messageId = currentMessage.id;
                  return messageId > maxId ? messageId : maxId;
                }, data.data[0].id)
              : null;

          if (data.data.length > 0) {
            const newEntry = {
              message_id: highestMessageId,
              id: id.id,
              email: id.email,
              body: data.data[data.data.length - 1].body,
            };
            console.log("new entry", newEntry);
            setUserDisplay((prevUserDisplay) => [...prevUserDisplay, newEntry]);

            setArrangedUserDisplay((prevArrangedUserDisplay) =>
              [
                ...getUniqueEntriesWithHighestMessageId([
                  ...prevArrangedUserDisplay,
                  newEntry,
                ]),
              ].sort((a, b) => b.message_id - a.message_id)
            );
            console.log("arranged inbox", arrangedUserDisplay);
          }
        }
      } catch (error) {
        toast.error("Error fetching message data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [currentUser.headers]
  );

  const fetchMessage = useCallback(
    (receiverId) => {
      console.log("Fetching messages:", receiverId);
      setLoadingChat(true);
      if (messageData) {
        setMessageData(null);
      }
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
          setLoadingChat(false);
        })
        .catch((error) => {
          toast.error("Error fetching message data:", error);
          setLoadingChat(false);
        });
    },
    [currentUser.headers]
  );

  const getUniqueEntriesWithHighestMessageId = useCallback((entries) => {
    return entries.reduce((acc, entry) => {
      const existingEntry = acc.find((e) => e.id === entry.id);

      if (!existingEntry || entry.message_id > existingEntry.message_id) {
        if (existingEntry) {
          acc = acc.filter((e) => e.id !== entry.id);
        }
        acc.push(entry);
      }

      return acc;
    }, []);
  }, []);

  return (
    <div className="direct-message-cont">
      {newMessageModal ? (
        <div className="new-message-modal">
          <NewMessage setNewMessageModal={setNewMessageModal} fetchData={fetchData}/>
        </div>
      ) : null}
      <div className="inbox">
        <header>
          <h1>INBOX</h1>{" "}
          <Plus
            className="add-channel-icon"
            onClick={() => setNewMessageModal(true)}
          />
        </header>
        {!loading && dataReady && arrangedUserDisplay.length > 0 ? (
          <div className="inbox-messages">
            {arrangedUserDisplay.map((user) => (
              <button
                className="inbox-item"
                key={user.id}
                onClick={() => {
                  setMessageData([]);
                  fetchMessage(user.id);
                  setMessageName(user.email);
                  setReceiverId(user.id);
                  setReceiverClass("User");
                }}
              >
                <img src={pic} alt="" />
                <div className="item-text">
                  <h1>{user.email.split("@")[0]}</h1>
                  <span>{user.body}</span>
                </div>
              </button>
            ))}
          </div>
        ) : !loading && dataReady && arrangedUserDisplay.length === 0 ? (
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
            <HashLoader
              color={"#Ffc07f"}
              speedMultiplier={0.8}
              aria-label={"Loading Spinner"}
            />
          </div>
        )}
      </div>
      <div className="message-content">
        <header>
          {messageName ? (
            <>
              <div className="header-left">
                <Info className="message-icons" />
              </div>
              <div className="header-name">
                <img src={pic} alt="" />
                <h1>{messageName.split("@")[0]}</h1>
              </div>
              <div className="header-right">
                <Phone className="message-icons" />
                <Video className="message-icons" />
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
                <img
                  style={{
                    background:
                      "linear-gradient(to top right, #f659a3, #Ffc07f)",
                    zIndex: "5",
                  }}
                  src={waiting}
                  alt=""
                />
                <PulseLoader color={"#Ffc07f"} speedMultiplier={0.8} />
              </div>
            ) : messageData && !loadingChat ? (
              messageData.data.length > 0 ? (
                <div className="message-box" ref={messageBoxRef}>
                  {messageData?.data.map((result) => (
                    <div
                      className={
                        currentUser.data.email === result.sender.email
                          ? "receiver-message"
                          : "sender-message"
                      }
                      key={result.id}
                    >
                      <p>{result.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
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
                  background: "linear-gradient(to top right, #f659a3, #Ffc07f)",
                }}
              >
                <img src={teatime} alt="" />
              </div>
            )}
          </div>
          <div className="message-input-box">
            {messageName ? (
              <div className="send-inner-cont">
                <SendMessage
                  receiverClass={receiverClass}
                  receiverId={receiverId}
                  fetchMessage={fetchMessage}
                  fetchData={fetchData}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
