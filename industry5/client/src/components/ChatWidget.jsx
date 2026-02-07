import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  container: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999 },
  button: { 
    background: '#007bff', color: 'white', border: 'none', 
    padding: '15px 20px', borderRadius: '30px', cursor: 'pointer', 
    fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    fontSize: '16px'
  },
  window: { 
    width: '320px', height: '450px', background: 'white', 
    borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.4)', 
    display: 'flex', flexDirection: 'column', overflow: 'hidden', 
    border: '1px solid #ddd' 
  },
  header: { 
    background: '#007bff', color: 'white', padding: '15px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    fontWeight: 'bold' 
  },
  closeBtn: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' },
  messages: { flex: 1, padding: '15px', overflowY: 'auto', background: '#f9f9f9' },
  messageBubble: { padding: '10px 14px', borderRadius: '14px', marginBottom: '10px', maxWidth: '80%', fontSize: '14px', lineHeight: '1.4' },
  inputArea: { display: 'flex', borderTop: '1px solid #eee', padding: '10px' },
  input: { flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '20px', marginRight: '10px', outline: 'none' },
  sendBtn: { background: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '20px', cursor: 'pointer' }
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am KL. Ask me anything." }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // --- UPDATED: Points to NODE server now (Port 5000) ---
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input
      });
      
      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: Is the Node server running?" }]);
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={styles.button}>
          Chat with AI 💬
        </button>
      )}

      {isOpen && (
        <div style={styles.window}>
          <div style={styles.header}>
            <span>KL Assistant</span>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✖</button>
          </div>

          <div style={styles.messages}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                ...styles.messageBubble,
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e9ecef",
                color: msg.sender === "user" ? "white" : "#333",
                marginLeft: msg.sender === "user" ? "auto" : "0"
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div style={{...styles.messageBubble, background: "#e9ecef", color: "#666"}}>Thinking...</div>}
          </div>

          <div style={styles.inputArea}>
            <input 
              style={styles.input}
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask here..."
            />
            <button onClick={sendMessage} style={styles.sendBtn}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;