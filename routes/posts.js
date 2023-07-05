const express = require('express')

const { getFeedPosts, getUserPosts, likePost, createPost } = require('../controllers/post')

const { verifyToken } = require('../middleware/auth')

const router = express.Router()

router.post('/', verifyToken, createPost)

router.get('/', verifyToken, getFeedPosts)
router.get('/:userId/posts', verifyToken, getUserPosts)

router.patch('/:id/like', verifyToken, likePost)

module.exports = router
