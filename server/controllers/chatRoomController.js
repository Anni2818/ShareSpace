const ChatRoom = require('../models/ChatRoom');

exports.createOrGetChatRoom = async (req, res) => {
  const { postId, otherUserId } = req.body;
  const userId = req.user._id;

  try {
    // Check if chat room already exists
    let chatRoom = await ChatRoom.findOne({
      post: postId,
      participants: { $all: [userId, otherUserId] }
    });

    if (!chatRoom) {
      chatRoom = await ChatRoom.create({
        participants: [userId, otherUserId],
        post: postId
      });
    }

    res.status(200).json(chatRoom);
  } catch (err) {
    res.status(500).json({ message: 'Error creating chat room', error: err.message });
  }
};

exports.getUserChatRooms = async (req, res) => {
  const userId = req.user._id;

  try {
    const rooms = await ChatRoom.find({ participants: userId })
      .populate('participants', 'name email')
      .populate('post', 'title location');

    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat rooms', error: err.message });
  }
};
