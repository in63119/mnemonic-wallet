'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        static associate(models) {
            models.user.hasMany(models);
        }
    }
    user.init({
        userName: DataTypes.STRING,
        password: DataTypes.STRING,
        address: DataTypes.STRING,
        privateKey: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'user'
    });

    return user;
}