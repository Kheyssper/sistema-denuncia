// src/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar conexão
pool.getConnection()
  .then(connection => {
    console.log('Database conectado com sucesso');
    connection.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco:', err);
  });

module.exports = pool;