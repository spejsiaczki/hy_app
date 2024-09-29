// Assuming you are using React or vanilla JavaScript for your frontend
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io();

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Upload the file via an HTTP POST request
    const response = await fetch("/video", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      // Start WebSocket connection after successful upload
      startWebSocket();
    } else {
      alert(data.error);
    }
  };

  const startWebSocket = () => {
    socket.emit("start_updates"); // Request updates from server

    // Listen for update messages
    socket.on("update", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    // Handle completion and disconnect
    socket.on("complete", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
      socket.disconnect();
    });
  };

  return (
    <div>
      <h1>Upload Video</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Updates</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploadComponent;
