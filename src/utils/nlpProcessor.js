const natural = require('natural');
const dictionary = require('./dictionary');

// Configurar tokenizer para português
const tokenizer = new natural.WordTokenizer();

// Configurar stemmer para português
const stemmerPt = natural.PorterStemmerPt;

// Classificador para intenções
let intentClassifier = null;

// Inicializar e treinar o classificador
function initClassifier() {
  if (intentClassifier) return intentClassifier;
  
  intentClassifier = new natural.BayesClassifier();
  
  // Treinar para despesas
  dictionary.actions.spend.forEach(term => {
    intentClassifier.addDocument(term, 'expense');
  });
  
  // Treinar para receitas
  dictionary.actions.earn.forEach(term => {
    intentClassifier.addDocument(term, 'income');
  });
  
  // Treinar para economias/investimentos
  dictionary.actions.save.forEach(term => {
    intentClassifier.addDocument(term, 'saving');
  });
  
  // Treinar para orçamentos
  dictionary.actions.budget.forEach(term => {
    intentClassifier.addDocument(term, 'budget');
  });
  
  // Treinar para consultas
  dictionary.actions.check.forEach(term => {
    intentClassifier.addDocument(term, 'report');
  });
  
  // Treinar para cartões
  dictionary.cards.actions.forEach(term => {
    intentClassifier.addDocument(`${term} cartão`, 'card');
  });
  
  // Treinar para contas a pagar
  dictionary.bills.actions.forEach(term => {
    intentClassifier.addDocument(`${term} conta`, 'bill');
  });
  
  // Treinar para comandos de ajuda
  dictionary.commands.help.forEach(term => {
    intentClassifier.addDocument(term, 'help');
  });
  
  // Treinar para comandos de status
  dictionary.commands.status.forEach(term => {
    intentClassifier.addDocument(term, 'status');
  });
  
  // Adicionar frases comuns
  intentClassifier.addDocument('quanto gastei', 'report');
  intentClassifier.addDocument('mostrar relatório', 'report');
  intentClassifier.addDocument('ver meus gastos', 'report');
  intentClassifier.addDocument('adicionar gasto', 'expense');
  intentClassifier.addDocument('registrar despesa', 'expense');
  intentClassifier.addDocument('meu cartão tem', 'card');
  intentClassifier.addDocument('tenho uma conta para pagar', 'bill');
  
  // Treinar o classificador
  intentClassifier.train();
  
  return intentClassifier;
}

// Detectar a intenção principal da mensagem
function detectIntent(message) {
  // Garantir que o classificador está iniciado
  const classifier = initClassifier();
  
  // Converter para minúsculas
  const lowerMessage = message.toLowerCase();
  
  // Classificar a intenção
  return classifier.classify(lowerMessage);
}

// Verificar se há ambiguidade na intenção
function detectAmbiguity(message) {
  // Garantir que o classificador está iniciado
  const classifier = initClassifier();
  
  // Obter todas as classificações com suas probabilidades
  const classifications = classifier.getClassifications(message);
  
  // Ordenar por probabilidade (maior primeiro)
  classifications.sort((a, b) => b.value - a.value);
  
  // Se houver duas classificações próximas (diferença menor que 0.2)
  if (classifications.length >= 2 && 
     (classifications[0].value - classifications[1].value) < 0.2 &&
      classifications[1].value > 0.3) {
    
    return {
      isAmbiguous: true,
      topIntent: classifications[0].label,
      secondIntent: classifications[1].label,
      confidenceTop: classifications[0].value,
      confidenceSecond: classifications[1].value
    };
  }
  
  // Se a confiança da melhor classificação for baixa
  if (classifications[0].value < 0.5) {
    return {
      isAmbiguous: true,
      topIntent: classifications[0].label,
      lowConfidence: true,
      confidence: classifications[0].value
    };
  }
  
  return {
    isAmbiguous: false,
    topIntent: classifications[0].label,
    confidence: classifications[0].value
  };
}

// Gerar uma mensagem de confirmação para casos ambíguos
function generateConfirmationQuestion(ambiguity, message) {
  if (ambiguity.lowConfidence) {
    // Caso de baixa confiança
    switch (ambiguity.topIntent) {
      case 'expense':
        return `Parece que você quer registrar um gasto. É isso mesmo? (Por exemplo: "gastei 50 reais no mercado")`;
      case 'income':
        return `Entendi que você quer registrar uma receita. É isso mesmo? (Por exemplo: "recebi 1000 reais de salário")`;
      case 'card':
        return `Você quer gerenciar informações de cartão? (Por exemplo: "meu cartão nubank tem 500 reais")`;
      case 'bill':
        return `Você quer registrar uma conta a pagar? (Por exemplo: "tenho uma conta de luz para pagar dia 10")`;
      case 'report':
        return `Você quer ver um relatório de gastos? (Por exemplo: "mostrar gastos deste mês")`;
      default:
        return `Não entendi bem o que você quer. Pode explicar de outra forma?`;
    }
  } else {
    // Caso de ambiguidade entre duas intenções
    if (ambiguity.topIntent === 'expense' && ambiguity.secondIntent === 'card') {
      return `Você quer registrar um gasto ou gerenciar informações de cartão?`;
    } else if (ambiguity.topIntent === 'expense' && ambiguity.secondIntent === 'bill') {
      return `Você quer registrar um gasto ou uma conta a pagar?`;
    } else if (ambiguity.topIntent === 'card' && ambiguity.secondIntent === 'report') {
      return `Você quer informações sobre seu cartão ou ver um relatório de gastos?`;
    } else if (ambiguity.topIntent === 'report' && ambiguity.secondIntent === 'bill') {
      return `Você quer ver um relatório ou registrar uma conta a pagar?`;
    } else {
      return `Não entendi bem o que você quer. Você quer falar sobre ${getIntentName(ambiguity.topIntent)} ou ${getIntentName(ambiguity.secondIntent)}?`;
    }
  }
}

// Obter o nome "amigável" da intenção
function getIntentName(intent) {
  switch (intent) {
    case 'expense': return 'registrar gastos';
    case 'income': return 'registrar receitas';
    case 'card': return 'cartões';
    case 'bill': return 'contas a pagar';
    case 'report': return 'relatórios';
    case 'budget': return 'orçamento';
    case 'saving': return 'poupança';
    case 'help': return 'ajuda';
    case 'status': return 'status';
    default: return intent;
  }
}

// Verificar se a resposta é uma confirmação
function isConfirmation(message) {
  const lowerMessage = message.toLowerCase();
  return dictionary.confirmations.affirmative.some(term => 
    lowerMessage.includes(term) || lowerMessage === term
  );
}

// Verificar se a resposta é uma negação
function isRejection(message) {
  const lowerMessage = message.toLowerCase();
  return dictionary.confirmations.negative.some(term => 
    lowerMessage.includes(term) || lowerMessage === term
  );
}

// Tokenizar uma mensagem
function tokenizeMessage(message) {
  return tokenizer.tokenize(message.toLowerCase());
}

// Stemming de palavras em português
function stemWords(words) {
  return words.map(word => stemmerPt.stem(word));
}

// Calcular similaridade entre duas strings (usando distância de Levenshtein)
function calculateSimilarity(str1, str2) {
  return natural.LevenshteinDistance(str1, str2);
}

// Extrair melhor correspondência de uma lista usando similaridade
function findBestMatch(target, candidates) {
  if (!candidates || candidates.length === 0) return null;
  
  let bestMatch = null;
  let bestScore = Infinity;
  
  for (const candidate of candidates) {
    const score = calculateSimilarity(target.toLowerCase(), candidate.toLowerCase());
    if (score < bestScore) {
      bestScore = score;
      bestMatch = candidate;
    }
  }
  
  // Retorna apenas se o score for bom o suficiente (menor que metade do tamanho)
  return bestScore < target.length / 2 ? bestMatch : null;
}

// Analisar uma mensagem completa
function analyzeMessage(message) {
  // Inicializar o classificador se não foi feito ainda
  initClassifier();
  
  // Determinar a intenção e verificar ambiguidade
  const ambiguity = detectAmbiguity(message);
  const intent = ambiguity.topIntent;
  
  // Tokenizar a mensagem
  const tokens = tokenizeMessage(message);
  
  // Aplicar stemming para análise mais precisa
  const stems = stemWords(tokens);
  
  // Extrair possíveis categorias, datas, valores, etc.
  let extractedInfo = extractEntitiesFromMessage(message, tokens);
  
  return {
    intent,
    ambiguity,
    tokens,
    stems,
    extractedInfo,
    originalMessage: message
  };
}

// Extrair entidades (valores, categorias, datas) de uma mensagem
function extractEntitiesFromMessage(message, tokens) {
  const lowerMessage = message.toLowerCase();
  
  // Arrays para armazenar entidades encontradas
  const entities = {
    categories: [],
    amounts: [],
    dates: [],
    cardTypes: [],
    cardNames: []
  };
  
  // Procurar categorias
  for (const [catKey, catData] of Object.entries(dictionary.categories)) {
    const categoryTerms = [...catData.synonyms, catData.name];
    
    for (const term of categoryTerms) {
      if (tokens.includes(term) || lowerMessage.includes(term)) {
        entities.categories.push({
          category: catData.name,
          matchedTerm: term,
          confidence: 1.0
        });
        break;
      }
    }
    
    // Procurar termos relacionados (subcategorias)
    for (const related of catData.related) {
      if (tokens.includes(related) || lowerMessage.includes(related)) {
        entities.categories.push({
          category: catData.name,
          subcategory: related,
          matchedTerm: related,
          confidence: 0.8
        });
      }
    }
  }
  
  // Procurar valores monetários
  const valueRegex = /(R\$\s*(\d+[\.,]\d+)|\s(\d+[\.,]\d+)\s*reais|(\d+)\s*reais|(\d+)[.,](\d+)|valor\s+(?:de\s+)?(\d+))/gi;
  let match;
  
  while ((match = valueRegex.exec(message)) !== null) {
    let amount = null;
    
    if (match[2]) amount = parseFloat(match[2].replace(',', '.'));
    else if (match[3]) amount = parseFloat(match[3].replace(',', '.'));
    else if (match[4]) amount = parseFloat(match[4]);
    else if (match[5] && match[6]) amount = parseFloat(`${match[5]}.${match[6]}`);
    else if (match[7]) amount = parseFloat(match[7]);
    
    if (amount !== null) {
      entities.amounts.push({
        amount,
        matchedText: match[0],
        index: match.index
      });
    }
  }
  
  // Procurar referências a datas
  for (const [dateType, expressions] of Object.entries(dictionary.dateExpressions)) {
    for (const expr of expressions) {
      if (lowerMessage.includes(expr)) {
        entities.dates.push({
          type: dateType,
          matchedExpression: expr,
          confidence: 1.0
        });
        break;
      }
    }
  }
  
  // Extrair período de tempo
  for (const [periodType, expressions] of Object.entries(dictionary.timePeriods)) {
    for (const expr of expressions) {
      if (lowerMessage.includes(expr)) {
        entities.dates.push({
          period: periodType,
          matchedExpression: expr,
          confidence: 0.9
        });
        break;
      }
    }
  }
  
  // Procurar tipos de cartão
  for (const type of dictionary.cards.types) {
    if (lowerMessage.includes(type)) {
      entities.cardTypes.push({
        type,
        confidence: 1.0
      });
    }
  }
  
  // Tentar identificar nome do cartão (palavra após "cartão de" ou "cartão")
  const cardNameRegex = /cart(?:ão|ao)\s+(?:de\s+)?(\w+)/i;
  const cardNameMatch = lowerMessage.match(cardNameRegex);
  if (cardNameMatch) {
    entities.cardNames.push({
      name: cardNameMatch[1],
      confidence: 1.0
    });
  }
  
  return entities;
}

module.exports = {
  analyzeMessage,
  detectIntent,
  detectAmbiguity,
  tokenizeMessage,
  stemWords,
  calculateSimilarity,
  findBestMatch,
  generateConfirmationQuestion,
  isConfirmation,
  isRejection
};