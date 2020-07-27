const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHashAndSalt: {
    type: String,
    required: true
  }
});

// Create models via mongoose
const User = mongoose.model('User', userSchema);

// Export the models to make them accessible
module.exports = User;
