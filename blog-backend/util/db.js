const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { runMigrations } = require('./migrations')

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
})

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('connected to the database')

        await runMigrations(sequelize)
        console.log('migrations up to date')
    } catch (err) {
        console.log('failed to connect to the database')
        console.error(err)
        process.exit(1)
    }
}

module.exports = { connectToDatabase, sequelize }
