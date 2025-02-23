const getConscientizacao = async (req, res) => {
    try {
      const [recursos] = await pool.query('SELECT * FROM conscientizacao');
      res.json(recursos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const addConscientizacao = async (req, res) => {
    try {
      const { titulo, descricao, tipo, link } = req.body;
      await pool.query(
        'INSERT INTO conscientizacao (titulo, descricao, tipo, link) VALUES (?, ?, ?, ?)',
        [titulo, descricao, tipo, link]
      );
      res.status(201).json({ message: 'Recurso adicionado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };