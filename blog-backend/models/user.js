const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true },
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: { notEmpty: true, isEmail: true },
            unique: true,
        },
        passwordHash: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'password_hash',
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: 'user',
    }
)

module.exports = User
