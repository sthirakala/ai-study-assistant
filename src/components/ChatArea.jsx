import { useState, useEffect, useRef } from "react";
import { RiRobot2Fill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import "./css/ChatArea.css";

const ChatArea = () => {
  const chatEnd = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {

  if (!message.trim()) return;

  setLoading(true);

  try {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: message,
          history: messages
        }),
      }
    );

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        user: message,
        ai: data.answer,
      },
    ]);

    setMessage("");

  } catch(error) {

    console.error(error);

    setMessages((prev)=>[
      ...prev,
      {
        user: message,
        ai: "Sorry, I had difficulty connecting"
      }
    ]);

  } finally {
    setLoading(false);
  }

};
useEffect(()=>{
  chatEnd.current?.scrollIntoView({
    behavior:"smooth"
  });
}, [messages]);


  return (
    <div className="chat-window">

      <h2 className="chat-title">
        <RiRobot2Fill className="chat-icon" />
        AI Assistant
      </h2>


      <p className="chat-description">
        Ask questions about your uploaded study material.
      </p>


      <div className="chat-messages">

  {messages.length === 0 && (
    <div className="ai-message">
      Hello! Upload your notes and I'll help you study.
    </div>
  )}

  {messages.map((msg, index) => (
    <div key={index}>

      <div className="user-message">
        <strong>You</strong>
        <br />
        {msg.user}
      </div>

      <div className="ai-message">
        <strong>StudyBuddy</strong>
        <br />
        <ReactMarkdown>
        {msg.ai}
        </ReactMarkdown>
      </div>

    </div>
 
  ))}
  <div ref={chatEnd}></div>

</div>


      <div className="chat-input-area">

        <input
          className="chat-input"
          type="text"
          placeholder="Ask a question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />


        <button
          className="send-button"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>

      </div>


    </div>
  );
};


export default ChatArea;