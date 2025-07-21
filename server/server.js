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

require('./config/passport'); // Google OAuth setup

const app = express();
connectDB();

// Express Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// Session middleware (needed for passport OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Routes
app.use('/api/auth', require('./routes/authRoutes'));
// At the top with other imports
app.use('/api/posts', require('./routes/postRoutes'));

// Google OAuth Routes
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

// --------------------
// SOCKET.IO INTEGRATION
// --------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  }
});

// Socket.IO Authentication (JWT-based)
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication token missing'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return next(new Error('User not found'));

    socket.user = user;
    next();
  } catch (err) {
    return next(new Error('Invalid token'));
  }
});

// Socket.IO Events
io.on('connection', (socket) => {
  const userId = socket.user._id.toString();
  socket.join(userId);
  console.log(`✅ Socket connected: ${socket.id} (user: ${userId})`);

  socket.on('sendMessage', ({ to, message }) => {
    io.to(to).emit('receiveMessage', {
      from: userId,
      message,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
