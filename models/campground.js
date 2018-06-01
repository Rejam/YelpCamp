const mongoose = require('mongoose')

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
