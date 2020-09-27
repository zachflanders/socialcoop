const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const _ = require("lodash");
// load env
const dotenv = require("dotenv");
dotenv.config();

const groupSchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
    required: true
  },
  created:{
    type: Date,
    default: Date.now
  },
  updated: Date,
  photo:{
    data: Buffer,
    contentType: String
  },
  about:{
    type: String,
    trim: true
  },
  location:{
    type: String,
    trim: true
  },
  admins: [{
    type: ObjectId, ref:"User" 
  }],
  members: [{
    type: ObjectId, ref:"User"
  }],
  showInDirectory: {
    type: Boolean,
    default: false
  },
  open: {
      type: Boolean,
      default: false
  },    
  public: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model("Group", groupSchema);
