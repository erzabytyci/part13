const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { JWT_SECRET } = require('../util/config')

router.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ where: { username } })

    const passwordCorrect =
        user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!user || !passwordCorrect) {
        const err = new Error('invalid username or password')
        err.name = 'BadRequestError'
        throw err
    }

    const userForToken = {
        id: user.id,
        username: user.username,
    }

    const token = jwt.sign(userForToken, JWT_SECRET)

    res.json({ token, username: user.username, name: user.name })
})

module.exports = router
