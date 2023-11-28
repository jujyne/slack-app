import React,{ useState }  from "react";
import { SearchBar } from "../../../../../components";

export function AddChannelMembers({activeChannel, setModal}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [receiverId, setReceiverId] = useState();
  

async function handleAddUser(event) {
    event.preventDefault();
    setLoading(true);
    console.log("Adding user");
    try {
      let response = await fetch("http://206.189.91.54/api/v1/channel/add_member", {
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
      });

      if (response.ok) {
        console.log("User added successfully");
      } else {
        console.error("Failed to add user. Response:", response);
        // put an error message to the user here
      }
    } catch (error) {
      console.error("Error adding user", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="add-channel-members-cont">
      <form onSubmit={handleAddUser}>
      <SearchBar setReceiverId={setReceiverId}/>
      <button type="submit">Add member</button>
      <button onClick={()=>setModal(false)}>Close</button>
      </form>
    </div>
  );
}
