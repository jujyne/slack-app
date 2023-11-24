import React, { useEffect, useState, useCallback, useRef } from "react";
import { SearchBar, SendMessage } from "../../../components";
import pic from "../../../assets/images/profile-pic.png";
import { Info, Phone, Video } from "lucide-react";

export function DirectMessages() {
  const messageBoxRef = useRef();
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [dataReady, setDataReady] = useState(false); // Introduce a state variable for data readiness

  const [error, setError] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [messageName, setMessageName] = useState("");
  const [userDisplay, setUserDisplay] = useState([]);
  const [receiverClass, setReceiverClass] = useState("");
  const [arrangedUserDisplay, setArrangedUserDisplay] = useState([]);
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
    const fetchData = async () => {
      setLoading(true);
      console.log(userIds);
      try {
        for (const userId of userIds) {
          await fetchUserIds(userId);
        }
        setDataReady(true); // Set dataReady to true when all data is fetched
      } catch (error) {
        console.error("Error fetching message data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUserIds = useCallback(
    async (id) => {
      try {
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
              body: data.data[0].body,
            };
            console.log(newEntry);
            setUserDisplay((prevUserDisplay) => [...prevUserDisplay, newEntry]);

            setArrangedUserDisplay((prevArrangedUserDisplay) =>
              [
                ...getUniqueEntriesWithHighestMessageId([
                  ...prevArrangedUserDisplay,
                  newEntry,
                ]),
              ].sort((a, b) => b.message_id - a.message_id)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching message data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [currentUser.headers]
  );

  const fetchMessage = useCallback(
    (receiverId) => {
      console.log("Fetching messages:", receiverId);
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
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching message data:", error);
          setError(error);
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
      <>
        <div className="inbox">
          <header>
            <h1>INBOX</h1>
          </header>
          {!loading && dataReady && (
            <div className="inbox-messages">
              {arrangedUserDisplay.map((user) => (
                <button
                  className="inbox-item"
                  key={user.id}
                  onClick={() => {
                    fetchMessage(user.id);
                    setMessageName(user.email);
                    setReceiverId(user.id);
                    setReceiverClass("User");
                  }}
                >
                  <img src={pic} alt="" />
                  <div className="item-text">
                    <h1>{user.email}</h1>
                    <span>{user.body}</span>
                  </div>
                </button>
              ))}
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
                  <h1>{messageName}</h1>
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
            </div>
            <div className="message-input-box">
              {messageName ? (
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
