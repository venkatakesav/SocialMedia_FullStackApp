const express = require('express');

const userController = require('../controllers/users-controllers');
const router = express.Router(); //Export the Router

router.get('/:uid', userController.getUsers)
router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.patch('/:uid', userController.followUser)
router.patch('/unfollow/:uid', userController.unfollowUser)
router.patch('/remove/:uid', userController.removeUser)

module.exports = router;