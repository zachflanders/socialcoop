const express = require("express");
const {
    groupById, 
    allGroups, 
    getGroup, 
    updateGroup, 
    deleteGroup, 
    hasAuthorization,
    groupPhoto,
    addAdmin,
    addMember,
    removeMemberOrAdmin
} = require("../controllers/group");
const {requireSignin} = require("../controllers/auth");

const router = express.Router();

router.put('/group/join', requireSignin, addMember,);
router.put('/group/leave', requireSignin, removeMemberOrAdmin);


router.get('/users',  allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, hasAuthorization, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);
router.get("/user/photo/:userId", userPhoto)

//any route containing userId, our app will first execute userById()
router.param("userId", userById)

module.exports = router;
