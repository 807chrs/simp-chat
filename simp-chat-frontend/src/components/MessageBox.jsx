import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { sendMessageRoute, getAllMessages } from "../utilities/ApiRoutes";
import MessageInput from "../components/MessageInput";

function MessageBox({ selectedConvo, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("user-details");
    const currentUser = storedUserDetails && JSON.parse(storedUserDetails);
    const retrieveAllMessages = async () => {
      if (!selectedConvo) {
        return;
      }
      const response = await axios.post(getAllMessages, {
        from: currentUser._id,
        to: selectedConvo._id,
      });
      setMessages(response.data);
    };

    if (currentUser) {
      retrieveAllMessages();
    }
  }, [selectedConvo]);

  const handleSendMessage = async (message) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: selectedConvo._id,
      message: message,
    });
    socket.current.emit("send-message", {
      to: selectedConvo._id,
      from: currentUser._id,
      message: message,
    });
    const liveMessages = [...messages];
    liveMessages.push({ fromSelf: true, message: message });
    setMessages(liveMessages);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message-received", (message) => {
        setArrivalMessage({ fromSelf: false, message: message });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((previous) => [...previous, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      {selectedConvo && (
        <div class="message-box">
          <div class="convo-header">
            <div class="convo-profile-img">
              <img
                src={selectedConvo.profileImage.url}
                alt="Profile"
                className="contact-profiles"
              />
            </div>
            <div class="convo-profile-name">
              <h3>
                {selectedConvo.firstName} {selectedConvo.lastName}
              </h3>
              <p>{selectedConvo.userName}</p>
            </div>
          </div>
          <div class="chat-bubble">
            {messages.map((message) => {
              return (
                <div
                  ref={scrollRef}
                  key={uuidv4()}
                  class={`message: ${message.fromSelf ? "sent" : "received"}`}
                >
                  <p>{message.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="message-input">
        <MessageInput handleSendMessage={handleSendMessage} />
      </div>
    </>
  );
}

export default MessageBox;
