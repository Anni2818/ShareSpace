// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true, minlength: 6 },
//   role: {
//     type: [String],
//     enum: ['seeker', 'poster', 'admin'],
//     default: ['seeker', 'poster'],
//   },
//   hobbies: [String],
//   preferences: {
//     smoking: Boolean,
//     pets: Boolean,
//     nightOwl: Boolean,
//     cleanlinessLevel: { type: Number, min: 1, max: 5 },
//   },
//   isVerified: { type: Boolean, default: false },
//   aadharCardUrl: String,
//   profilePic: { type: String, default: '' },
//   bio: { type: String, maxlength: 500 },
//   phoneNumber: String,
//   location: String,
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare password method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 6 },
    
    role: {
      type: [String],
      enum: ['seeker', 'poster', 'admin'],
      required: true, // Now mandatory to pass during registration
    },

    isVerified: { type: Boolean, default: false },
    profilePic: { type: String, default: '' },
    bio: { type: String, maxlength: 500 },
    phoneNumber: String,
    
    // Optional extra identity fields
    aadharCardUrl: String,
  },
  { timestamps: true }
);

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
