const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { to, message, chatRoomId } = req.body;
    const from = req.user._id;

    // Fetch the chat room and validate it exists
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    // Verify both users are participants
    const isFromParticipant = chatRoom.participants.some(
      (id) => id.toString() === from.toString()
    );
    const isToParticipant = chatRoom.participants.some(
      (id) => id.toString() === to.toString()
    );

    if (!isFromParticipant || !isToParticipant) {
      return res.status(403).json({ error: 'Unauthorized messaging attempt' });
    }

    const newMessage = new Message({
      from,
      to,
      message,
      chatRoomId,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};


// Get chat messages between two users (optionally filtered by chatRoomId)
exports.getChatMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { chatRoomId } = req.query;
    const currentUserId = req.user._id;

    const query = {
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId },
      ]
    };

    if (chatRoomId) {
      query.chatRoomId = chatRoomId;
    }

    const messages = await Message.find(query).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Mark messages as read
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
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};
