const express = require('express');
const router = express.Router();
const authorize = require("../public/js/authorization");
const authController = require("../controller/authController");
const postController = require("../controller/postController");
const messageController = require("../controller/messageController");


// Login routes
router.get("/", authController.index);
router.post("/login", authController.login);
    
// Register routes
router.post("/register", authController.register);
router.get("/about", authController.about);

// Posting routes
router.post("/post", authorize, postController.post);
router.get("/post/:pagination", authorize, postController.getPosts);
router.get("/post/user/:userId", authorize, postController.getPosts);
router.get("/post/:postId/replies", authorize, postController.getReplies);
router.post("/post/reply", postController.postReply);

//DM routes
router.post("/message", authorize, messageController.sendMessage);
router.post("/conversations", authorize, messageController.createConversation);
router.get("/conversations", authorize, messageController.getConversations);
router.get("/message/:conversationId", authorize, messageController.getMessages);
//router.post("/sendEmail", authorize, messageController.sendEmail)
module.exports = router;

// Profile
router.post("/like", authorize, authController.like);
router.get("/like", authorize, authController.getLikes);

//Search 
router.post("/search", authorize, authController.search)
router.post("/searchbytopic", authorize, authController.searchByTopic)




