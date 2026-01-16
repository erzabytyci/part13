const router = require('express').Router()
const { Blog } = require('../models')
const { userExtractor } = require('../util/auth')
const { Op } = require('sequelize')


const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const { search } = req.query

    const where = {}

    if (search) {
        where[Op.or] = [
            {
                title: {
                    [Op.iLike]: `%${search}%`,
                },
            },
            {
                author: {
                    [Op.iLike]: `%${search}%`,
                },
            },
        ]
    }

    const blogs = await Blog.findAll({
        where,
        order: [['id', 'ASC']],
        include: {
            model: require('../models').User,
            attributes: ['id', 'name', 'username'],
        },
    })
    res.json(blogs)
})


router.post('/', userExtractor, async (req, res) => {
    const blog = await Blog.create({
        ...req.body,
        userId: req.user.id,
    })

    res.status(201).json(blog)
})

router.delete('/:id', userExtractor, blogFinder, async (req, res) => {
    if (!req.blog) {
        const err = new Error('blog not found')
        err.name = 'NotFoundError'
        throw err
    }

    if (req.blog.userId !== req.user.id) {
        const err = new Error('only the creator can delete this blog')
        err.name = 'ForbiddenError'
        throw err
    }

    await req.blog.destroy()
    res.status(204).end()
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
