const express = require("express");
const {
    userById, 
    allUsers, 
    getUser, 
    updateUser, 
    deleteUser, 
    hasAuthorization,
    userPhoto,
    addFollowing,
    addFollower
} = require("../controllers/user");
const {requireSignin} = require("../controllers/auth");

const router = express.Router();

router.put('/user/follow', requireSignin, addFollowing, addFollower);

router.get('/users',  allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, hasAuthorization, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);
router.get("/user/photo/:userId", userPhoto)

//any route containing userId, our app will first execute userById()
router.param("userId", userById)

module.exports = router;
