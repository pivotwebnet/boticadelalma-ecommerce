const { Client } = require('pg');
const client = new Client('postgresql://postgres:200427@localhost:5432/boticadelalma');
client.connect()
    .then(() => client.query('SELECT * FROM "Products" LIMIT 15'))
    .then(res => {
        console.log(res.rows);
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
