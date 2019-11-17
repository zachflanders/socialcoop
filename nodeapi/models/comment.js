const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  text:{
    type: String,
    required:true
  },
  user:{
    type: ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  post:{
      type: ObjectId,
      ref: "Post"
  },
  parentId:{
    type: ObjectId,
    ref: "Comment"
  }
});

module.exports = mongoose.model("Comment", commentSchema);
