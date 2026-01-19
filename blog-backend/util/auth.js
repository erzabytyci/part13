const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')
const { User, Session } = require('../models')

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

    let decodedToken
    try {
        decodedToken = jwt.verify(req.token, JWT_SECRET)
    } catch (error) {
        return next(error)
    }

    const user = await User.findByPk(decodedToken.id)

    if (!user) {
        const err = new Error('user not found')
        err.name = 'UnauthorizedError'
        return next(err)
    }

    if (user.disabled) {
        const err = new Error('user disabled')
        err.name = 'UnauthorizedError'
        return next(err)
    }

    const session = await Session.findOne({ where: { token: req.token } })
    if (!session) {
        const err = new Error('session expired')
        err.name = 'UnauthorizedError'
        return next(err)
    }

    req.user = user
    next()
}

module.exports = { tokenExtractor, userExtractor }
