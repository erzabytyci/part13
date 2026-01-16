const errorHandler = (error, req, res, next) => {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message })
    }

    if (error.name === 'BadRequestError') {
        return res.status(400).json({ error: error.message })
    }

    if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message })
    }

    console.error(error)
    return res.status(500).json({ error: 'internal server error' })
}

module.exports = { errorHandler }
