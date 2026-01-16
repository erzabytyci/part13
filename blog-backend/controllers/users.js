const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User } = require('../models')

router.post('/', async (req, res) => {
    const { name, username } = req.body

    const passwordHash = await bcrypt.hash('secret', 10)

    const user = await User.create({
        name,
        username,
        passwordHash,
    })

    res.status(201).json(user)
})


router.get('/', async (req, res) => {
    const users = await User.findAll({ order: [['id', 'ASC']] })
    res.json(users)
})

router.put('/:username', async (req, res) => {
    const oldUsername = req.params.username
    const { username: newUsername } = req.body

    if (!newUsername || newUsername.trim() === '') {
        const err = new Error('username must not be empty')
        err.name = 'BadRequestError'
        throw err
    }

    const user = await User.findOne({ where: { username: oldUsername } })
    if (!user) {
        const err = new Error('user not found')
        err.name = 'NotFoundError'
        throw err
    }

    user.username = newUsername
    await user.save()

    res.json(user)
})

module.exports = router
