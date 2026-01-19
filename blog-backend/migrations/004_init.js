module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.sequelize.query(`
      ALTER TABLE reading_lists
      ALTER COLUMN created_at SET DEFAULT NOW();
    `)

        await queryInterface.sequelize.query(`
      ALTER TABLE reading_lists
      ALTER COLUMN updated_at SET DEFAULT NOW();
    `)
    },

    down: async ({ context: queryInterface }) => {
        await queryInterface.sequelize.query(`
      ALTER TABLE reading_lists
      ALTER COLUMN created_at DROP DEFAULT;
    `)

        await queryInterface.sequelize.query(`
      ALTER TABLE reading_lists
      ALTER COLUMN updated_at DROP DEFAULT;
    `)
    },
}
