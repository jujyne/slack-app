import React, { useState } from "react";
import { SearchBar, SendMessage } from "../../../../../components";
import toast from "react-hot-toast";
import { PulseLoader} from "react-spinners";


export function NewMessage({ setNewMessageModal, fetchData}) {
  const [loading, setLoading] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [message, setMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  async function handleSendMessage(event) {
    event.preventDefault();
    setLoading(true);
    console.log("sending message to", receiverId);
    if(receiverId == currentUser.data.id){
      toast.error("You can't send a message to yourself")
      setLoading(false);
    }
    if (receiverId && !(receiverId == currentUser.data.id)) {
      try {
        let response = await fetch("http://206.189.91.54/api/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            client: currentUser.headers.client,
            uid: currentUser.headers.uid,
            expiry: currentUser.headers.expiry,
            "access-token": currentUser.headers.accessToken,
          },
          body: JSON.stringify({
            receiver_id: receiverId,
            receiver_class: "User",
            body: message,
          }),
        });

        if (response.ok) {
          console.log("message sent");
          toast.success(`Message Sent!`);
          setMessage("");
          setNewMessageModal(false);
          setReceiverId(null);
          console.log(response);
          fetchData();
        } else {
          toast.error("Failed to send message. Response:", response);
        }
      } catch (error) {
        toast.error("Error sending message", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }else if (message == ''){
      toast.error("Message cannot be Empty")
    }
    else{
      toast.error("Invalid receiver!")
    }
  }

  return (
    <div className="new-message-cont">
      <h1>NEW MESSAGE</h1>
      <div className="new-message-form">
        <span className="new-message-receiver">
          <SearchBar className="nm-search" setReceiverId={setReceiverId} />
        </span>
        <form onSubmit={handleSendMessage} className="new-message-form">
          <div className="nm-textarea-cont">
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                console.log(message);
              }}
            ></textarea>
          </div>
          <div className="nm-send-button-cont">
            <button type="submit">{  loading? <PulseLoader color={"white"}  size={"0.4rem"} />:"Send"}</button>
            <button onClick={() => setNewMessageModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
