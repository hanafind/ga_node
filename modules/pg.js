const { Client, Pool } = require('pg');
const config = require(`../config/${process.env.NODE_ENV}.json`);


const query = async(sql, values)=>{
    const client = new Client(config.postgresql);
    await client.connect();
    const res = await client.query(sql, values);
    await client.end();
    return res.rows;
};

const pool = {
    begin: async()=>{
        const client = await pool.connect();
        await client.query('BEGIN');
        return client;
    },
    query: async(client, sql, values)=>{
        const res = await client.query(sql, values);
        return res;
    },
    commit: async(client)=>{
        await client.query('COMMIT');
        client.release();
    },
    rollback: async(client)=>{
        await client.query('ROLLBACK');
        client.release();
    }
};

module.exports = {
    query: query,
    pool: pool
}