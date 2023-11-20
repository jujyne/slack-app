import React, { useState, useEffect } from 'react';
import { SearchBar } from '../search';


export function RetrieveMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

  const [receiverId, setReceiverId] = useState(currentUser.data.id);
  useEffect(() => {
    fetchData();
  }, [receiverId]);

  

  async function fetchData() {
    setLoading(true);
    console.log('loading messages');
    try {
      const response = await fetch(
        `http://206.189.91.54/api/v1/messages?receiver_id=${receiverId}&receiver_class=User`, // Adjust the URL as needed
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            client: currentUser.headers.client,
            uid: currentUser.headers.uid,
            expiry: currentUser.headers.expiry,
            'access-token': currentUser.headers.accessToken,
          },
        }
      );

      if (response.ok) {
        console.log('messages displayed');
        const data = await response.json();
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error displaying messages', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <SearchBar setReceiverId={setReceiverId}/>
    <div>
      {loading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p>Error loading messages.</p>
      ) : (
        <div>
          {messages.map((message) => (
            <div key={message.id}>
              <p>Message ID: {message.id}</p>
              <p>Body: {message.body}</p>
              <p>Created At: {message.created_at}</p>
              <p>Sender: {message.sender.email}</p>
              <p>Receiver: {message.receiver.email}</p>
              {/* Add more properties as needed */}
            </div>
          ))}
        </div>
      )}
    </div></>
    
  );
}
