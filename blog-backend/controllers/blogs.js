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
    const blog = await Blog.create(req.body)
    return res.status(201).json(blog)
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
        const err = new Error('blog not found')
        err.name = 'NotFoundError'
        throw err
    }

    if (req.body.likes === undefined) {
        const err = new Error('likes missing')
        err.name = 'BadRequestError'
        throw err
    }

    const likes = Number(req.body.likes)
    if (Number.isNaN(likes)) {
        const err = new Error('likes must be a number')
        err.name = 'BadRequestError'
        throw err
    }

    req.blog.likes = likes
    await req.blog.save()

    res.json(req.blog)
})


module.exports = router
