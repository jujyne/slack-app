import React, { useEffect, useState, useCallback } from "react";
import { SendMessage } from "../../../components";

export function DirectMessages() {
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [dataReady, setDataReady] = useState(false); // Introduce a state variable for data readiness
  const [error, setError] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const [activeName, setActiveName] = useState(null);
  const [messageName, setMessageName] = useState("");
  const [rawMessage, setRawMessage] = useState(null);
  const [senderMessage, setSenderMessage] = useState(null);
  const [receiverMessage, setReceiverMessage] = useState(null);
  const [userDisplay, setUserDisplay] = useState([]);
  const [arrangedUserDisplay, setArrangedUserDisplay] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userIds = userData.map((user) => ({ id: user.id, email: user.email }));

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [receiverId, setReceiverId] = useState();

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

  const fetchUserIds = useCallback(async (id) => {
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
          };

          setUserDisplay((prevUserDisplay) => [...prevUserDisplay, newEntry]);

          setArrangedUserDisplay((prevArrangedUserDisplay) => [
            ...getUniqueEntriesWithHighestMessageId([
              ...prevArrangedUserDisplay,
              newEntry,
            ]),
          ].sort((a, b) => b.message_id - a.message_id));
        }
      }
    } catch (error) {
      console.error("Error fetching message data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser.headers]);

  const fetchMessage = useCallback((receiverId) => {
    console.log("Fetching messages:", receiverId);
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
  }, [currentUser.headers]);

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
      {loading && <p>Loading...</p>}
      {!loading && dataReady && (
        <>
          <div className="inbox">
            {arrangedUserDisplay.map((user) => (
              <button key={user.id} onClick={() => fetchMessage(user.id)}>
                {user.email}
              </button>
            ))}
          </div>
          <div className="message-content">
            <h1>{messageName}</h1>
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
                  {result.body}
                </div>
              ))}
            </div>
            {/* {messageName ? <SendMessage /> : null} */}
          </div>
        </>
      )}
      {!loading && !dataReady && <p>Data is not ready yet.</p>}
    </div>
  );
}