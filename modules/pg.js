const { Client } = require('pg');
const config = require(`../config/${process.env.NODE_ENV}.json`);


const query = async(sql, values)=>{
    const client = new Client(config.postgresql);
    await client.connect();
    const res = await client.query(sql, values);
    await client.end();
    return res.rows;
};

module.exports = {
    query: query,
}