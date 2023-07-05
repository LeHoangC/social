const Post = require('../models/Post')
const User = require('../models/User')

const createPost = async (req, res) => {
    console.log('create post')

    try {
        const { userId, description, picturePath } = req.body
        const user = await User.findById(userId)

        console.log(user)

        const newPost = await Post.create({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
        })

        console.log(newPost)

        const post = await Post.find()

        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find()
        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        const post = await Post.find({ userId })
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        const post = await Post.findById(id)
        const isLiked = post.likes.get(userId)

        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }

        const updatePost = await Post.findByIdAndUpdate(
            id,
            {
                likes: post.likes,
            },
            { new: true }
        )

        return res.status(200).json(updatePost)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { createPost, getFeedPosts, getUserPosts, likePost }
