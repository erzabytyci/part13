require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')

const app = express()
app.use(express.json())

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

app.get('/api/blogs', async (req, res) => {
    const result = await pool.query('SELECT * FROM blogs ORDER BY id ASC')
    res.json(result.rows)
})

app.post('/api/blogs', async (req, res) => {
    const { author, url, title, likes } = req.body

    if (!url || !title) {
        return res.status(400).json({ error: 'url and title are required' })
    }

    const result = await pool.query(
        `INSERT INTO blogs (author, url, title, likes)
     VALUES ($1, $2, $3, COALESCE($4, 0))
     RETURNING *`,
        [author || null, url, title, likes]
    )

    res.status(201).json(result.rows[0])
})

app.delete('/api/blogs/:id', async (req, res) => {
    const id = Number(req.params.id)

    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id])

    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'blog not found' })
    }

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
