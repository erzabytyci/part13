const router = require('express').Router()
const { ReadingList } = require('../models')
const { userExtractor } = require('../util/auth')

router.post('/', async (req, res) => {
    const { blogId, userId } = req.body

    const reading = await ReadingList.create({
        blogId,
        userId,
    })

    res.status(201).json(reading)
})

router.put('/:id', userExtractor, async (req, res) => {
    const reading = await ReadingList.findByPk(req.params.id)

    if (!reading) {
        const err = new Error('reading list entry not found')
        err.name = 'NotFoundError'
        throw err
    }

    if (reading.userId !== req.user.id) {
        const err = new Error('not allowed')
        err.name = 'ForbiddenError'
        throw err
    }

    if (req.body.read === undefined) {
        const err = new Error('read missing')
        err.name = 'BadRequestError'
        throw err
    }

    reading.read = req.body.read
    await reading.save()

    res.json(reading)
})


module.exports = router
