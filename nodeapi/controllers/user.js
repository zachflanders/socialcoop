const User = require('../models/user');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const AWS = require('aws-sdk');
const uuid = require('uuid');

exports.userById = (req, res, next, id) =>{
  User.findById(id)
  .populate('following','_id name location about')  
  .populate('followers','_id name location about') 
  .exec((err, user)=>{
    if(err || !user){
      return res.status(400).json({
        error: "User not found"
      })
    }
    req.profile = user // adds profile object in req with user info
    next();
  })
};

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();
  if(!authorized){
    return res.status(403).json({
      error: "User is not authorized to perform this action."
    })
  }
  next();
};

exports.allUsers = (req, res) => {
  User.find((err, users)=>{
    if(err){
      return res.status(400).json({
        error: err
      })
    }
    users = users.filter(user=>user.showInDirectory)
    res.json(users);
  }).select("name email location about updated created showInDirectory followers photo_url")
};

exports.getUser = (req, res) =>{
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res, next) =>{
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files)=>{
    if(err){
      return res.status(400).json({
        error: 'Photo could not be uploaded.'
      })
    }
    let user = req.profile;
    user = _.extend(user, fields)
    user.updated = Date.now()
    if(files.photo){
      const uuid_v4 = uuid.v4()
      var objectParams = {Bucket: 'mycoopnetwork', Key: `${files.photo.name}-${uuid_v4}.jpg`, Body: fs.readFileSync(files.photo.path)};
      var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
      uploadPromise.then(data => {
        user.photo_url = `https://mycoopnetwork.s3-us-west-2.amazonaws.com/${files.photo.name}-${uuid_v4}.jpg`;
        user.save((err) =>{
          if(err){
            return res.status(400).json({
              error: err,
            })
          }
          user.hashed_password = undefined;
          user.salt = undefined;
          res.json(user);
        })
      });
    }
    else {
      user.save((err) =>{
        if(err){
          return res.status(400).json({
            error: err,
          })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
      });
    }
  });
}

exports.deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((err, user)=>{
    if(err){
      return res.status(400).json({
        error: err
      })
    }
    return res.json({message: `User ${user.name} has been deleted`});
  })
}

exports.userPhoto = (req, res, next)=>{
  if (req.profile.photo.data){
    res.set("Content-Type",req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  next()
}

exports.addFollowing = (req, res, next)=> {
  User.findByIdAndUpdate(req.body.userId, 
    {$push: {following: req.body.followId}}, (err, result)=>{
      if(err){
        return res.status(400).json({error: err})
      }
      next()
  })
};

exports.addFollower = (req, res) =>{
  User.findByIdAndUpdate(req.body.followId, 
    {$push: {followers: req.body.userId}},
    {new: true} 
  )
  .populate('following', '_id name location about')
  .populate('followers', '_id name location about')
  .exec((err, result)=>{
    if(err){
      return res.status(400).json({error: err})
    }
    result.hashed_password = undefined;
    result.salt = undefined;
    return res.json(result);
  })
};

exports.removeFollowing = (req, res, next)=> {
  User.findByIdAndUpdate(req.body.userId, 
    {$pull: {following: req.body.unfollowId}}, (err, result)=>{
      if(err){
        return res.status(400).json({error: err})
      }
      next()
  })
};

exports.removeFollower = (req, res, next) =>{
  User.findByIdAndUpdate(req.body.unfollowId, 
    {$pull: {followers: req.body.userId}},
    {new: true} 
  )
  .populate('following', '_id name')
  .populate('followers', '_id name')
  .exec((err, result)=>{
    if(err){
      return res.status(400).json({error: err})
    }
    result.hashed_password = undefined;
    result.salt = undefined;
    return res.json(result);
  })
};
