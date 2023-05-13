import React from "react";
import greeter from "../assets/greeter.gif";

function Welcome({ currentUser }) {
  return (
    <div class="welcome-wave">
      <div class="welcome-char">
        <img src={greeter} alt="Welcome" />
      </div>
      <div class="welcome-text">
        <h2>
          Hello, <span>{currentUser.firstName}</span>!
        </h2>
        <h3>Select a contact to start chatting.</h3>
      </div>
    </div>
  );
}

export default Welcome;
