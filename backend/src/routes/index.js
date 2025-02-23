const router = require('express').Router();
const authRoutes = require('./auth.routes');
const denunciasRoutes = require('./denuncias.routes');
const conscientizacaoRoutes = require('./conscientizacao.routes');

router.use('/auth', authRoutes);
router.use('/denuncias', denunciasRoutes);
router.use('/conscientizacao', conscientizacaoRoutes);

module.exports = router;