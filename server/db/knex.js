const config = require('../../knexfile');
const knex = require('knex');

const environment = process.env.NODE_ENV || 'development';
const envConfig = config[environment];
const connection = knex(envConfig);

module.exports = connection;
