module.exports = {
    // Ações financeiras e seus sinônimos (com variações e possíveis erros)
    actions: {
      spend: [
        // Formas corretas
        'gastei', 'gasto', 'gastou', 'gastar', 'gasta', 'gastando',
        'comprei', 'compra', 'comprar', 'comprei', 'comprando', 
        'paguei', 'pago', 'pagar', 'pagamento', 'pagando',
        'desembolsei', 'desembolso', 'desembolsar', 
        'torrei', 'torrar', 'torrando', 'torrando dinheiro',
        'investi', 'investimento', 'investir', 
        'adquiri', 'adquirir', 'aquisição',
        'consumí', 'consumi', 'consumir', 'consumo', 'consumido',
        'usei', 'uso', 'usar', 'usando', 
        'debitei', 'debitar', 'débito', 'debitado',
        // Possíveis erros/variações informais
        'gastey', 'gastay', 'gstei', 'gstou', 'comprei', 'conprei', 
        'pagei', 'paguey', 'pago', 'torrey', 'aquiri', 'debite', 'uzei',
        // Frases comuns
        'foi no cartão', 'saiu do bolso', 'saiu da conta', 'tirei da conta',
        'coloquei no cartão', 'passei no cartão', 'passei no débito', 'passei no crédito'
      ],
      
      earn: [
        // Formas corretas
        'recebi', 'receber', 'recebimento', 'recebendo',
        'ganhei', 'ganho', 'ganhar', 'ganhando',
        'entrou', 'entrada', 'entrando', 'entra',
        'depositaram', 'depositou', 'depositar', 'depósito', 'depositado',
        'transferiram', 'transferiu', 'transferência', 'transferido',
        'caiu', 'cair', 'caindo', 'vai cair',
        'salário', 'salario', 'remuneração', 'remuneracao', 'ordenado',
        'rendimento', 'rendeu', 'rendendo',
        'receita', 'renda', 'entrada',
        // Possíveis erros/variações informais
        'recevy', 'ressebi', 'reseby', 'ganhe', 'ganei', 'ganhey',
        'caio na conta', 'entro', 'entrou', 'entrô',
        'depositarão', 'depozito', 'depozitaram',
        'transferirão', 'trasferiram', 'transferiro',
        // Frases comuns
        'entrou dinheiro', 'caiu o pagamento', 'chegou o salário', 
        'recebi um valor', 'me pagaram', 'me depositaram'
      ],
      
      save: [
        // Formas corretas
        'economizei', 'economiza', 'economizar', 'economia', 'economizado',
        'guardei', 'guardar', 'guardar dinheiro', 'guardado', 'guardando',
        'poupar', 'poupo', 'poupei', 'poupança', 'poupando',
        'reservei', 'reservar', 'reserva', 'reservando',
        'separei', 'separar', 'separado', 'separando',
        'apliquei', 'aplicar', 'aplicação', 'aplicado', 'aplicando',
        'investir', 'investi', 'investimento', 'investido', 'investindo',
        // Possíveis erros/variações informais
        'economizey', 'economise', 'economiso',
        'guardey', 'gaurdei', 'gardei',
        'poupey', 'poper', 'poupo', 
        'reservey', 'rezerver', 'rezerver',
        'separey', 'ceparei', 'ceparar',
        'apliquey', 'aplicação', 'aplicaçao',
        // Frases comuns
        'deixei guardado', 'deixei na conta', 'não gastei', 'botei na poupança',
        'coloquei na reserva', 'deixei de lado', 'coloquei no cofrinho'
      ],
      
      budget: [
        // Formas corretas
        'orçamento', 'orcamento', 'orçar', 'orcar',
        'limite', 'limitar', 'limitação', 'limitado',
        'meta', 'metas', 'meta financeira',
        'teto', 'teto de gastos', 'teto financeiro',
        'planejamento', 'planejar', 'planejado', 'planejando',
        'previsão', 'previsao', 'prever', 'previsto',
        'estimativa', 'estimar', 'estimado', 'estimando',
        // Possíveis erros/variações informais
        'orsamento', 'orcamento', 'orssamento',
        'límite', 'limiti', 'planejar', 'planeamento',
        'previçao', 'previzão', 'estimatyva',
        // Frases comuns
        'quero gastar no máximo', 'não quero passar de', 'preciso controlar',
        'tenho que limitar', 'tenho um valor de', 'não pode passar',
        'quero me organizar', 'quero controlar meus gastos', 'preciso definir limite'
      ],
      
      check: [
        // Formas corretas
        'verificar', 'verifico', 'verifique', 'verificando',
        'consultar', 'consulto', 'consulta', 'consultando',
        'ver', 'veja', 'vendo', 'visualizar', 'visualizo', 'visualizando',
        'mostrar', 'mostre', 'mostra', 'mostrando',
        'exibir', 'exiba', 'exibe', 'exibindo',
        'quanto', 'quantia', 'quantidade', 'quanto gastei', 'quanto tenho',
        'relatório', 'relatorio', 'relatórios', 'relatorios',
        'resumo', 'resumir', 'resuma', 'resumido',
        'extrato', 'extratos', 'balanço', 'balanco',
        // Possíveis erros/variações informais
        'verficar', 'vereficar', 'consulta', 'ver quanto', 'mostre me', 'exibe ái',
        'kero ver', 'qero saber', 'relatoro', 'rezumo', 'estrato',
        // Perguntas comuns
        'quanto gastei', 'como estão meus gastos', 'quais os gastos', 
        'onde gastei mais', 'qual categoria', 'como estão as finanças',
        'me mostra', 'me diga', 'gostaria de ver', 'preciso ver',
        'me informe', 'quero saber', 'preciso saber', 'como estou',
        'qual o resumo', 'qual o total', 'qual o valor'
      ]
    },
    
    // Comandos específicos e suas variações
    commands: {
      help: [
        'ajuda', 'ajudar', 'socorro', 'me ajuda', 'help', 'me ajude', 'não entendi',
        'o que você faz', 'como funciona', 'o q vc faz', 'oq vc faz', 'como usar',
        'como te usar', 'comandos', 'instruções', 'instrucoes', 'o que posso fazer',
        'me explica', 'pode me ajudar', 'preciso de ajuda', 'tô perdido', 'to perdido',
        'sos', 'não sei usar', 'nao sei usar', 'como você funciona', 'como vc funciona',
        '?', 'dúvida', 'duvida', 'tenho uma dúvida', 'tenho uma pergunta'
      ],
      
      status: [
        'status', 'situação', 'situacao', 'como estou', 'meu status', 'minha situação',
        'minha situacao', 'minhas finanças', 'minhas financas', 'meus gastos',
        'meu saldo', 'meus cartões', 'meus cartoes', 'minhas contas',
        'meu resumo', 'resumo geral', 'visão geral', 'visao geral',
        'panorama', 'me atualiza', 'me atualize', 'resumir tudo', 
        'como estão as coisas', 'como estão minhas finanças',
        'me diga como estou', 'qual minha situação', 'como anda tudo'
      ],
      
      categories: [
        'categorias', 'quais categorias', 'tipos de gastos', 'classificações',
        'classificacoes', 'tipos de despesas', 'como classificar', 'categorias disponíveis',
        'categorias disponiveis', 'lista de categorias', 'mostrar categorias'
      ]
    },
    
    // Categorias de gastos e seus sinônimos/termos relacionados (muito expandidos)
    categories: {
      food: {
        name: 'alimentação',
        synonyms: [
          'comida', 'alimentação', 'alimentacao', 'refeição', 'refeicao', 
          'almoço', 'almoco', 'jantar', 'janta', 'café', 'cafe', 'lanche', 
          'comidinha', 'comidas', 'nutrição', 'nutricao', 'comer', 'comi',
          'alimentos', 'alimentar', 'alimento', 'mantimento', 'mantimentos',
          'refeições', 'refeicoes', 'cafezinho', 'cafézinho', 'lanchos'
        ],
        related: [
          // Estabelecimentos
          'restaurante', 'lanchonete', 'padaria', 'cafeteria', 'bar', 'pub', 
          'pizzaria', 'hamburgueria', 'churrascaria', 'mercado', 'supermercado',
          'feira', 'açougue', 'acougue', 'peixaria', 'hortifruti', 'sacolão', 'sacolao',
          'empório', 'emporio', 'delicatessen', 'cantina', 'buffet', 'quiosque', 'quiosco',
          // Comidas
          'pizza', 'hamburguer', 'hamburger', 'lanche', 'sanduíche', 'sanduiche', 
          'sushi', 'comida japonesa', 'temaki', 'comida chinesa', 'pastel', 'coxinha',
          'pão de queijo', 'pao de queijo', 'doce', 'sobremesa', 'sorvete', 'açaí', 'acai',
          // Serviços
          'delivery', 'ifood', 'uber eats', 'rappi', '99 food', 'james delivery',
          'aiqfome', 'deliveroo', 'entrega', 'tele-entrega', 'pedido', 'viagem', 
          'marmita', 'marmitex', 'quentinha', 'prato feito', 'pf', 'self-service',
          'rodízio', 'rodizio'
        ]
      },
      
      transport: {
        name: 'transporte',
        synonyms: [
          'transporte', 'locomoção', 'locomocao', 'deslocamento', 'viagem', 'mobilidade',
          'transitar', 'transportar', 'deslocar', 'locomover', 'ir', 'viajar', 'movimento',
          'trânsito', 'transito', 'condução', 'conducao', 'trajeto', 'percurso', 'caminho',
          'translado', 'transfer', 'transferência', 'transferencia', 'traslado'
        ],
        related: [
          // Meios de transporte
          'carro', 'automóvel', 'automovel', 'veículo', 'veiculo', 'moto', 'motocicleta',
          'bicicleta', 'bike', 'patinete', 'ônibus', 'onibus', 'busão', 'busao',
          'metrô', 'metro', 'trem', 'van', 'taxi', 'táxi', 'avião', 'aviao', 'barco',
          'navio', 'cruzeiro', 'helicóptero', 'helicoptero', 'monotrilho', 'barca', 'balsa',
          // Aplicativos e serviços
          'uber', '99', '99 pop', 'cabify', 'indriver', 'blablacar', 'waze', 'carona',
          'buser', 'azul conecta', 'voos', 'passagem aérea', 'passagem aerea', 
          // Despesas relacionadas
          'combustível', 'combustivel', 'gasolina', 'álcool', 'alcool', 'etanol', 'diesel',
          'gnv', 'gás', 'gas', 'estacionamento', 'pedágio', 'pedagio', 'zona azul',
          'manutenção', 'manutencao', 'concerto', 'conserto', 'oficina', 'borracharia',
          'troca de óleo', 'troca de oleo', 'lavagem', 'lava-rápido', 'lava rapido',
          'seguro', 'ipva', 'licenciamento', 'multa', 'infração', 'infracao'
        ]
      },
      
      housing: {
        name: 'moradia',
        synonyms: [
          'moradia', 'habitação', 'habitacao', 'casa', 'apartamento', 'apto', 'ap', 
          'flat', 'kitnet', 'kitnete', 'loft', 'residência', 'residencia', 'lar', 'domicílio', 
          'domicilio', 'imóvel', 'imovel', 'propriedade', 'república', 'republica', 
          'dormitório', 'dormitorio', 'pensão', 'pensao', 'estúdio', 'studio', 'morando',
          'morada', 'viver', 'residir', 'habitar', 'morar'
        ],
        related: [
          // Custos fixos
          'aluguel', 'parcela', 'prestação', 'prestacao', 'financiamento', 'iptu', 'imposto',
          'condomínio', 'condominio', 'prédio', 'predio', 'síndico', 'sindico', 'taxa',
          // Serviços/Utilidades
          'água', 'agua', 'luz', 'energia', 'elétrica', 'eletrica', 'gás', 'gas', 
          'internet', 'wifi', 'wi-fi', 'tv', 'televisão', 'televisao', 'tv a cabo', 'sky', 
          'claro tv', 'oi tv', 'net', 'telefone', 'telefonia', 'fone',
          // Manutenção
          'manutenção', 'manutencao', 'reforma', 'reparo', 'conserto', 'pintura', 'decoração',
          'decoracao', 'móveis', 'moveis', 'mobília', 'mobilia', 'eletrodoméstico', 
          'eletrodomestico', 'limpeza', 'faxina', 'diarista', 'encanador', 'eletricista',
          'jardineiro', 'jardinagem', 'manutenção', 'manutencao', 'portaria',
          // Itens de casa
          'cozinha', 'quarto', 'sala', 'banheiro', 'garagem', 'quintal', 'varanda',
          'sacada', 'área', 'area', 'lavanderia'
        ]
      },
      
      health: {
        name: 'saúde',
        synonyms: [
          'saúde', 'saude', 'bem-estar', 'bem estar', 'bem-estar', 'médico', 'medico', 
          'medicina', 'tratamento', 'consulta', 'clínica', 'clinica', 'hospital',
          'ambulatório', 'ambulatorio', 'terapia', 'saúde mental', 'saude mental',
          'cuidados', 'curar', 'cuidar', 'tratar', 'exame', 'prevenção', 'prevencao',
          'recuperação', 'recuperacao', 'enfermidade', 'doença', 'doenca'
        ],
        related: [
          // Profissionais
          'médico', 'medico', 'doutor', 'doutora', 'dr', 'dra', 'clínico', 'clinico',
          'dentista', 'odontologia', 'ortodontista', 'psicólogo', 'psicologo',
          'psiquiatra', 'terapeuta', 'fisioterapeuta', 'nutricionista', 'nutrição',
          'nutricao', 'dermatologista', 'oftalmologista', 'oculista', 'ortopedista',
          'cardiologista', 'ginecologista', 'urologista', 'pediatra', 'geriatra',
          'endocrinologista', 'otorrino', 'fonoaudiólogo', 'fonoaudiologo',
          'enfermeiro', 'técnico', 'tecnico', 'massoterapeuta', 'quiropraxista',
          'acupunturista', 'homeopata', 
          // Serviços e locais
          'consulta', 'atendimento', 'emergência', 'emergencia', 'pronto-socorro',
          'pronto socorro', 'internação', 'internacao', 'uti', 'centro cirúrgico',
          'hospital', 'clínica', 'clinica', 'laboratório', 'laboratorio', 'exame',
          'check-up', 'check up', 'vacina', 'vacinação', 'vacinacao', 'imunização',
          'imunizacao', 'radiografia', 'raio-x', 'raio x', 'tomografia', 'ressonância',
          'ressonancia', 'ultrassom', 'ultrassonografia', 'exame de sangue',
          // Produtos
          'remédio', 'remedio', 'medicamento', 'fármaco', 'farmaco', 'farmácia',
          'farmacia', 'drogaria', 'droga', 'vitamina', 'suplemento', 'antibiótico',
          'antibiotico', 'analgésico', 'analgesico', 'vacina', 'soro', 'pomada',
          // Planos e seguros
          'plano de saúde', 'plano de saude', 'convênio', 'convenio', 'seguro saúde',
          'seguro saude', 'amil', 'unimed', 'sulamerica', 'bradesco saúde', 'intermédica',
          'notredame', 'porto seguro', 'golden cross', 'blue med', 'são francisco',
          'sao francisco', 'hapvida', 'medial', 'assim', 'prevent senior', 'careplus',
          'amil', 'unimed', 'sulamérica', 'sulamerica',
          // Bem-estar
          'academia', 'ginástica', 'ginastica', 'personal', 'treino', 'exercício',
          'exercicio', 'yoga', 'pilates', 'meditação', 'meditacao', 'spa', 'massagem',
          'acupuntura', 'quiropraxia', 'natação', 'natacao', 'estética', 'estetica'
        ]
      },
      
      entertainment: {
        name: 'entretenimento & lazer',
        synonyms: [
          'entretenimento', 'lazer', 'diversão', 'diversao', 'hobby', 'passatempo',
          'recreação', 'recreacao', 'divertimento', 'distração', 'distracao',
          'descontração', 'descontracao', 'brincadeira', 'relaxamento', 'prazer',
          'curtição', 'curticao', 'curtir', 'divertir', 'entreter', 'recrear',
          'brincar', 'descansar', 'relaxar', 'aproveitar', 'desfrutar', 'gozar'
        ],
        related: [
          // Mídia e streaming
          'netflix', 'amazon prime', 'disney+', 'disney plus', 'hbo max', 'globoplay',
          'paramount+', 'paramount plus', 'star+', 'star plus', 'apple tv', 'youtube premium',
          'spotify', 'deezer', 'apple music', 'tidal', 'amazon music', 'youtube music',
          'crunchyroll', 'mubi', 'telecine', 'hbo', 'discovery+', 'discovery plus',
          'tv', 'televisão', 'televisao', 'streaming', 'assinatura', 
          'música', 'musica', 'filme', 'série', 'serie', 'show', 'concerto',
          // Eventos e locais
          'cinema', 'teatro', 'show', 'espetáculo', 'espetaculo', 'musical', 'ópera',
          'opera', 'concerto', 'festival', 'exposição', 'exposicao', 'museu', 'galeria',
          'parque', 'zoológico', 'zoologico', 'aquário', 'aquario', 'circo', 'boate',
          'balada', 'festa', 'bar', 'clube', 'casa noturna', 'pub', 'restaurante',
          'evento', 'ingresso', 'ticket', 'bilhete', 'entrada', 'excursão', 'excursao',
          // Viagens
          'viagem', 'viajar', 'passagem', 'hospedagem', 'hotel', 'pousada', 'resort',
          'airbnb', 'booking', 'pacote', 'turismo', 'turista', 'tour', 'passeio',
          'praia', 'montanha', 'campo', 'camping', 'internacional', 'nacional',
          'cruzeiro', 'férias', 'ferias', 'feriado', 'fim de semana', 'final de semana',
          // Jogos e hobbies
          'game', 'jogo', 'videogame', 'playstation', 'ps4', 'ps5', 'xbox', 'nintendo',
          'switch', 'steam', 'epic games', 'origin', 'ubisoft', 'battle.net',
          'hobby', 'coleção', 'colecao', 'colecionável', 'colecionavel', 'leitura',
          'livro', 'revista', 'quadrinho', 'hq', 'mangá', 'manga', 'esporte', 
          'brinquedo', 'instrumento', 'música', 'musica', 'dança', 'danca', 'arte',
          'pintura', 'desenho', 'fotografia', 'pesca', 'caça', 'caca', 'jardinagem',
          'culinária', 'culinaria'
        ]
      },
      
      education: {
        name: 'educação',
        synonyms: [
          'educação', 'educacao', 'ensino', 'aprendizado', 'aprendizagem', 'estudo',
          'formação', 'formacao', 'instrução', 'instrucao', 'conhecimento', 'didática',
          'didatica', 'pedagogia', 'acadêmico', 'academico', 'escolar', 'universitário',
          'universitario', 'graduação', 'graduacao', 'pós-graduação', 'pos-graduacao',
          'mestrado', 'doutorado', 'especialização', 'especializacao', 'capacitação',
          'capacitacao', 'qualificação', 'qualificacao', 'treinamento', 'desenvolvimento',
          'educar', 'aprender', 'estudar', 'formar', 'instruir', 'lecionar', 'ensinar'
        ],
        related: [
          // Instituições
          'escola', 'colégio', 'colegio', 'faculdade', 'universidade', 'academia',
          'instituto', 'centro de ensino', 'centro educacional', 'centro universitário',
          'centro universitario', 'fundação', 'fundacao', 'cursinho', 'creche', 'berçário',
          'bercario', 'maternal', 'jardim de infância', 'jardim de infancia',
          'pré-escola', 'pre-escola', 'ensino fundamental', 'ensino médio', 'ensino medio',
          'ensino superior', 'pós-graduação', 'pos-graduacao', 'mba', 
          // Cursos e formatos
          'curso', 'aula', 'disciplina', 'matéria', 'materia', 'online', 'ead',
          'workshop', 'oficina', 'palestra', 'seminário', 'seminario', 'simpósio',
          'simposio', 'congresso', 'conferência', 'conferencia', 'treinamento', 
          'certificação', 'certificacao', 'diploma', 'formação', 'formacao', 
          // Materiais
          'livro', 'apostila', 'material', 'didático', 'didatico', 'caderno', 'caneta',
          'lápis', 'lapis', 'borracha', 'mochila', 'uniforme', 'calculadora', 'estojo',
          'dicionário', 'dicionario', 'atlas', 'ebook', 'vídeo-aula', 'video-aula',
          'bibliografia', 'biblioteca', 'tablet', 'computador', 'notebook',
          // Pagamentos
          'mensalidade', 'anuidade', 'semestre', 'semestralidade', 'trimestralidade',
          'matrícula', 'matricula', 'inscrição', 'inscricao', 'bolsa', 'financiamento',
          'fies', 'prouni', 'desconto', 'bolsista', 'taxa', 'multa', 'prova', 'exame',
          'vestibular', 'enem', 'concurso'
        ]
      },
      
      finance: {
        name: 'finanças & investimentos',
        synonyms: [
          'finanças', 'financas', 'financeiro', 'dinheiro', 'grana', 'patrimônio',
          'patrimonio', 'recurso', 'recursos', 'capital', 'economia', 'monetário',
          'monetario', 'investimento', 'aplicação', 'aplicacao', 'mercado', 'banco',
          'bancário', 'bancario', 'financiamento', 'crédito', 'credito', 'débito',
          'debito', 'transação', 'transacao', 'operação', 'operacao', 'finança'
        ],
        related: [
          // Tipos de investimentos
          'investimento', 'aplicação', 'aplicacao', 'poupança', 'poupanca', 'cdb',
          'tesouro direto', 'tesouro', 'selic', 'título', 'titulo', 'ação', 'acao',
          'fundo', 'fii', 'etf', 'renda fixa', 'renda variável', 'renda variavel',
          'bolsa', 'bolsa de valores', 'b3', 'forex', 'criptomoeda', 'bitcoin',
          'ethereum', 'moeda digital', 'previdência', 'previdencia', 'pgbl', 'vgbl',
          'lci', 'lca', 'cri', 'cra', 'debênture', 'debenture',
          // Taxas e impostos
          'taxa', 'juros', 'tarifa', 'cobrança', 'cobranca', 'imposto', 'tributo',
          'iof', 'ir', 'imposto de renda', 'contribuição', 'contribuicao',
          // Operações
          'empréstimo', 'emprestimo', 'financiamento', 'parcelamento', 'parcela',
          'prestação', 'prestacao', 'crédito', 'credito', 'dívida', 'divida',
          'cheque', 'boleto', 'carnê', 'carne', 'fatura', 'pagamento',
          // Serviços financeiros
          'banco', 'financeira', 'corretora', 'seguradora', 'seguro', 'previdência',
          'previdencia', 'capitalização', 'capitalizacao', 'consórcio', 'consorcio',
          'cooperativa', 'crédito', 'credito', 'cofre', 'caixa', 'atm', 'pix', 'ted',
          'doc', 'transferência', 'transferencia', 'saque', 'depósito', 'deposito',
          // Nomes específicos
          'nubank', 'itaú', 'itau', 'bradesco', 'santander', 'banco do brasil',
          'caixa', 'inter', 'next', 'original', 'c6', 'xp', 'clear', 'rico', 'modal',
          'genial', 'avenue', 'easynvest', 'binance', 'mercado bitcoin', 'itaú',
          'bradesco', 'santander', 'caixa econômica', 'safra', 'btg', 'sicredi',
          'sicoob', 'banco pan', 'banrisul', 'banese'
        ]
      },
      
      shopping: {
        name: 'compras & diversos',
        synonyms: [
          'compra', 'compras', 'shopping', 'aquisição', 'aquisicao', 'consumo',
          'varejo', 'comércio', 'comercio', 'loja', 'produto', 'mercadoria',
          'item', 'artigo', 'peça', 'peca', 'comprado', 'adquirido', 'comprando',
          'adquirindo', 'consumindo', 'comprei', 'adquiri', 'consumi'
        ],
        related: [
          // Tipos de produtos
          'roupa', 'vestuário', 'vestuario', 'calçado', 'calcado', 'tênis', 'tenis',
          'sapato', 'sandália', 'sandalia', 'bota', 'chinelo', 'bolsa', 'mochila',
          'acessório', 'acessorio', 'jóia', 'joia', 'bijuteria', 'relógio', 'relogio',
          'óculos', 'oculos', 'eletrônico', 'eletronico', 'celular', 'smartphone',
          'telefone', 'computador', 'notebook', 'tablet', 'ipad', 'iphone', 'samsung',
          'xiaomi', 'tv', 'televisão', 'televisao', 'eletrodoméstico', 'eletrodomestico',
          'geladeira', 'fogão', 'fogao', 'microondas', 'lavadora', 'máquina', 'maquina',
          'aspirador', 'ventilador', 'ar-condicionado', 'ar condicionado',
          'móvel', 'movel', 'mobília', 'mobilia', 'sofá', 'sofa', 'cama', 'colchão',
          'colchao', 'mesa', 'cadeira', 'poltrona', 'armário', 'armario', 'criado-mudo',
          // Lojas e lugares
          'loja', 'shopping', 'centro comercial', 'mercado', 'feira', 'galeria',
          'outlet', 'magazine', 'departamento', 'virtual', 'online', 'ecommerce',
          'e-commerce', 'marketplace', 'site', 'aplicativo', 'app', 'delivery',
          // Nomes específicos
          'amazon', 'americanas', 'mercado livre', 'shopee', 'aliexpress', 'magalu',
          'magazine luiza', 'casas bahia', 'ponto frio', 'extra', 'carrefour',
          'assaí', 'assai', 'big', 'atacadão', 'atacadao', 'leroy merlin', 'ikea',
          'c&a', 'cea', 'renner', 'riachuelo', 'marisa', 'hering', 'zara', 'shein',
          // Beleza e cuidados pessoais
          'beleza', 'autocuidado', 'cuidado pessoal', 'maquiagem', 'cosmético',
          'cosmetico', 'perfume', 'fragrância', 'fragrancia', 'cabelo', 'pele',
          'hidratante', 'protetor solar', 'shampoo', 'condicionador', 'creme',
          'loção', 'locao', 'esmalte', 'batom', 'base', 'pó', 'po', 'sombra',
          'rímel', 'rimel', 'delineador', 'blush', 'pinça', 'pinca', 'depilação',
          'depilacao', 'manicure', 'pedicure', 'salão', 'salao', 'barbearia',
          // Outros
          'presente', 'gift', 'lembrança', 'lembranca', 'souvenir', 'mimo',
          'aniversário', 'aniversario', 'natal', 'páscoa', 'pascoa', 'dia dos pais',
          'dia das mães', 'dia das maes', 'dia dos namorados', 'black friday', 
          'livro', 'livros', 'papelaria', 'material', 'escritório', 'escritorio',
          'decoração', 'decoracao', 'casa', 'jardim', 'pet', 'animal', 'cachorro',
          'gato', 'ração', 'racao', 'brinquedo'
        ]
      }
    },
    
    // Períodos de tempo e suas variações
    timePeriods: {
      day: [
        'hoje', 'dia', 'diário', 'diario', 'nas últimas 24 horas', 'nas ultimas 24 horas',
        'neste dia', 'no dia de hoje', 'dia atual', 'dia corrente', 'manhã', 'manha', 
        'tarde', 'noite', 'hoje cedo', 'hoje à tarde', 'hoje a tarde', 'hoje à noite',
        'hoje a noite', 'dia de hoje', 'nas últimas horas', 'nas ultimas horas',
        'último dia', 'ultimo dia', 'esse dia', 'este dia', 'atual', 'presente'
      ],
      week: [
        'semana', 'semanal', 'semana atual', 'nesta semana', 'última semana', 'ultima semana',
        'últimos 7 dias', 'ultimos 7 dias', 'desde segunda', 'esta semana', 'semana corrente',
        'essa semana', 'na semana', 'durante a semana', 'sete dias', '7 dias', 'semana passada',
        'nestes últimos dias', 'nestes ultimos dias', 'nos últimos dias', 'nos ultimos dias',
        'recentemente', 'recente', 'há poucos dias', 'ha poucos dias', 'poucos dias atrás',
        'poucos dias atras', 'semana que passou', 'na última semana', 'na ultima semana'
      ],
      month: [
        'mês', 'mes', 'mensal', 'no mês', 'no mes', 'últimos 30 dias', 'ultimos 30 dias',
        'último mês', 'ultimo mes', 'neste mês', 'neste mes', 'mês atual', 'mes atual',
        'mês corrente', 'mes corrente', 'este mês', 'este mes', 'esse mês', 'esse mes', 
        'durante o mês', 'durante o mes', 'trinta dias', '30 dias', 'mês passado',
        'mes passado', 'neste último mês', 'neste ultimo mes', 'no mês corrente', 
        'no último mês', 'no ultimo mes', 'período mensal', 'periodo mensal',
        'janeiro', 'fevereiro', 'março', 'marco', 'abril', 'maio', 'junho', 'julho',
        'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ],
      year: [
        'ano', 'anual', 'anualmente', 'no ano', 'últimos 12 meses', 'ultimos 12 meses',
        'último ano', 'ultimo ano', 'neste ano', 'ano atual', 'ano corrente', 'este ano',
        'esse ano', 'durante o ano', 'doze meses', '12 meses', 'ano passado', 'ano anterior',
        'neste último ano', 'neste ultimo ano', 'no ano corrente', 'no último ano', 'no ultimo ano',
        'período anual', 'periodo anual', 'exercício', 'exercicio', 'ciclo anual', 'desde janeiro',
        '2023', '2024', '2025', '2022', '2021', '2020'
      ]
    },
    
    // Expressões de data muito detalhadas
    dateExpressions: {
      today: [
        'hoje', 'neste dia', 'dia atual', 'dia de hoje', 'no dia de hoje', 'agora',
        'neste momento', 'atualmente', 'corrente', 'momento', 'presente', 'atual',
        'hj', 'hje'
      ],
      yesterday: [
        'ontem', 'dia anterior', 'um dia atrás', 'um dia atras', 'dia de ontem', 
        'no dia de ontem', 'ontém', 'hontem', 'onti', 'ysterday'
      ],
      dayBeforeYesterday: [
        'anteontem', 'antes de ontem', 'dois dias atrás', 'dois dias atras',
        'dia retrasado', 'antiontem', 'anteohontem', 'trasanteontem'
      ],
      lastWeek: [
        'semana passada', 'última semana', 'ultima semana', 'na semana anterior',
        'semana retrasada', 'semana que passou', 'a semana anterior', 'na última',
        'na ultima', 'da semana passada', 'da última semana', 'da ultima semana',
        'semana antes', 'na outra semana', 'na semana anteiror'
      ],
      lastMonth: [
        'mês passado', 'mes passado', 'último mês', 'ultimo mes', 'no mês anterior',
        'no mes anterior', 'mês retrasado', 'mes retrasado', 'mês que passou', 
        'mes que passou', 'o mês anterior', 'o mes anterior', 'no último',
        'no ultimo', 'do mês passado', 'do mes passado', 'do último mês', 
        'do ultimo mes', 'mês antes', 'mes antes', 'no outro mês', 'no mes', 'último',
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
        'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ],
      thisMonth: [
        'este mês', 'este mes', 'neste mês', 'neste mes', 'mês atual', 'mes atual',
        'mês corrente', 'mes corrente', 'neste período',, 'neste periodo',
        'dentro desse mês', 'dentro desse mes', 'durante este mês', 'durante este mes',
        'decorrer deste mês', 'decorrer deste mes', 'atual mês', 'atual mes',
        'desse mês', 'desse mes', 'mês vigente', 'mes vigente', 'esse',
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
        'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ],
      nextMonth: [
        'próximo mês', 'proximo mes', 'mês que vem', 'mes que vem', 'mês seguinte',
        'mes seguinte', 'mês vindouro', 'mes vindouro', 'mês subsequente', 
        'mes subsequente', 'no próximo mês', 'no proximo mes', 'no mês que vem',
        'no mes que vem', 'dentro do próximo mês', 'dentro do proximo mes',
        'mês posterior', 'mes posterior', 'mês futuro', 'mes futuro', 'mês que está por vir',
        'mes que está por vir', 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ]
    },
    
    // Nomes dos meses em português com variações comuns
    months: [
      'janeiro', 'jan', 'jan.', 'janeiro de', 'em janeiro',
      'fevereiro', 'fev', 'fev.', 'fevereiro de', 'em fevereiro',
      'março', 'marco', 'mar', 'mar.', 'março de', 'marco de', 'em março', 'em marco',
      'abril', 'abr', 'abr.', 'abril de', 'em abril',
      'maio', 'mai', 'mai.', 'maio de', 'em maio',
      'junho', 'jun', 'jun.', 'junho de', 'em junho',
      'julho', 'jul', 'jul.', 'julho de', 'em julho',
      'agosto', 'ago', 'ago.', 'agosto de', 'em agosto',
      'setembro', 'set', 'set.', 'setembro de', 'em setembro',
      'outubro', 'out', 'out.', 'outubro de', 'em outubro',
      'novembro', 'nov', 'nov.', 'novembro de', 'em novembro',
      'dezembro', 'dez', 'dez.', 'dezembro de', 'em dezembro'
    ],
    
    // Termos relacionados a cartões com variações
    cards: {
      types: [
        'crédito', 'credito', 'de crédito', 'de credito', 'credit', 'credit card',
        'débito', 'debito', 'de débito', 'de debito', 'debit', 'debit card',
        'pré-pago', 'pre-pago', 'prepago', 'prepaid',
        'vale', 'vr', 'va', 'alimentação', 'alimentacao', 'refeição', 'refeicao',
        'multibenefícios', 'multibeneficio', 'benefícios', 'beneficios', 
        'sodexo', 'alelo', 'ticket', 'ben', 'flash', 'pleno',
        'nubank', 'itaú', 'itau', 'bradesco', 'santander', 'banco do brasil',
        'caixa', 'inter', 'next', 'original', 'c6', 'xp', 'will bank', 'bmg',
        'mastercard', 'visa', 'amex', 'elo', 'hipercard', 'american express',
        'black', 'platinum', 'gold', 'internacional', 'nacional', 'básico', 'basico'
      ],
      actions: [
        'cadastrar', 'cadastro', 'cadastre', 'cadastrado', 'cadastrando',
        'registrar', 'registro', 'registre', 'registrado', 'registrando',
        'adicionar', 'adicione', 'adicionado', 'adicionando', 'adição', 'adicao',
        'incluir', 'inclua', 'incluído', 'incluido', 'incluindo', 'inclusão', 'inclusao',
        'inserir', 'insira', 'inserido', 'inserindo', 'inserção', 'insercao',
        'mudar', 'mude', 'mudado', 'mudando', 'mudança', 'mudanca', 
        'atualizar', 'atualize', 'atualizado', 'atualizando', 'atualização', 'atualizacao',
        'modificar', 'modifique', 'modificado', 'modificando', 'modificação', 'modificacao',
        'alterar', 'altere', 'alterado', 'alterando', 'alteração', 'alteracao',
        'remover', 'remova', 'removido', 'removendo', 'remoção', 'remocao',
        'excluir', 'exclua', 'excluído', 'excluido', 'excluindo', 'exclusão', 'exclusao',
        'apagar', 'apague', 'apagado', 'apagando', 'deleção', 'delecao',
        'deletar', 'delete', 'deletado', 'deletando'
      ],
      properties: [
        'limite', 'teto', 'máximo', 'maximo', 'crédito disponível', 'credito disponível',
        'saldo', 'disponível', 'disponivel', 'restante', 'remanescente', 'sobra',
        'valor', 'quantia', 'montante', 'total',
        'data', 'dia', 'data de', 'dia de', 'data do', 'dia do',
        'vencimento', 'fechamento', 'corte', 'pagamento',
        'recarga', 'carregamento', 'creditado', 'adicionado',
        'fatura', 'extrato', 'demonstrativo', 'histórico', 'historico'
      ]
    },
    
    // Termos relacionados a contas a pagar com variações
    bills: {
      types: [
        'conta', 'contas', 'fatura', 'faturas', 'boleto', 'boletos', 
        'mensalidade', 'mensalidades', 'parcela', 'parcelas', 'prestação', 'prestacoes',
        'carnê', 'carne', 'carnês', 'carnes', 'cobrança', 'cobranca', 'cobranças', 'cobrancas',
        'pagamento', 'pagamentos', 'compromisso', 'compromissos', 'dívida', 'dividas',
        'despesa fixa', 'despesas fixas', 'conta fixa', 'contas fixas', 'fixa', 'fixas',
        'obrigação', 'obrigacoes', 'pendência', 'pendencias', 'vencimento', 'vencimentos'
      ],
      status: [
        'pago', 'paga', 'pagos', 'pagas', 'quitado', 'quitada', 'quitados', 'quitadas',
        'paguei', 'pagamos', 'pagou', 'pagaram',
        'vencida', 'vencido', 'vencidas', 'vencidos', 
        'atrasada', 'atrasado', 'atrasadas', 'atrasados', 'em atraso',
        'a pagar', 'para pagar', 'a vencer', 'não vencida', 'nao vencida', 
        'pendente', 'pendentes', 'em aberto', 'aberta', 'aberto', 'abertas', 'abertos',
        'não paga', 'nao paga', 'não pago', 'nao pago'
      ],
      actions: [
        'registrar', 'registro', 'registre', 'registrado', 'registrando',
        'cadastrar', 'cadastro', 'cadastre', 'cadastrado', 'cadastrando',
        'adicionar', 'adicione', 'adicionado', 'adicionando',
        'incluir', 'inclua', 'incluído', 'incluido', 'incluindo',
        'lembrar', 'lembre', 'lembrete', 'aviso', 'avise', 'notificar', 'notifique',
        'remover', 'remova', 'removido', 'removendo',
        'excluir', 'exclua', 'excluído', 'excluido', 'excluindo',
        'pagar', 'pague', 'pagando', 'pagamento', 
        'quitar', 'quite', 'quitação', 'quitacao', 'quitando',
        'liquidar', 'liquide', 'liquidado', 'liquidando', 'liquidação', 'liquidacao',
        'saldar', 'salde', 'saldado', 'saldando',
        'marcar como pago', 'marcar como paga', 'marque como pago', 'marque como paga'
      ]
    },
    
    // Termos relacionados a relatórios com variações
    reports: {
      types: [
        'relatório', 'relatorio', 'relatórios', 'relatorios', 'report', 'reports',
        'resumo', 'resumos', 'síntese', 'sintese', 'sumário', 'sumario',
        'balanço', 'balanco', 'balanços', 'balancos', 'análise', 'analise', 'análises', 'analises',
        'extrato', 'extratos', 'demonstrativo', 'demonstrativos',
        'histórico', 'historico', 'históricos', 'historicos',
        'gráfico', 'grafico', 'gráficos', 'graficos', 'visualização', 'visualizacao',
        'estatística', 'estatistica', 'estatísticas', 'estatisticas',
        'panorama', 'panorâmica', 'panoramica', 'visão geral', 'visao geral', 'overview'
      ],
      periods: [
        'diário', 'diario', 'diária', 'diaria', 'do dia', 'no dia', 'por dia',
        'semanal', 'da semana', 'na semana', 'por semana',
        'mensal', 'do mês', 'do mes', 'no mês', 'no mes', 'por mês', 'por mes',
        'anual', 'do ano', 'no ano', 'por ano', 'anualmente',
        'período', 'periodo', 'períodos', 'periodos', 'prazo', 'prazos',
        'intervalo', 'intervalos', 'entre', 'desde', 'até', 'ate', 'a partir',
        'últimos', 'ultimos', 'recentes', 'passados', 'anteriores',
        'data', 'datas', 'datado', 'datados'
      ],
      elements: [
        'categoria', 'categorias', 'tipo', 'tipos', 'classificação', 'classificacao',
        'valor', 'valores', 'quantia', 'quantias', 'montante', 'montantes',
        'total', 'totais', 'somatório', 'somatorio', 'soma', 'somas',
        'média', 'media', 'médias', 'medias', 'medianas', 'mediana',
        'máximo', 'maximo', 'máximos', 'maximos', 'maior', 'maiores',
        'mínimo', 'minimo', 'mínimos', 'minimos', 'menor', 'menores',
        'gasto', 'gastos', 'despesa', 'despesas', 'desembolso', 'desembolsos',
        'receita', 'receitas', 'entrada', 'entradas', 'ganho', 'ganhos',
        'diferença', 'diferenca', 'diferenças', 'diferencas',
        'percentual', 'percentuais', 'porcentagem', 'porcentagens',
        'comparação', 'comparacao', 'comparativo', 'comparativos',
        'tendência', 'tendencia', 'tendências', 'tendencias', 'evolução', 'evolucao'
      ]
    },
    
    // Afirmações e negações para uso em diálogos de confirmação
    confirmations: {
      affirmative: [
        'sim', 'yes', 's', 'y', 'claro', 'ok', 'okay', 'beleza', 'blz', 'confirmado',
        'confirmo', 'confirmar', 'certo', 'certamente', 'afirmativo', 'positivo',
        'pode ser', 'concordo', 'aceito', 'quero', 'gostaria', 'uhum', 'aham', 'isso',
        'isso mesmo', 'exatamente', 'exato', 'correto', 'sem dúvida', 'sem duvida',
        'com certeza', 'perfeitamente', 'ótimo', 'otimo', 'bom', 'tá bom', 'ta bom',
        'tá bem', 'ta bem', 'tudo bem', 'tudo certo', 'verdade', 'verdadeiro',
        'é isso', 'é isso mesmo', 'é isso aí', 'é isso ai', 'é isso mesmo', 'é isso msm',
        'ss', 'sss', 'sssss', 'siiim'
      ],
      negative: [
        'não', 'nao', 'no', 'n', 'nunca', 'jamais', 'negativo', 'nem pensar',
        'de jeito nenhum', 'nem a pau', 'discordo', 'recuso', 'rejeito', 'não quero',
        'nao quero', 'não gostaria', 'nao gostaria', 'não mesmo', 'nao mesmo',
        'nem', 'nem mesmo', 'não concordo', 'nao concordo', 'incorreto', 'errado',
        'não é isso', 'nao é isso', 'não é bem isso', 'nao é bem isso',
        'não exatamente', 'nao exatamente', 'não está certo', 'nao esta certo',
        'falso', 'mentira', 'não é verdade', 'nao e verdade', 'definitivamente não',
        'definitivamente nao', 'certamente não', 'certamente nao',
        'nn', 'nnn', 'nnnnnnn', 'naaaao', 'naum'
      ]
    }
  };