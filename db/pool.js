const mysql = require('mysql');
require('dotenv').config();

module.exports = class Pool
{
    constructor(env)
    {
        this.env = env;
        if (env == 'test')
        {

            this.pool = mysql.createPool(
            {
                connectionLimit: 10,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                password: process.env.DB_PASSWORD,
                user: process.env.DB_USER,
                database: process.env.DB_DATABASE,
                timezone:process.env.DB_TIMEZONE,
                charset:process.env.DB_CHARSET,
            });

        }
        else if (env == 'dev' || typeof env === 'undefinded')
        {
            this.pool = mysql.createPool(
            {
                connectionLimit: 10,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                password: process.env.DB_PASSWORD,
                user: process.env.DB_USER,
                database: process.env.DB_DATABASE
            });
        }
    }
    setPoolEvent()
    {
        if (this.pool && this.env && (this.env == 'test'))
        {
            this.pool.on('enqueue', function()
            {
                console.log('Waiting for available connection slot');
            });
            this.pool.on('release', function(connection)
            {
                console.log('Connection %d released', connection.threadId);
            });
        }
        else
        {
            throw new Error('there is no instanciated pool...');

        }

    }
    getInstance()
    {
        if (this.pool)
        {
            return this.pool;
        }
        else
        {
            throw new Error('there is no instanciated pool...');

        }

    }
};