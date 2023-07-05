const User = require('../models/User')

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                code: 'xxx',
                message: 'user not found',
            })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        const friends = await Promise.all(user.friends.map((id) => User.findById(id)))

        const formattedFriends = friends.map(({ _id, firstName, lastName, accupation, location, picturePath }) => {
            return { _id, firstName, lastName, accupation, location, picturePath }
        })

        return res.status(200).json(formattedFriends)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params
        const user = await User.findById(id)
        const friend = await User.findById(friendId)

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId)

            friend.friends = friend.friends.filter((idF) => idF !== id)
        } else {
            user.friends.push(friendId)
            friend.friends.push(id)
        }

        await user.save()
        await friend.save()

        const friends = await Promise.all(user.friends.map((id) => User.findById(id)))

        const formattedFriends = friends.map(({ _id, firstName, lastName, accupation, location, picturePath }) => {
            return { _id, firstName, lastName, accupation, location, picturePath }
        })

        return res.status(200).json(formattedFriends)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getUser,
    getUserFriends,
    addRemoveFriend,
}
