const router = require('express').Router()
const { Session } = require('../models')
const { userExtractor } = require('../util/auth')

router.delete('/', userExtractor, async (req, res) => {
    await Session.destroy({ where: { token: req.token } })
    res.status(204).end()
})

module.exports = router
