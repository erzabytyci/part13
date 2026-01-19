const { Umzug, SequelizeStorage } = require('umzug')

const runMigrations = async (sequelize) => {
    const umzug = new Umzug({
        migrations: {
            glob: 'migrations/*.js',
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({
            sequelize,
            tableName: 'migrations',
        }),
        logger: console,
    })

    await umzug.up()
}

module.exports = { runMigrations }
