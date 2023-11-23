import React, { useState } from "react";
import { SearchBar } from "../../../../../components";

export function CreateChannel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [receiverId, setReceiverId] = useState();
  const channelUsers = [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  async function handleCreateChannel(event) {
    event.preventDefault();
    setLoading(true);
    console.log("Creating Channel");
    try {
      let response = await fetch("http://206.189.91.54/api/v1/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          client: currentUser.headers.client,
          uid: currentUser.headers.uid,
          expiry: currentUser.headers.expiry,
          "access-token": currentUser.headers.accessToken,
        },
        body: JSON.stringify({
          name: channelName,
          user_ids: [currentUser.headers.uid],
        }),
      });

      if (response.ok) {
        console.log("Channel created successfully");
        setChannelName("");
      } else {
        console.error("Failed to create channel. Response:", response);
        // put an error message to the user here
      }
    } catch (error) {
      console.error("Error creating channel", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  function handleAddUser() {
    channelUsers.push[receiverId];
    console.log(receiverId, " added");
  }

  return (
    <div className="create-channel-cont">
      <form onSubmit={handleCreateChannel}>
        <span>Create Channel</span>
        <input
          type="text"
          placeholder="Channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <SearchBar setReceiverId={setReceiverId} />
        <button onClick={handleAddUser}>add user</button>
        <div>Channel Users</div>
        <div></div>
        <button type="submit">Create Channel</button>
      </form>
    </div>
  );
}
