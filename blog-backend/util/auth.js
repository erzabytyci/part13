const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')
const { User } = require('../models')

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7)
    } else {
        req.token = null
    }
    next()
}

const userExtractor = async (req, res, next) => {
    if (!req.token) {
        const err = new Error('token missing')
        err.name = 'UnauthorizedError'
        return next(err)
    }

    const decodedToken = jwt.verify(req.token, JWT_SECRET)
    req.user = await User.findByPk(decodedToken.id)
    next()
}

module.exports = { tokenExtractor, userExtractor }
