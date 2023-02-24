const express = require('express');

const postController = require('../controllers/posts-controllers');
const router = express.Router(); //Export the Router
const checkAuth = require('../middleware/auth')

router.get('/:uid/:pid', postController.getPost)
router.get('/:uid/user_saved/saved', postController.getsavedPosts)
router.get('/:post_id', postController.getPostById)
router.use(checkAuth) //This is a middleware that will be executed for all the routes below
router.patch('/:uid/:post_id/delete', postController.deleteSavedPost)
router.patch('/:uid/user_saved/saved', postController.savePost)
router.post('/:uid/:pid', postController.createPost)
router.patch('/:uid/:post_id/upvote', postController.UpvotePost)
router.patch('/:uid/:post_id/downvote', postController.DownvotePost)
//Delete Post
router.delete('/:uid/:post_id', postController.deletePost)

module.exports = router;