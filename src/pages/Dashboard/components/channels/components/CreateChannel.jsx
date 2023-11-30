import React, { useState } from "react";
import { SearchBar } from "../../../../../components";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";

export function CreateChannel({ setCreateChannelModal, fetchChannels}) {
  const [loading, setLoading] = useState(false);
  const [channelName, setChannelName] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  async function handleCreateChannel(event) {
    event.preventDefault();
    setLoading(true);
    console.log("Creating Channel");
    if (channelName) {
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
          toast.success("Channel created successfully")
          setChannelName("");
          setCreateChannelModal(false);
          fetchChannels();
        } else {
          console.error("Failed to create channel. Response:", response);
          // put an error message to the user here
        }
      } catch (error) {
        console.error("Error creating channel", error);
      } finally {
        setLoading(false);
      }
    } else{
      toast.error("Invalid Channel Name!")
    }
  }

  return (
    <div className="create-channel-cont">
      <span>CREATE CHANNEL</span>
      <form onSubmit={handleCreateChannel}>
        <input
          type="text"
          placeholder="Channel name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <div>
          <button type="submit">Create Channel</button>
          <button onClick={() => setCreateChannelModal(false)}>Close</button>
        </div>
      </form>
    </div>
  );
}
