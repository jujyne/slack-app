import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { SendMessage } from "../sendMessage";

export function GetChannelDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {}, [activeChannel]);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching channel data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching channel data</p>;
  }

  if (channelData && channelData.data && channelData.data.length > 0) {
    return (
      <div className="get-channel-details-cont">
        <div className="channel-name">
          {channelData.data.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                setActiveChannel(result.id);
                setChannelName(result.name);
              }}
            >
              {result.name}
            </button>
          ))}
        </div>
        <div className="channel-message">
          <h1>{channelName}</h1>
          {channelName?<SendMessage/>:null}
        </div>
      </div>
    );
  }

  return <p>No channel data available.</p>;
}
