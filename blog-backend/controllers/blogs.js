const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({ order: [['id', 'ASC']] })
    res.json(blogs)
})

router.post('/', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        res.status(201).json(blog)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        await req.blog.destroy()
        return res.status(204).end()
    }
    res.status(404).json({ error: 'blog not found' })
})

module.exports = router
