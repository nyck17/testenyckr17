const { CATEGORIES } = require('../config/categories');
const dictionary = require('./dictionary');

/**
 * Verifica se uma mensagem contém registro de gasto
 */
function detectExpense(message) {
  const lowerMessage = message.toLowerCase().trim();

  // Padrões de despesas
  const expensePatterns = [
    // Padrões diretos
    /(?:gastei|gastar|gasto|gastou|gastamos)/i,
    /(?:comprei|comprar|compra|comprou|compramos)/i,
    /(?:paguei|pagar|pago|pagou|pagamos)/i,
    /(?:custou|custa|custar|custando)/i,
    
    // Variações com erros comuns
    /(?:gastey|gextei|gastay|gastô)/i,
    /(?:comprey|compray|comprô)/i,
    /(?:paguey|paguay|pagô)/i,
    
    // Expressões de valor
    /(?:R\$\s*\d+|\d+\s*reais|\d+\s*real|\d+\s*pila|\d+\s*conto)/i,
    
    // Expressões de compra
    /(?:fiz\s+uma\s+compra)/i,
    /(?:realizei\s+uma\s+compra)/i,
    /(?:fiz\s+um\s+pagamento)/i,
    
    // Expressões coloquiais
    /(?:torrei|queimei|torrar|queimar)/i,
    /(?:desembolsei|desembolsar|desembolso)/i,
    /(?:investir|investi|investimento)/i
  ];

  // Verifica cada padrão
  for (const pattern of expensePatterns) {
    if (pattern.test(lowerMessage)) return true;
  }

  return false;
}

/**
 * Extrai informações de gasto de uma mensagem
 */
function extractExpenseData(message) {
  const lowerMessage = message.toLowerCase().trim();

  // Objeto para armazenar as informações extraídas
  const expenseInfo = {
    amount: 0,
    category: null,
    subcategory: null,
    description: null,
    date: new Date().toISOString()
  };

  // Extrair valor
  const valuePatterns = [
    /R\$\s*(\d+(?:[.,]\d{2})?)/i,
    /(\d+(?:[.,]\d{2})?)\s*reais/i,
    /(\d+(?:[.,]\d{2})?)\s*real/i,
    /(\d+(?:[.,]\d{2})?)\s*pila/i,
    /(\d+(?:[.,]\d{2})?)\s*conto/i,
    /valor\s*(?:de|em|\:)?\s*(\d+(?:[.,]\d{2})?)/i
  ];

  for (const pattern of valuePatterns) {
    const match = lowerMessage.match(pattern);
    if (match && match[1]) {
      expenseInfo.amount = parseFloat(match[1].replace(',', '.'));
      break;
    }
  }

  // Extrair data
  const datePatterns = [
    // Hoje/Ontem/Anteontem
    {pattern: /hoje/i, days: 0},
    {pattern: /ontem/i, days: 1},
    {pattern: /anteontem/i, days: 2},
    
    // Data específica
    {pattern: /(\d{1,2})\s*\/\s*(\d{1,2})(?:\s*\/\s*(\d{2,4}))?/i, specific: true},
    
    // Data por extenso
    {pattern: /(\d{1,2})\s+de\s+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/i, extended: true}
  ];

  for (const {pattern, days, specific, extended} of datePatterns) {
    const match = lowerMessage.match(pattern);
    if (match) {
      if (specific) {
        const [_, day, month, year] = match;
        const currentYear = new Date().getFullYear();
        expenseInfo.date = new Date(year ? parseInt(year) > 2000 ? parseInt(year) : 2000 + parseInt(year) : currentYear, parseInt(month) - 1, parseInt(day));
      } else if (extended) {
        const months = {
          'janeiro': 0, 'fevereiro': 1, 'março': 2, 'marco': 2, 'abril': 3,
          'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7, 'setembro': 8,
          'outubro': 9, 'novembro': 10, 'dezembro': 11
        };
        const [_, day, month] = match;
        expenseInfo.date = new Date(new Date().getFullYear(), months[month.toLowerCase()], parseInt(day));
      } else if (days !== undefined) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        expenseInfo.date = date;
      }
      break;
    }
  }

  // Tentar identificar categoria e subcategoria
  let bestCategoryMatch = {
    category: null,
    subcategory: null,
    score: 0
  };

  // Função para calcular similaridade entre strings
  const similarity = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    return 1 - (matrix[len1][len2] / Math.max(len1, len2));
  };

  const words = lowerMessage.split(/\s+/);
  
  for (const [categoryName, categoryData] of Object.entries(dictionary.categories)) {
    // Verificar sinônimos da categoria
    for (const synonym of categoryData.synonyms) {
      for (const word of words) {
        const score = similarity(word, synonym);
        if (score > 0.8 && score > bestCategoryMatch.score) {
          bestCategoryMatch = {
            category: categoryData.name,
            subcategory: null,
            score: score
          };
        }
      }
    }
    
    // Verificar termos relacionados (subcategorias)
    for (const related of categoryData.related) {
      for (const word of words) {
        const score = similarity(word, related);
        if (score > 0.8 && score > bestCategoryMatch.score) {
          bestCategoryMatch = {
            category: categoryData.name,
            subcategory: related,
            score: score
          };
        }
      }
    }
  }

  // Se não encontrou categoria, usar análise de contexto
  if (!bestCategoryMatch.category) {
    if (lowerMessage.match(/(?:comida|aliment|lanche|restau|mercado|pizza|burguer|ifood)/i)) {
      bestCategoryMatch = { category: 'alimentação', subcategory: 'restaurante', score: 1 };
    } else if (lowerMessage.match(/(?:uber|99|táxi|busão|metrô|gasolina|alcool|combustível)/i)) {
      bestCategoryMatch = { category: 'transporte', subcategory: 'transporte público', score: 1 };
    } else if (lowerMessage.match(/(?:netflix|amazon|disney|spotify|cinema|show|ingresso)/i)) {
      bestCategoryMatch = { category: 'entretenimento & lazer', subcategory: 'assinaturas', score: 1 };
    } else if (lowerMessage.match(/(?:remédio|consulta|médico|dentista|farmácia)/i)) {
      bestCategoryMatch = { category: 'saúde', subcategory: 'farmácia', score: 1 };
    } else {
      bestCategoryMatch = { category: 'compras & diversos', subcategory: 'diversos', score: 1 };
    }
  }

  expenseInfo.category = bestCategoryMatch.category;
  expenseInfo.subcategory = bestCategoryMatch.subcategory || 'diversos';

  // Extrair descrição (removendo partes já identificadas)
  let description = message;
  
  // Remover valor
  description = description.replace(/R\$\s*\d+(?:[.,]\d{2})?|\d+(?:[.,]\d{2})?\s*reais|\d+(?:[.,]\d{2})?\s*pila|\d+(?:[.,]\d{2})?\s*conto/g, '');
  
  // Remover palavras-chave de gasto
  description = description.replace(/(?:gastei|gastar|gasto|comprei|comprar|compra|paguei|pagar|pago)/gi, '');
  
  // Remover datas
  description = description.replace(/(?:hoje|ontem|anteontem|\d{1,2}\s*\/\s*\d{1,2}(?:\s*\/\s*\d{2,4})?|\d{1,2}\s+de\s+(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro))/gi, '');
  
  // Limpar espaços extras e pontuação
  description = description.trim().replace(/\s+/g, ' ').replace(/^\W+|\W+$/g, '');
  
  expenseInfo.description = description || 'Gasto geral';

  return expenseInfo;
}

/**
 * Detecta menção a cartão ou saldo
 */
function detectCardMention(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Lista expandida de palavras relacionadas a cartões
  const cardTerms = [
    'cartao', 'cartão', 'card', 'carteira', 'nubank', 'inter', 'next', 'c6', 
    'mastercard', 'visa', 'elo', 'vr', 'va', 'sodexo', 'alelo', 'ticket',
    'credito', 'crédito', 'débito', 'debito', 'alimentação', 'alimentacao',
    'refeição', 'refeicao', 'corporativo', 'empresarial', 'benefício', 'beneficio'
  ];

  // Padrões de detecção mais flexíveis
  const patterns = [
    // Padrão direto
    /(?:meu|no|com|do|pelo|usando)\s+(?:cartao|cartão|card)/i,
    
    // Padrões com erros comuns
    /(?:cartaum|cartaun|cartau|carteum)/i,
    /(?:credito|crédito|creditu|credto)/i,
    /(?:debito|débito|debitu|debto)/i,
    
    // Padrões com nomes de bancos/bandeiras
    /(?:nubank|inter|next|c6|master|visa|elo)/i,
    
    // Padrões de vale alimentação/refeição
    /(?:vr|va|sodexo|alelo|ticket|ben)/i,
    /vale[\s-]?(?:refeicao|refeição|alimentacao|alimentação)/i,
    
    // Saldo e limite
    /(?:saldo|limite|disponível|disponivel)\s+(?:do|no|em)\s+(?:cartao|cartão|card)/i,
    
    // Padrões de ação
    /(?:add|adicionar|cadastrar|incluir|inserir|configurar|registrar)\s+(?:cartao|cartão|card)/i,
    /(?:atualizar|mudar|alterar)\s+(?:cartao|cartão|card)/i
  ];

  // Verifica palavras individuais
  for (const term of cardTerms) {
    if (lowerMessage.includes(term)) return true;
  }

  // Verifica padrões mais complexos
  for (const pattern of patterns) {
    if (pattern.test(lowerMessage)) return true;
  }

  return false;
}

/**
 * Extrai informações de cartão de uma mensagem
 */
function extractCardData(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Objeto para armazenar as informações extraídas
  const cardInfo = {
    name: null,
    type: null,
    balance: null,
    reloadDay: null,
    reloadAmount: null,
    createdAt: new Date().toISOString()
  };

  // Extrair nome do cartão
  const cardNamePatterns = [
    /(?:cartao|cartão|card)\s+(?:do|da|de)?\s*(\w+)/i,
    /(\w+)(?:\s+(?:card|cartao|cartão))/i,
    /meu\s+(\w+)/i
  ];

  for (const pattern of cardNamePatterns) {
    const match = lowerMessage.match(pattern);
    if (match && match[1]) {
      cardInfo.name = match[1].trim();
      break;
    }
  }

  // Extrair tipo do cartão
  const cardTypes = {
    credito: ['credito', 'crédito', 'credit', 'credto'],
    debito: ['debito', 'débito', 'debit', 'debto'],
    vr: ['vr', 'vale refeição', 'vale refeicao', 'vale-refeição', 'vale-refeicao'],
    va: ['va', 'vale alimentação', 'vale alimentacao', 'vale-alimentação', 'vale-alimentacao'],
    beneficio: ['ben', 'benefício', 'beneficio', 'beneficios', 'benefícios']
  };

  for (const [type, variations] of Object.entries(cardTypes)) {
    if (variations.some(v => lowerMessage.includes(v))) {
      cardInfo.type = type;
      break;
    }
  }

  // Extrair valor/saldo
  const valuePatterns = [
    /(?:tem|possui|com)\s*(?:saldo\s+(?:de|em))?\s*(?:R\$\s*)?(\d+(?:[.,]\d{2})?)/i,
    /(\d+(?:[.,]\d{2})?)\s*(?:reais|pila|conto|real)/i,
    /saldo\s*(?:de|em)?\s*(?:R\$\s*)?(\d+(?:[.,]\d{2})?)/i
  ];

  for (const pattern of valuePatterns) {
    const match = lowerMessage.match(pattern);
    if (match && match[1]) {
      cardInfo.balance = parseFloat(match[1].replace(',', '.'));
      break;
    }
  }

  // Extrair dia de recarga
  const reloadDayPatterns = [
    /(?:todo|cada)\s+dia\s+(\d{1,2})/i,
    /dia\s+(\d{1,2})\s+(?:de cada mês|do mês)/i,
    /recarrega\s+(?:dia\s+)?(\d{1,2})/i
  ];

  for (const pattern of reloadDayPatterns) {
    const match = lowerMessage.match(pattern);
    if (match && match[1]) {
      const day = parseInt(match[1]);
      if (day >= 1 && day <= 31) {
        cardInfo.reloadDay = day;
        cardInfo.reloadAmount = cardInfo.balance;
        break;
      }
    }
  }

  // Validação final
  if (cardInfo.name || cardInfo.type || cardInfo.balance) {
    // Se tiver pelo menos uma informação válida, retorna o objeto
    return {
      name: cardInfo.name || 'cartão',
      type: cardInfo.type || 'geral',
      balance: cardInfo.balance || 0,
      reloadDay: cardInfo.reloadDay,
      reloadAmount: cardInfo.reloadAmount,
      createdAt: cardInfo.createdAt
    };
  }

  return null;
}

// [resto do código continua...]