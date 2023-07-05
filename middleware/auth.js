const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization')

        if (!token) {
            return res.status(403).json('Access Denied')
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft()
        }

        const verified = jwt.verify(token, 'lehoangcuong')

        req.user = verified

        next()
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { verifyToken }
