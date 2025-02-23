const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Defina suas rotas aqui
router.post('/login', async (req, res) => {
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
    if (!user[0] || !bcrypt.compareSync(req.body.password, user[0].password)) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);
    res.json({ token, user: user[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;