import React, { useState, useEffect } from "react";

export function GetChannelDetails({ receiverId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelUsers, setChannelUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userData = JSON.parse(localStorage.getItem("userData"));

  async function fetchData() {
    setLoading(true);
    console.log("Fetching channel details");

    try {
      let response = await fetch(
        `http://206.189.91.54/api/v1/channels/${receiverId}`,
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

      console.log("Response:", response); // Log the response

      if (response.ok) {
        const data = await response.json();
        console.log("Data:", data); // Log the data
        setChannelUsers(data);
      } else {
        console.error("Failed to fetch channel details. Response:", response);
        setError("Failed to fetch channel details");
      }
    } catch (error) {
      console.error("Error fetching channel details", error);
      setError("Error fetching channel details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  console.log("Rendering component"); // Add this line

  return (
    <div className="get-channel-details">
      <p className="channel-owner">
        Channel owner:
        <br></br>
        <span>
          {
            userData
              .find((user) => user.id === channelUsers.data?.owner_id)
              ?.uid.split("@")[0]
          }
        </span>
      </p>
      <h1>Members:</h1>
      {channelUsers.data?.channel_members.map(
        (channel_member) =>
          // Check if the channel_member's user_id is not equal to the owner_id
          channel_member.user_id !== channelUsers.data.owner_id && (
            <p className="channel-members-list" key={channel_member.id}>
              {userData
                .filter((user) => user.id === channel_member.user_id)
                .map((filteredUser) => (
                  <span key={channel_member.id}>
                    {filteredUser.uid.split("@")[0]}
                  </span>
                ))}
            </p>
          )
      )}
    </div>
  );
}
