const Comment = require('../models/comment');
const formidable = require('formidable');
const _ = require('lodash')
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

exports.commentById = (req, res, next, id) =>{
    Comment.findById(id)
    .populate("user","_id name  photo_url")
    .exec((err, comment)=>{
      if(err || !comment){
        return res.status(400).json({
          error: err
        })
      }
      req.comment = comment
      next()
    }) 
  }

exports.createComment = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) =>{
      if(err){
        return res.status(400).json({
          error: "error."
        })
      }
      let comment = new Comment(fields);
      req.profile.hashed_password = undefined;
      req.profile.salt = undefined;
      comment.user = req.profile;
      comment.post = req.post
      comment.save((err, result)=>{
        if(err){
          return res.status(400).json({
            error: err
          })
        }
        res.json(result)
      });
    });
  };

exports.getComments = async (req, res) =>{
    const currentPage = req.query.page || 1;
    const perPage = 6;
    let totalItems;
    const comments= await Comment.find({'post': req.post._id})
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Comment.find({'post': req.post._id})
      .skip((currentPage - 1) * perPage)
      .sort('createdAt')
      .limit(perPage)
      .populate('user', '_id name photo_url')
      .populate('post', '_id')
      .select("_id text createdAt")
    }) 
    .then((comments)=> {
      res.json(comments);
    })
    .catch(err => console.log(err));
  }

  exports.isCommenter = (req, res, next) =>{
    let isCommenter = req.comment && req.auth && req.comment.user._id == req.auth._id
    if(!isCommenter){
      return res.status(403).json({
        error: "User is not authorized."
      });
    }
    next();
  };

  exports.deleteComment = (req, res) => {
    let comment = req.comment;
    comment.remove((err, comment)=>{
      if(err){
        return res.status(400).json({
          error: err
        })
      }
      res.json({
        message: `Deleted post "${comment.text}"`
      })
    })
  }
