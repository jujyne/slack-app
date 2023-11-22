import React, { useState, useEffect } from "react";
import { SearchBar } from "../search";

export function RetrieveMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [uniqueEmails, setUniqueEmails] = useState([]);
  const [organizedMessages, setOrganizedMessages] = useState({}); // Declare organizedMessages state

  const userData = JSON.parse(localStorage.getItem("userData"));
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  const [receiverId, setReceiverId] = useState(currentUser?.data?.id);

  useEffect(() => {
    fetchData();
  }, [receiverId]);

  async function fetchData() {
    setLoading(true);
    console.log("loading messages");
    try {
      const response = await fetch(
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
      );

      if (response.ok) {
        console.log("messages displayed");
        const responseData = await response.json();
        console.log("Received data:", responseData);

        // Check if there is data in the response
        if (responseData.data && responseData.data.length > 0) {
          const organized = organizeMessages(responseData.data);
          console.log("Organized messages:", organized);
          setMessages(responseData.data);
          setOrganizedMessages(organized);
        } else {
          console.log("No messages received.");
          setMessages([]);
          setOrganizedMessages({});
        }
      }
    } catch (error) {
      console.error("Error displaying messages", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  function organizeMessages(data) {
    // Combine sent and received messages into one array
    const allMessages = data.flatMap((message) => {
      const senderEmail = message.sender?.email;
      const receiverEmail = message.receiver?.email;
  
      // Check if both sender and receiver are defined and have email property
      if (senderEmail && receiverEmail) {
        return [
          {
            senderEmail,
            receiverEmail,
            message,
            message_id: message.id, // Use message_id instead of created_at for sorting
          },
        ];
      }
  
      // Handle the case where either sender or receiver is undefined
      return [];
    });
  
    // Organize messages by sender and receiver email
    const organized = allMessages.reduce((acc, { senderEmail, receiverEmail, message, message_id }) => {
      const key = `${senderEmail}_${receiverEmail}`;
  
      if (!acc[key]) {
        acc[key] = [];
      }
  
      acc[key].push({ message, message_id });
      return acc;
    }, {});
  
    // Sort unique email combinations based on the most recent message_id
    const sortedEmails = Object.entries(organized)
      .sort(
        ([, messagesA], [, messagesB]) =>
          messagesB[messagesB.length - 1].message_id - messagesA[messagesA.length - 1].message_id
      )
      .map(([emailCombination]) => emailCombination.split("_"));
  
    setUniqueEmails(sortedEmails);
  
    return organized; // Return the organized data
  }
  return (
    <>
      <SearchBar setReceiverId={setReceiverId} />
      <div>
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p>Error loading messages.</p>
        ) : (
          <div>
            {uniqueEmails.map(([senderEmail, receiverEmail]) => (
              <div key={`${senderEmail}_${receiverEmail}`}>
                <h3>Sender: {senderEmail}</h3>
                <h3>Receiver: {receiverEmail}</h3>
                {organizedMessages[`${senderEmail}_${receiverEmail}`].map(
                  ({ message, interactionDate }) => (
                    <div key={message.id}>
                      <p>Message ID: {message.id}</p>
                      <p>Body: {message.body}</p>
                      <p>Created At: {message.created_at}</p>
                      {/* Add more properties as needed */}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
