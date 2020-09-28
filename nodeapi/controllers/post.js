const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const AWS = require('aws-sdk');
const uuid = require('uuid');


exports.postById = (req, res, next, id) =>{
  Post.findById(id)
  .populate("postedBy","_id name photo_url")
  .exec((err, post)=>{
    if(err || !post){
      return res.status(400).json({
        error: err
      })
    }
    req.post = post
    next()
  }) 
}

exports.getPostById = (req, res) => {
    res.json(req.post);
}

exports.getPosts = async (req, res) => {
  const currentPage = req.query.page || 1;
  const perPage = 5;
  let totalItems;
  const posts = await Post.find()
  .countDocuments()
  .then(count => {
    totalItems = count;
    return Post.find()
        .skip((currentPage - 1) * perPage)
        .populate("postedBy", "_id name photo_url")
        .sort('-created')
        .limit(perPage)
        .select("_id title body created photo_url");
})
  .then((posts)=> {
    res.json(posts);
  })
  .catch(err => console.log(err));
}

exports.getFeed = async (req, res) => {
  const currentPage = req.query.page || 1;
  const perPage = 5;
  let totalItems;
  following = req.profile.following.map(user => user._id)
  following.push(req.profile._id)
  const posts = await Post.find()
  .countDocuments()
  .then(count => {
    totalItems = count;
    return Post.find({
      postedBy: { $in: following }
    })
    .skip((currentPage - 1) * perPage)
    .sort('-created')
    .limit(perPage)
    .populate('postedBy', '_id name photo_url')
    .select("_id title body created photo_url")
  }) 
  .then((posts)=> {
    res.json(posts);
  })
  .catch(err => console.log(err));
}

exports.createPost = (req, res) => {  
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) =>{
    if(err){
      return res.status(400).json({
        error: "Image could not be uploaded."
      })
    }
     
    let post = new Post(fields);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;
    if(files.photo){
      const uuid_v4 = uuid.v4()
      var objectParams = {Bucket: 'mycoopnetwork', Key: `${files.photo.name}-${uuid_v4}.jpg`, Body: fs.readFileSync(files.photo.path)};
      var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
      uploadPromise.then(data => {
          console.log(data);
          post.photo_url = `https://mycoopnetwork.s3-us-west-2.amazonaws.com/${files.photo.name}-${uuid_v4}.jpg`;
          post.save((err, result)=>{
            if(err){
              return res.status(400).json({
                error: err
              })
            }
            res.json(result)
          });
      });
    }
    else {
      post.save((err, result)=>{
        if(err){
          return res.status(400).json({
            error: err
          })
        }
        res.json(result)
      });
    }
  });
};

exports.postsByUser = (req, res) => {
  Post.find({postedBy: req.profile._id})
    .populate("postedBy", "_id name photo_url")
    .sort("-created")
    .exec((err, posts)=>{
      if(err){
        res.status(400).json({
          error: err
        })
      }
      res.json(posts);
    })
}

exports.isPoster = (req, res, next) =>{
  console.log(req.post, req.auth);
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
  if(!isPoster){
    return res.status(403).json({
      error: "User is not authorized."
    });
  }
  next();
};


exports.updatePost = (req, res, next) =>{
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files)=>{
    if(err){
      return res.status(400).json({
        error: 'Photo could not be uploaded.'
      })
    }
    let post = req.post;
    post = _.extend(post, fields)
    post.updated = Date.now()
    if(files.photo){
      const uuid_v4 = uuid.v4()
      var objectParams = {Bucket: 'mycoopnetwork', Key: `${files.photo.name}-${uuid_v4}.jpg`, Body: fs.readFileSync(files.photo.path)};
      var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
      uploadPromise.then(data => {
          console.log(data);
          post.photo_url = `https://mycoopnetwork.s3-us-west-2.amazonaws.com/${files.photo.name}-${uuid_v4}.jpg`;
          post.save((err, result)=>{
            if(err){
              return res.status(400).json({
                error: err
              })
            }
            res.json(result)
          });
      });
    }
    else {
      post.save((err, result)=>{
        if(err){
          return res.status(400).json({
            error: err
          })
        }
        res.json(result)
      });
    }
  })
}

exports.deletePost = (req, res) => {
  console.log('delete post')
  let post = req.post;
  post.remove((err, post)=>{
    if(err){
      return res.status(400).json({
        error: err
      })
    }
    res.json({
      message: `Deleted post "${post.title}"`
    })
  })
}
