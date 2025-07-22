
const Match = require('../models/Match');
const Post = require('../models/Post');
const User = require('../models/User');

// Get compatibility overview for seeker-post pair
exports.getCompatibility = async (req, res) => {
  try {
    const seekerId = req.user._id;
    const postId = req.params.postId;

    const post = await Post.findById(postId).populate('user');
    const seeker = await User.findById(seekerId);

    if (!post || !seeker) {
      return res.status(404).json({ message: 'Seeker or Post not found' });
    }

    // Compatibility score (simplified example)
    const sharedHobbies = post.hobbies.filter(hobby => seeker.hobbies.includes(hobby));
    const compatibilityScore = (sharedHobbies.length / post.hobbies.length) * 100;

    // Create or update match
    let match = await Match.findOne({ seeker: seekerId, post: postId });
    if (!match) {
      match = await Match.create({ seeker: seekerId, post: postId });
    }

    res.status(200).json({
      matchId: match._id,
      sharedHobbies,
      compatibilityScore: Math.round(compatibilityScore),
      postDetails: {
        title: post.title,
        location: post.location,
        rent: post.rent,
        tags: post.tags,
      },
      posterName: post.user.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
