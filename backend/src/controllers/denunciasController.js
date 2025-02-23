const getDenuncias = async (req, res) => {
    try {
      const [denuncias] = await pool.query(`
        SELECT d.*, u.nome as profissional_nome, u.tipo as profissional_tipo
        FROM denuncias d
        LEFT JOIN users u ON d.profissional_id = u.id
        WHERE d.deleted_at IS NULL
      `);
      res.json(denuncias);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const getDenunciasPorTipo = async (req, res) => {
    try {
      const [denuncias] = await pool.query(`
        SELECT d.* 
        FROM denuncias d
        WHERE d.tipo_profissional = ? AND d.deleted_at IS NULL
      `, [req.params.tipo]);
      res.json(denuncias);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const addAcompanhamento = async (req, res) => {
    try {
      const { comentario } = req.body;
      const userId = req.user.id; // do middleware de auth
      const { id } = req.params;
  
      await pool.query(
        'INSERT INTO acompanhamentos (denuncia_id, user_id, comentario) VALUES (?, ?, ?)',
        [id, userId, comentario]
      );
  
      await pool.query(
        'UPDATE denuncias SET status = "em_analise" WHERE id = ?',
        [id]
      );
  
      res.status(201).json({ message: 'Acompanhamento registrado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const atribuirDenuncia = async (req, res) => {
    try {
      const { profissionalId } = req.body;
      const { id } = req.params;
  
      await pool.query(
        'UPDATE denuncias SET profissional_id = ? WHERE id = ?',
        [profissionalId, id]
      );
  
      res.json({ message: 'Denúncia atribuída com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports = {
    getDenuncias,
    getDenunciasPorTipo,
    addAcompanhamento,
    atribuirDenuncia
  };