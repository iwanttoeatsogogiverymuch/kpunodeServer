const mysql = require('mysql');
require('dotenv').config();

module.exports = class Pool
{
    static pool = mysql.createPool(
        {
            connectionLimit: 10,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            password: process.env.DB_PASSWORD,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE
        });

    constructor()
    {

    }
    static setPoolEvent()
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
    static getInstance()
    {
        if (pool)
        {
            return pool;
        }
        else
        {
            throw new Error('there is no instanciated pool...');

        }

    }
};