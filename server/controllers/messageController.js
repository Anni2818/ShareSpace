const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

// Send a new message and emit via socket
exports.sendMessage = async (req, res) => {
  try {
    const { to, message, chatRoomId } = req.body;
    const from = req.user._id;

    // Validate chat room
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    // Check if both sender and receiver are participants
    const isFromParticipant = chatRoom.participants.some(
      (id) => id.toString() === from.toString()
    );
    const isToParticipant = chatRoom.participants.some(
      (id) => id.toString() === to.toString()
    );

    if (!isFromParticipant || !isToParticipant) {
      return res.status(403).json({ error: 'Unauthorized messaging attempt' });
    }

    // Save message to DB
    const newMessage = new Message({
      from,
      to,
      message,
      chatRoomId,
    });

    await newMessage.save();

    // Emit message via socket to receiver
    const io = req.app.get('io'); // Access Socket.IO instance
    io.to(to.toString()).emit('receiveMessage', {
      from: from.toString(),
      message,
      chatRoomId,
      timestamp: newMessage.timestamp,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all messages between two users (optionally filtered by chatRoomId)
exports.getChatMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { chatRoomId } = req.query;
    const currentUserId = req.user._id;

    const query = {
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId },
      ],
    };

    if (chatRoomId) {
      query.chatRoomId = chatRoomId;
    }

    const messages = await Message.find(query).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Mark messages from a specific user as read
exports.markAsRead = async (req, res) => {
  try {
    const { from } = req.body;
    const to = req.user._id;

    await Message.updateMany(
      { from, to, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};
