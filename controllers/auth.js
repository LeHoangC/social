const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User.js')

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            // friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        })

        if (newUser) {
            return res.status(201).json(newUser)
        }
        return res.json({
            status: 'create error',
            code: 'xxx',
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' })
        }

        const isMath = await bcrypt.compare(password, user.password)

        if (!isMath) {
            return res.status(400).json({ message: 'User does not exist' })
        }

        const token = jwt.sign({ id: user._id }, 'lehoangcuong')
        await delete user.password

        return res.status(200).json({ token, user })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { register, login }
