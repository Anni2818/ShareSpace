// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const passport = require('passport');
// const http = require('http');
// const { Server } = require('socket.io');
// const jwt = require('jsonwebtoken');

// const connectDB = require('./config/db');
// const User = require('./models/User');

// require('./config/passport'); // Google OAuth setup

// const app = express();
// connectDB();

// // Middlewares
// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true,
// }));
// app.use(express.json());
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'supersecretkey',
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // API Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/posts', require('./routes/postRoutes'));
// app.use('/api/requests', require('./routes/requestRoutes'));
// app.use('/api/matches', require('./routes/matchRotes'));
// app.use('/api/chat', require('./routes/chatRoomRoutes'));
// app.use('/api/messages', require('./routes/messageRoutes'));

// // Google OAuth
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
//   }
// );

// // ---------------------------------------------
// // SOCKET.IO LOGIC — only after request is accepted
// // ---------------------------------------------
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   }
// });

// // Authenticate each socket using JWT
// io.use(async (socket, next) => {
//   const token = socket.handshake.auth?.token;
//   if (!token) return next(new Error('Authentication token missing'));

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);
//     if (!user) return next(new Error('User not found'));

//     socket.user = user;
//     next();
//   } catch (err) {
//     return next(new Error('Invalid token'));
//   }
// });
// io.on('connection', (socket) => {
//   const userId = socket.user._id.toString();
//   socket.join(userId);
//   console.log(`✅ Connected: ${socket.id} (User: ${userId})`);

//   socket.on('sendMessage', async ({ to, message, chatRoomId }) => {
//     try {
//       const chatRoom = await ChatRoom.findById(chatRoomId);
//       if (!chatRoom) return;

//       const isParticipant = chatRoom.participants.some(
//         (id) => id.toString() === userId || id.toString() === to
//       );
//       if (!isParticipant) return;

//       const newMessage = new Message({
//         from: userId,
//         to,
//         message,
//         chatRoomId,
//       });
//       await newMessage.save();

//       io.to(to).emit('receiveMessage', {
//         from: userId,
//         message,
//         chatRoomId,
//         timestamp: newMessage.timestamp,
//       });
//     } catch (err) {
//       console.error('Socket sendMessage error:', err.message);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log(`❌ Disconnected: ${socket.id}`);
//   });
// });

// // Attach io to app for use in controllers (optional)
// app.set('io', io);

// // Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT,'0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');

require('./config/passport'); // Google OAuth setup

const app = express();
connectDB();

// -----------------------
// 🌐 Express Middlewares
// -----------------------
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// -----------------------
// 📦 API Routes
// -----------------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/matches', require('./routes/matchRotes'));
app.use('/api/chat', require('./routes/chatRoomRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// -----------------------
// 🔐 Google OAuth Route
// -----------------------
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// -----------------------
// ⚡ Setup Socket.IO
// -----------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  }
});

// ✅ Socket.IO JWT Authentication Middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication token missing'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return next(new Error('User not found'));

    socket.user = user; // Attach user to socket
    next();
  } catch (err) {
    console.error("Socket Auth Error:", err.message);
    return next(new Error('Invalid or expired token'));
  }
});

// ✅ Socket.IO Events
io.on('connection', (socket) => {
  const userId = socket.user._id.toString();
  socket.join(userId); // Join personal room

  console.log(`✅ Socket connected: ${socket.id} (User: ${userId})`);

  // 📩 Handle sendMessage event
  socket.on('sendMessage', async ({ to, message, chatRoomId }) => {
    try {
      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) return;

      const isParticipant = chatRoom.participants.some(
        (id) => id.toString() === userId || id.toString() === to
      );
      if (!isParticipant) return;

      const newMessage = new Message({
        from: userId,
        to,
        message,
        chatRoomId,
      });
      await newMessage.save();

      // Emit to recipient only
      io.to(to).emit('receiveMessage', {
        from: userId,
        message,
        chatRoomId,
        timestamp: newMessage.timestamp,
      });
    } catch (err) {
      console.error('Socket sendMessage error:', err.message);
    }
  });

  // 🔌 Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Make io available in routes/controllers if needed
app.set('io', io);

// -----------------------
// 🚀 Start Server
// -----------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
