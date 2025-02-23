const express = require('express');
const router = express.Router();

// Defina suas rotas aqui
router.get('/', (req, res) => {
  // lógica de conscientização
  res.send('Conscientização route');
});

module.exports = router;