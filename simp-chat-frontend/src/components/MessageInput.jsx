import { useState } from "react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

function MessageInput({ handleSendMessage }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleShowEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    let composition = message;
    composition += emojiObject.emoji;
    setMessage(composition);
  };

  const handleSendClick = (e) => {
    e.preventDefault();
    if (message.length > 0) {
      handleSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div class="input-section">
      <div class="emoji-picker-wrapper">
        {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
      </div>
      <div class="emoji-btn">
        <button onClick={handleShowEmojiPicker}>
          <BsEmojiSmileFill class="smiley" />
        </button>
      </div>
      <div class="text-box">
        <form onSubmit={(e) => handleSendClick(e)}>
          <input
            type="text"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">
            <IoMdSend />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageInput;
