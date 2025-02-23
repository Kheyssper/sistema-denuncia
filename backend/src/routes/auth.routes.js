// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário do banco
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Comparar senha com hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      process.env.JWT_SECRET || 'suachavesecreta123'
    );

    // Retornar resposta
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
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = { login };

// src/routes/auth.routes.js
const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

module.exports = router;