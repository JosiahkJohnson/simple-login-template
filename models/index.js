"use strict";

//required libraries
const fs = require("fs");
const path = require("path");
const { sequelize, Sequelize } = require("../../escalation-analyst-database/models");
const basename = path.basename(module.filename);
//for deployment
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config");
const db = {};

//detect if we are in development or production to determine what database to use
//using this if statment that returns false if outside of development
if (config.use_env_variable) {
    //use our testing sequelize
    const sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    //otherwise we will tell production to ready one
    const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

//this next section of code will automatically read in all models in this directory and sequelize them for the production database
//start with this directory
fs.readdirSync(__dirname)
    //then call the filter function to
    .filter(function (file) {
        return (
            //look for files that end in .js
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
        );
    })
    //go through all our models in the directory then import the file
    .forEach(function (file) {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

//call in all the models and model them for the database
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
