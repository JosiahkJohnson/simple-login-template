//load in our local variables
require("dotenv").config();

module.exports = {
    //dev database
    development: {
        username: "root",
        password: process.env.dbpassword,
        database: "userLogin",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    //testing database, by defalt, the same as the development database
    test: {
        username: "root",
        password: process.env.dbpassword,
        database: "testdb",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    //production live database, make sure it's reading from the correct database here
    production: {
        username: process.env.JAWSDB_USER || "root",
        password: process.env.JAWSDB_PASS || process.env.dbpassword,
        database: process.env.JAWSDB_DATABASE || "Users",
        host: process.env.JAWSDB_HOST || "127.0.0.1",
        dialect: "mysql"
    }
};