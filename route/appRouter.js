const express = require('express');
const router = express.Router();
const authorize = require("../public/js/authorization");
const appController = require("../controller/appController")

// Landing page
router.get("/landing", authorize, appController.landing)
router.post("/edit", authorize, appController.editProfile)
router.get("/messaging", authorize, appController.messaging);
router.get("/conversation/user/:recipientId", authorize, appController.conversation);

// Profile
router.get("/profilePosts/:id", authorize, appController.profilePosts)
router.get("/profile/:id", authorize, appController.profile);

module.exports = router;
