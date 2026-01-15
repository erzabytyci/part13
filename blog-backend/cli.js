require('dotenv').config()
const { Client } = require('pg')

const main = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    })

    try {
        await client.connect()

        console.log("Executing (default): SELECT * FROM blogs")
        const result = await client.query('SELECT * FROM blogs')

        result.rows.forEach((b) => {
            const likes = b.likes ?? 0
            console.log(`${b.author}: '${b.title}', ${likes} likes`)
        })
    } catch (err) {
        console.error('Error:', err.message)
        process.exitCode = 1
    } finally {
        await client.end()
    }
}

main()
