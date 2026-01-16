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

router.put('/:id', blogFinder, async (req, res) => {
    if (!req.blog) {
        return res.status(404).json({ error: 'blog not found' })
    }

    if (req.body.likes === undefined) {
        return res.status(400).json({ error: 'likes missing' })
    }

    req.blog.likes = req.body.likes
    await req.blog.save()

    res.json(req.blog)
})


module.exports = router
