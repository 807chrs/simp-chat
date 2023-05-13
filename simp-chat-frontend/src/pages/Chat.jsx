import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utilities/ApiRoutes";
import { io } from "socket.io-client";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import MessageBox from "../components/MessageBox";
import Logout from "../components/Logout";
import Logo from "../components/Logo";

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState(undefined);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("user-details");
    if (storedUserDetails) {
      setCurrentUser(JSON.parse(storedUserDetails));
      setIsLoaded(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const getAllUsers = async () => {
      if (currentUser) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      }
    };
    getAllUsers();
  }, [currentUser]);

  const handleContactSelect = (chat) => {
    setSelectedConvo(chat);
  };

  return (
    <>
      <div class="card">
        <div class="chat-header">
          <div class="chat-logo">
            <Logo />
          </div>
          <div class="chat-logout">
            <Logout />
          </div>
        </div>
        <div class="chat-body">
          <div class="side-bar">
            <div class="title">
              <h2>Contacts</h2>
            </div>
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeContact={handleContactSelect}
              class="contacts"
            />
            <div class="user">
              {currentUser ? (
                <div class="user-details">
                  <div class="user-profile-img">
                    <img
                      src={currentUser.profileImage.url}
                      alt="Profile"
                      className="contact-profiles"
                    />
                  </div>
                  <div class="contact-details">
                    <h3>
                      {currentUser.firstName} {currentUser.lastName}
                    </h3>
                    <p>{currentUser.userName}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div class="chat-box">
            <div class="messages">
              <div className="messages">
                {isLoaded && selectedConvo === undefined ? (
                  <Welcome currentUser={currentUser} />
                ) : (
                  <MessageBox
                    selectedConvo={selectedConvo}
                    currentUser={currentUser}
                    socket={socket}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
