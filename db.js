const Pool = require('pg').Pool;
const pool = new Pool({
    user:"postgres",
    password:"4034",
    database:"data",
    host:"localhost",
    port:5432
});

module.exports = pool;