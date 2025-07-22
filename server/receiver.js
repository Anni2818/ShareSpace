// test_sender.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token: "YOUR_SENDER_JWT_TOKEN", // must be another user
  },
});

socket.on("connect", () => {
  console.log("✅ Sender connected:", socket.id);

  // Simulate sending a message
  socket.emit("sendMessage", {
    to: "687ea89c3ab31bfac1d08eef", // receiver user ID
    chatRoomId: "64eab58deafc676e452a7f41", // valid chatRoomId with both users
    message: "Hello from test_sender.js 👋",
  });
});

socket.on("connect_error", (err) => {
  console.error("❌ Sender connection error:", err.message);
});
