// src/pages/DenunciaAcompanhamento/index.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Send, User, AlertTriangle, Trash2, FileText } from 'lucide-react'
import styles from './styles.module.css'
import { getDenunciaById, addAcompanhamento, deleteDenuncia, updateDenunciaStatus } from '../../services/api'
import StatusBadge from '../ListaDenuncias/components/StatusBadge'
// Importação correta do jsPDF e jspdf-autotable
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const DenunciaAcompanhamento = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [denuncia, setDenuncia] = useState(null)
  const [novoComentario, setNovoComentario] = useState('')

  useEffect(() => {
    const loadDenuncia = async () => {
      try {
        const data = await getDenunciaById(id)
        setDenuncia(data)
      } catch (error) {
        console.error('Erro ao carregar a denúncia:', error)
      }
    }
    loadDenuncia()
  }, [id])

  const handleEnviarAcompanhamento = async () => {
    try {
      await addAcompanhamento(id, novoComentario)
      setNovoComentario('')

      // Verificar se o status é pendente e se este é o primeiro acompanhamento
      if (denuncia.status === 'pendente') {
        // Atualizar o status para em_analise
        await updateDenunciaStatus(id, 'pendente', 'em_analise')
      }

      if (denuncia.status === 'resolvido') {
        // Atualizar o status para em_analise
        await updateDenunciaStatus(id, 'resolvido', 'em_analise')
      }

      // Recarregar os dados da denúncia
      const data = await getDenunciaById(id)
      console.log('Dados da denúncia atualizados:', data)
      setDenuncia(data)
    } catch (error) {
      console.error('Erro ao enviar o acompanhamento:', error)
    }
  }

  const handleFinalizarAcompanhamento = async () => {
    if (denuncia.acompanhamentos && denuncia.acompanhamentos.length > 0) {
      try {
        await updateDenunciaStatus(id, 'pendente', 'resolvido');

        // Recarregar os dados da denúncia
        const data = await getDenunciaById(id);
        console.log('Dados da denúncia atualizados:', data);
        setDenuncia(data);

        // Show a success message
        alert('Acompanhamento finalizado com sucesso!');
      } catch (error) {
        console.error('Erro ao finalizar o acompanhamento:', error);
        alert('Ocorreu um erro ao finalizar o acompanhamento. Por favor, tente novamente.');
      }
    } else {
      alert('Não há acompanhamentos para finalizar.');
    }
  };

  const handleDeleteDenuncia = async () => {
    try {
      console.log(`Delete: ${id}`)
      await deleteDenuncia(id)
      console.log('Denúncia deletada com sucesso')
      navigate('/denuncias') // Redireciona para a lista de denúncias após a exclusão
    } catch (error) {
      console.error('Erro ao deletar a denúncia:', error)
    }
  }

  const handleExportarPDF = () => {
    try {
      // Criar nova instância do jsPDF
      const doc = new jsPDF();
      
      // Adicionar título do documento
      doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
      doc.text(`Denúncia #${id}`, 14, 22);
      
      // Data de registro
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      const dataRegistro = new Date(denuncia.created_at).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Registrada em: ${dataRegistro}`, 14, 30);
      
      // Status atual
      doc.setFontSize(12);
      doc.setTextColor(59, 130, 246);
      doc.text(`Status: ${denuncia.status}`, 14, 38);
      
      // Linha divisória
      doc.setLineWidth(0.5);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 42, 196, 42);
      
      // Detalhes da denúncia - Cabeçalho
      doc.setFontSize(16);
      doc.setTextColor(33, 37, 41);
      doc.text("Detalhes da Denúncia", 14, 52);
      
      // Prioridade
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      doc.text(`Prioridade: ${denuncia.prioridade || 'N/A'}`, 14, 62);
      
      // Descrição
      doc.setFontSize(12);
      doc.text("Descrição:", 14, 72);
      
      // Adicionando a descrição com quebra de linhas
      const descricaoLines = doc.splitTextToSize(denuncia.descricao || 'Sem descrição disponível', 170);
      doc.text(descricaoLines, 14, 82);
      
      // Calculando a posição Y após a descrição
      let yPos = 82 + (descricaoLines.length * 7);
      
      // Linha divisória após a descrição
      doc.line(14, yPos + 5, 196, yPos + 5);
      yPos += 15;
      
      // Título dos acompanhamentos
      doc.setFontSize(16);
      doc.text("Histórico de Acompanhamentos", 14, yPos);
      yPos += 10;
      
      // Verificar se existem acompanhamentos
      if (denuncia.acompanhamentos && denuncia.acompanhamentos.length > 0) {
        const acompanhamentosFiltrados = denuncia.acompanhamentos.filter(
          acomp => acomp.denuncia_id === Number(id) || acomp.denuncia_id === id
        );
        
        // Preparar dados para a tabela de acompanhamentos
        const tableData = [];
        
        acompanhamentosFiltrados.forEach((acomp) => {
          const dataAcomp = new Date(acomp.created_at).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          tableData.push([
            dataAcomp,
            acomp.user?.nome || 'N/A',
            acomp.user?.tipo || 'N/A',
            acomp.status || 'N/A',
            acomp.comentario || 'Sem comentário'
          ]);
        });
        
        // Adicionar tabela de acompanhamentos usando autoTable
        autoTable(doc, {
          startY: yPos,
          head: [['Data', 'Usuário', 'Tipo', 'Status', 'Comentário']],
          body: tableData,
          theme: 'striped',
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255]
          },
          margin: { top: 10 },
          styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          columnStyles: {
            0: { cellWidth: 40 }, // Data
            1: { cellWidth: 30 }, // Usuário
            2: { cellWidth: 25 }, // Tipo
            3: { cellWidth: 25 }, // Status
            4: { cellWidth: 'auto' } // Comentário
          }
        });
      } else {
        // Mensagem de que não há acompanhamentos
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text("Sem acompanhamentos disponíveis.", 14, yPos + 10);
      }
      
      // Rodapé com data de geração
      const dataGeracao = new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Documento gerado em: ${dataGeracao}`, 14, 280);
      
      // Salvar o PDF
      doc.save(`denuncia-${id}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    }
  }

  if (!denuncia) {
    return <div>Carregando...</div>
  }

  console.log('Estado atual da denúncia:', denuncia)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Acompanhamento da Denúncia #{id}</h1>
          <span className={styles.date}>Registrada em{' '}
            {new Date(denuncia.created_at).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.exportButton} 
            onClick={handleExportarPDF}
            title="Exportar denúncia e acompanhamentos para PDF"
          >
            <FileText size={16} />
            Exportar PDF
          </button>
          <StatusBadge status={denuncia.status} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <AlertTriangle size={20} />
              <h3>Detalhes da Denúncia</h3>
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoRow}>
                <span>Prioridade:</span>
                <span className={`${styles.priority} ${styles[denuncia.prioridade?.toLowerCase()]}`}>
                  {denuncia.prioridade}
                </span>
              </div>
              <p>{denuncia.descricao}</p>
            </div>
          </div>
          <div className={styles.commentBox}>
            <h3>Adicionar Acompanhamento</h3>
            <textarea
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              placeholder="Digite sua análise ou comentário..."
              className={styles.commentInput}
            />
            <button className={styles.sendButton} onClick={handleEnviarAcompanhamento}>
              <Send size={16} />
              Enviar Acompanhamento
            </button>
          </div>

          <div className={styles.timeline}>
            <h3>Histórico de Acompanhamentos</h3>
            {denuncia.acompanhamentos && denuncia.acompanhamentos.length > 0 ? (
              (() => {
                console.log('Todos os acompanhamentos recebidos:', denuncia.acompanhamentos);
                const acompanhamentosFiltrados = denuncia.acompanhamentos.filter(
                  acomp => acomp.denuncia_id === Number(id) || acomp.denuncia_id === id
                );
                console.log('Acompanhamentos filtrados para esta denúncia:', acompanhamentosFiltrados);
                return acompanhamentosFiltrados.map((acomp) => (
                  <div key={acomp.id} className={styles.timelineItem}>
                    <div className={styles.timelineDot}>
                      <Clock size={16} />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <span className={styles.timelineDate}>
                          {new Date(acomp.created_at).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className={styles.timelineStatus}>{acomp.status}</span>
                      </div>
                      <div className={styles.profissionalInfo}>
                        <User size={14} />
                        <span>{acomp.user.tipo}</span>
                        <span className={styles.profissionalTipo}>{acomp.user.nome}</span>
                      </div>
                      <p className={styles.timelineText}>{acomp.comentario}</p>
                    </div>
                  </div>
                ));
              })()
            ) : (
              <p>Sem acompanhamentos disponíveis.</p>
            )}
          </div>
          <button className={styles.finalizeButton} onClick={handleFinalizarAcompanhamento}>
            Finalizar Acompanhamento
          </button>
        </div>
      </div>
    </div>
  )
}

export default DenunciaAcompanhamento