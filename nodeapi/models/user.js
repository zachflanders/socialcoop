const mongoose = require("mongoose");
const uuid = require('uuid');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;
const _ = require("lodash");
const { sendEmail } = require("../helpers");
// load env
const dotenv = require("dotenv");
dotenv.config();

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
    required: true
  },
  email:{
    type: String,
    trim: true,
    required: true
  },
  hashed_password:{
    type: String,
    trim: true,
    required: true
  },
  salt: String,
  created:{
    type: Date,
    default: Date.now
  },
  updated: Date,
  photo_url:{
    type: String
  },
  about:{
    type: String,
    trim: true
  },
  location:{
    type: String,
    trim: true
  },
  following: [{
    type: ObjectId, ref:"User"
  }],
  followers: [{
    type: ObjectId, ref:"User"
  }],
  showInDirectory: {
    type: Boolean,
    default: false
  },
  resetPasswordLink: {
    data: String,
    default: ""
  },
  theme: {
    type: String,
    default: 'light',
  }
});

//virtual field
userSchema.virtual('password')
  .set(function(password){
    //create temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuid.v1()
    //encrypt the password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function(){
    return this._password;
  })

//methods
userSchema.methods = {
  authenticate: function(plainText){
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password){
    if(!password) return '';
    try{
      return crypto.createHmac('sha1', this.salt)
                   .update(password)
                   .digest('hex');
    } catch(err){
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
