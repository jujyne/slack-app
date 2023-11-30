import React, { useState } from "react";
import { SearchBar } from "../../../../../components";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";

export function AddChannelMembers({ activeChannel, setModal }) {
  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [receiverId, setReceiverId] = useState();

  async function handleAddUser(event) {
    event.preventDefault();
    setLoading(true);
    console.log("Adding user");
    if (receiverId == currentUser.data.id) {
      toast.error("You are already in this channel");
      setLoading(false);
    }
    if (receiverId && !(receiverId == currentUser.data.id)) {
      try {
        let response = await fetch(
          "http://206.189.91.54/api/v1/channel/add_member",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              client: currentUser.headers.client,
              uid: currentUser.headers.uid,
              expiry: currentUser.headers.expiry,
              "access-token": currentUser.headers.accessToken,
            },
            body: JSON.stringify({
              id: activeChannel,
              member_id: receiverId,
            }),
          }
        );

        if (response.ok) {
          console.log("User added successfully");
          toast.success("User added successfully");
          setModal(false);
          console.log(response);
        } else {
          toast.error("Failed to add user");
        }
      } catch (error) {
        console.error("Error adding user", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Invalid User");
      setLoading(false);
    }
  }
  return (
    <div className="add-channel-members-cont">
      <h1>ADD MEMBER</h1>
      <form onSubmit={handleAddUser}>
        <SearchBar setReceiverId={setReceiverId} />
        <div>
          <button type="submit">
            {loading ? (
              <PulseLoader color={"white"} size={"0.4rem"} />
            ) : (
              "Add member"
            )}
          </button>
          <button onClick={() => setModal(false)}>Close</button>
        </div>
      </form>
    </div>
  );
}
