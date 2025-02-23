const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Log para debug
    console.log('Login attempt:', { email, password });

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Comparar senha com hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      process.env.JWT_SECRET || 'suachavesecreta123',
      { expiresIn: '24h' }
    );

    console.log('Login successful:', { userId: user.id, tipo: user.tipo });

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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = { login };