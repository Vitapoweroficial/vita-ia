import { HERO_POTES } from './assets';

export type Format = 'pote' | 'pouch';
export type ModelKey = 1 | 2;
export type FlavorKey = 'Chocolate' | 'Baunilha' | 'Morango' | 'Cookies & Cream';

export const FLAVORS: Array<{ key: FlavorKey; image: string; position: string; text: string; accent: string }> = [
  { key: 'Chocolate', image: HERO_POTES, position: '27% center', text: 'Intenso, cremoso e de alta aceitação.', accent: '#7c2d12' },
  { key: 'Baunilha', image: HERO_POTES, position: '47% center', text: 'Clássico, leve e versátil para o dia a dia.', accent: '#d6b774' },
  { key: 'Morango', image: HERO_POTES, position: '69% center', text: 'Frutado, equilibrado e refrescante.', accent: '#f05274' },
  { key: 'Cookies & Cream', image: HERO_POTES, position: '91% center', text: 'Marcante, indulgente e contemporâneo.', accent: '#7084a5' },
];

export const MODELS = {
  1: {
    eyebrow: 'Modelo 1 · Mais praticidade', title: 'Produto completo Vita Power',
    subtitle: 'A Vita Power assume a cadeia produtiva e entrega o produto pronto para a FLYPRO comercializar.',
    unit: 90, total: 27000,
    note: 'Matérias-primas, tecnologia sensorial e industrialização sob gestão da Vita Power.',
    vita: ['Fórmula e base técnica','Base sensorial, aromas e edulcorantes','Compra e gestão das matérias-primas','Mistura, fabricação e controle de qualidade','Envase de 900 g com scoop','Lacre, selagem e aplicação do rótulo','Codificação de lote e validade','Caixas, fita e preparação para expedição'],
    client: ['Desenvolvimento da arte conforme dizeres e alegações aprovados','Potes e tampas ou pouch','Rótulos impressos, quando aplicável','Frete de coleta dos produtos prontos'],
  },
  2: {
    eyebrow: 'Modelo 2 · Mais flexibilidade', title: 'Industrialização + base sensorial',
    subtitle: 'A FLYPRO adquire os insumos principais e a Vita Power transforma tecnologia e processo em produto finalizado.',
    unit: 20, total: 6000,
    note: 'O investimento representa o conjunto completo de serviços Vita Power por produto finalizado.',
    vita: ['Uso da fórmula e base técnica Vita Power','Base sensorial, aromas e edulcorantes','Indicação de fornecedores homologados','Homologação e conferência dos insumos','Mistura, fabricação e controle de qualidade','Envase de 900 g com scoop','Lacre, rótulo, lote e validade','Caixas e preparação para expedição'],
    client: ['WPC e colágeno','Potes e tampas ou pouch','Rótulos impressos','Frete dos insumos até a Vita Power','Frete de coleta dos produtos prontos','4% de excedente dos materiais sob sua responsabilidade'],
  },
} as const;

export const PROCESS = [
  ['01','Aprovação comercial','Escolha do modelo, aceite das condições e confirmação do pedido.'],
  ['02','Formato e sabores','Definição de pote ou pouch e distribuição das 300 unidades.'],
  ['03','Materiais e arte','Recebimento dos componentes, documentos e arte para conferência.'],
  ['04','Produção','Pesagem, mistura e fabricação sob processo controlado.'],
  ['05','Envase e acabamento','Envase de 900 g, scoop, lacre, rótulo, lote e validade.'],
  ['06','Qualidade e expedição','Liberação do lote, caixas e disponibilização para retirada.'],
];

export const FAQ = [
  ['O valor de R$ 20,00 inclui WPC e colágeno?','Não. No Modelo 2, WPC e colágeno são fornecidos pela FLYPRO. Os R$ 20,00 correspondem ao conjunto de serviços, tecnologia sensorial, fabricação, envase e acabamento por produto finalizado.'],
  ['A FLYPRO receberá a fórmula completa?','A formulação-base, as proporções, o sistema sensorial e o know-how permanecem como propriedade intelectual da Vita Power, sem cessão integral da composição.'],
  ['Podemos comprar de outros fornecedores?','Sim, desde que o fornecedor e os insumos sejam homologados previamente, com apresentação de COA, ficha técnica, especificações e demais documentos solicitados.'],
  ['Os mockups já são a arte final?','Não. Eles materializam a visão comercial. A arte definitiva, as informações nutricionais, as alegações e os dizeres legais serão aprovados antes da impressão.'],
  ['Quando começa o prazo de 10 dias úteis?','Após o recebimento integral dos materiais aplicáveis, aprovação técnica, aprovação da arte e confirmação do pagamento previsto.'],
];

export function currency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
