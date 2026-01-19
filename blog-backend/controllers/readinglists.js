const router = require('express').Router()
const { ReadingList } = require('../models')

router.post('/', async (req, res) => {
    const { blogId, userId } = req.body

    const reading = await ReadingList.create({
        blogId,
        userId,
    })

    res.status(201).json(reading)
})

module.exports = router
