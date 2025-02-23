const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const login = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
    const user = users[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Para teste inicial, sem verificar senha
    const token = jwt.sign(
      { id: user.id, tipo: user.tipo }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
module.exports = { login };