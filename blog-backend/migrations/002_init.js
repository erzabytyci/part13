const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        const currentYear = new Date().getFullYear()

        await queryInterface.addColumn('blogs', 'year', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: currentYear,
        })

        await queryInterface.addConstraint('blogs', {
            fields: ['year'],
            type: 'check',
            name: 'blogs_year_check',
            where: {
                year: {
                    [queryInterface.sequelize.Sequelize.Op.and]: [
                        { [queryInterface.sequelize.Sequelize.Op.gte]: 1991 },
                        queryInterface.sequelize.where(
                            queryInterface.sequelize.col('year'),
                            '<=',
                            queryInterface.sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)')
                        ),
                    ],
                },
            },
        })
    },

    down: async ({ context: queryInterface }) => {
        await queryInterface.removeConstraint('blogs', 'blogs_year_check')
        await queryInterface.removeColumn('blogs', 'year')
    },
}
