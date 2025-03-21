document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const saveBtn = document.getElementById('save-btn');
    const editableAreas = document.querySelectorAll('.editable-area');
    const editableFields = document.querySelectorAll('.editable');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    // Função para gerar PDF
    downloadPdfBtn.addEventListener('click', function() {
        const element = document.querySelector('.container');
        
        // Esconde botões de sugestão temporariamente para o PDF
        suggestionBtns.forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Opções do HTML2PDF
        const opt = {
            margin: 10,
            filename: 'startse-ai-canvas.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        
        // Gera o PDF
        html2pdf().set(opt).from(element).save().then(function() {
            // Restaura botões de sugestão
            suggestionBtns.forEach(btn => {
                btn.style.display = 'flex';
            });
        });
    });
    
    // Função para salvar o canvas
    saveBtn.addEventListener('click', function() {
        // Coleta dados de todos os campos editáveis
        const canvasData = {
            projectName: document.querySelector('.info-item:nth-child(1) .editable').textContent,
            author: document.querySelector('.info-item:nth-child(2) .editable').textContent,
            email: document.querySelector('.info-item:nth-child(3) .editable').textContent,
            sections: {}
        };
        
        // Coleta dados de cada seção
        document.querySelectorAll('.canvas-cell').forEach(cell => {
            canvasData.sections[cell.id] = cell.querySelector('.editable-area').innerHTML;
        });
        
        // Salva no localStorage
        localStorage.setItem('startseAiCanvas', JSON.stringify(canvasData));
        
        // Feedback para o usuário
        showNotification('Canvas salvo com sucesso!');
    });
    
    // Função para exibir notificação
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilo da notificação
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#2255A3';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        
        document.body.appendChild(notification);
        
        // Remove notificação após 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Carrega dados salvos se existirem
    function loadSavedData() {
        const savedData = localStorage.getItem('startseAiCanvas');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Preenche informações do projeto
            document.querySelector('.info-item:nth-child(1) .editable').textContent = data.projectName;
            document.querySelector('.info-item:nth-child(2) .editable').textContent = data.author;
            document.querySelector('.info-item:nth-child(3) .editable').textContent = data.email;
            
            // Preenche conteúdo das seções
            for (const [id, content] of Object.entries(data.sections)) {
                const cell = document.getElementById(id);
                if (cell) {
                    cell.querySelector('.editable-area').innerHTML = content;
                }
            }
        }
    }
    
    // Manipuladores para botões de sugestão
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cell = this.closest('.canvas-cell');
            const section = cell.id;
            
            // Aqui você poderia implementar uma chamada real para uma API de IA
            // Por enquanto, apenas adicionamos sugestões exemplo
            const suggestions = {
                problema: "Descreva o problema de negócio que você está tentando resolver. Por exemplo: 'Dificuldade em analisar grandes volumes de dados de clientes para identificar padrões de comportamento e personalizar ofertas.'",
                'sem-ai': "Descreva como este problema é resolvido atualmente sem utilizar Inteligência Artificial. Por exemplo: 'Atualmente, analistas de dados realizam consultas manuais no banco de dados e criam relatórios em Excel, que são então enviados para a equipe de marketing.'",
                'com-ai': "Descreva como uma solução baseada em IA poderia resolver este problema. Por exemplo: 'Um sistema de machine learning que analisa automaticamente dados de comportamento, identifica padrões e segmenta clientes, gerando recomendações personalizadas em tempo real.'",
                'para-quem': "Liste as personas que se beneficiariam desta solução. Por exemplo: 'Gerentes de marketing, analistas de dados, equipe de vendas, clientes finais que receberão ofertas mais relevantes.'",
                dados: "Liste os dados necessários e suas fontes. Por exemplo: 'Histórico de compras (sistema ERP), dados de navegação (website), dados demográficos (CRM), feedback dos clientes (pesquisas).'",
                ferramentas: "Liste ferramentas que poderiam ser utilizadas. Por exemplo: 'Python com bibliotecas de ciência de dados (Pandas, Scikit-learn), Plataforma de BI como Power BI, Ferramentas no-code como Obviously AI.'",
                indicadores: "Liste os indicadores de sucesso. Por exemplo: 'Aumento na taxa de conversão, redução no tempo de análise de dados, aumento no ROI das campanhas de marketing, melhoria na satisfação do cliente.'",
                outros: "Liste os próximos passos para a implementação da solução. Por exemplo: 'Fase 1: Coleta e preparação de dados. Fase 2: Desenvolvimento do modelo de machine learning. Fase 3: Integração com sistemas existentes. Fase 4: Testes e validação. Fase 5: Lançamento e monitoramento.'"
            };
            
            if (suggestions[section]) {
                cell.querySelector('.editable-area').textContent = suggestions[section];
            }
        });
    });
    
    // Carrega dados salvos ao iniciar
    loadSavedData();
    
    // Eventos de foco para áreas editáveis (para feedback visual)
    editableAreas.forEach(area => {
        area.addEventListener('focus', function() {
            this.style.borderBottom = '1px dashed #ccc';
        });
        
        area.addEventListener('blur', function() {
            this.style.borderBottom = 'none';
        });
    });
    
    // Gerenciamento de tabs
    document.querySelector('.new-tab-btn').addEventListener('click', function() {
        showNotification('Funcionalidade de múltiplos canvas em desenvolvimento.');
    });
    
    // Fechar tab
    document.querySelector('.close-tab').addEventListener('click', function(e) {
        e.stopPropagation();
        showNotification('Esta é a única tab disponível no momento.');
    });
});
