const router = require('express').Router();
const denunciasController = require('../controllers/denunciasController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware); // Aqui estava o erro

router.get('/', denunciasController.getDenuncias);
router.get('/profissional/:tipo', denunciasController.getDenunciasPorTipo);
router.post('/:id/acompanhamento', denunciasController.addAcompanhamento);
router.post('/:id/atribuir', denunciasController.atribuirDenuncia);

module.exports = router;