// test_socket.js

const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdlYTVmZGMwOTA5OGMxZmRjZTViMjkiLCJyb2xlIjoic2Vla2VyIiwiaWF0IjoxNzUzMTg5NTg3LCJleHAiOjE3NTM3OTQzODd9.9UQAKPiBl-EyZgQAhMiBC86Pyk_TCq1TX0BdCDWwNoc", // 🔁 Replace with actual JWT token
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected to server as socket:", socket.id);

  // Replace with valid user and chatRoom IDs from your DB
  const toUserId = "687ea89c3ab31bfac1d08eef";
  const chatRoomId = "687eacc73ab31bfac1d08f06";

  // Emit a message
  socket.emit("sendMessage", {
    to: toUserId,
    message: "Hello from test_socket.js!",
    chatRoomId: chatRoomId,
  });
});

socket.on("receiveMessage", (data) => {
  console.log("📨 Message received by server:", data);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
