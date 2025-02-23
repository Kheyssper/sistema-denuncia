// src/pages/AcompanharDenuncia.jsx
const AcompanharDenuncia = () => {
    const [protocolo, setProtocolo] = useState('');
  
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Acompanhar Denúncia</h1>
        <div className="mb-4">
          <input 
            type="text"
            placeholder="Digite o número do protocolo"
            className="w-full p-2 border rounded"
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </div>
    )
  }