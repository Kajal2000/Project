const dotenv = require('dotenv');
dotenv.config();
const knex = require ("knex");

const connection = {
    client : "mysql",
    connection : {
        host: process.env.Host,
        user: process.env.User,
        password: process.env.Password,
        database: process.env.Database
    }
};

module.exports = knex(connection);