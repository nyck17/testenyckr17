// Categorias e subcategorias para classificação de gastos
const CATEGORIES = {
    'alimentação': ['supermercado', 'padaria', 'restaurante', 'lanches', 'doces'],
    'transporte': ['combustível', 'transporte público', 'táxi', 'uber', 'manutenção'],
    'moradia': ['aluguel', 'energia', 'água', 'internet', 'condomínio'],
    'saúde': ['consultas', 'farmácia', 'plano de saúde', 'academia'],
    'entretenimento & lazer': ['assinaturas', 'viagens', 'cinema', 'games'],
    'educação': ['cursos', 'livros', 'faculdade'],
    'finanças & investimentos': ['empréstimos', 'poupança', 'taxas'],
    'compras & diversos': ['eletrônicos', 'roupas', 'presentes', 'beleza']
  };
  
  // Chaves de ativação
  const ADMIN_KEY = "Nycollasr17*";
  
  module.exports = {
    CATEGORIES,
    ADMIN_KEY
  };