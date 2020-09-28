const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required:true
  },
  body:{
    type: String,
    required:true
  },
  photo_url: {
    type: String,
  },
  postedBy:{
    type: ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  comments: [
    {
      text: String,
      created: Date,
    }
  ]
});

module.exports = mongoose.model("Post", postSchema);
