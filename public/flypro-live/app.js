const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const money = (n) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatData = {
  pote: {
    eyebrow: 'FORMATO POTE',
    title: 'Impacto de prateleira e percepção premium.',
    description: 'Uma apresentação robusta, familiar ao consumidor e com grande área visual para fortalecer a marca no ponto de venda.',
    image: 'assets/potes.webp',
    alt: 'Mockup do Blend Proteico FLYPRO em pote',
    benefits: ['Visual mais premium', 'Maior percepção de valor', 'Experiência tradicional', 'Alta proteção do produto']
  },
  pouch: {
    eyebrow: 'FORMATO POUCH',
    title: 'Leveza, eficiência e presença contemporânea.',
    description: 'Uma alternativa prática, versátil e logística, com visual moderno e forte potencial para vendas digitais.',
    image: 'assets/pouches.webp',
    alt: 'Mockup do Blend Proteico FLYPRO em pouch',
    benefits: ['Menor volume logístico', 'Apelo moderno e versátil', 'Fechamento reutilizável', 'Prático para o consumidor']
  }
};

function flavorVisual(name, colors, detail) {
  const [a,b,c] = colors;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'>
  <defs><radialGradient id='g'><stop stop-color='${a}'/><stop offset='.5' stop-color='${b}'/><stop offset='1' stop-color='#050506'/></radialGradient>
  <filter id='blur'><feGaussianBlur stdDeviation='30'/></filter></defs>
  <rect width='1200' height='800' fill='#050506'/><circle cx='600' cy='400' r='520' fill='url(#g)' opacity='.95'/>
  <g opacity='.55' filter='url(#blur)' fill='${c}'><circle cx='250' cy='260' r='110'/><circle cx='910' cy='180' r='140'/><circle cx='760' cy='620' r='170'/></g>
  <path d='M0 610 C180 480 320 720 510 580 S850 420 1200 620 V800 H0Z' fill='${c}' opacity='.55'/>
  <text x='70' y='105' fill='white' font-family='Arial' font-size='38' letter-spacing='10'>FLYPRO NUTRITION</text>
  <text x='70' y='590' fill='white' font-family='Arial Black,Arial' font-size='92' font-weight='900'>${name.toUpperCase()}</text>
  <text x='74' y='650' fill='white' opacity='.78' font-family='Arial' font-size='30'>${detail}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}
const flavorData = [
  { key: 'chocolate', name: 'Chocolate', image: flavorVisual('Chocolate',['#6f250f','#2b0d08','#a53d15'],'Intenso • cremoso • irresistível'), description: 'Intenso, cremoso e familiar — um clássico para abrir a linha com força.', meter: 88 },
  { key: 'baunilha', name: 'Baunilha', image: flavorVisual('Baunilha',['#fff4c4','#c99b4c','#f1d17b'],'Clássico • leve • versátil'), description: 'Clássico, leve e versátil — ideal para quem valoriza suavidade.', meter: 68 },
  { key: 'morango', name: 'Morango', image: flavorVisual('Morango',['#ff4164','#8f0b26','#ff879a'],'Frutado • marcante • refrescante'), description: 'Frutado, marcante e refrescante — uma opção que se destaca na linha.', meter: 77 },
  { key: 'cookies', name: 'Cookies & Cream', image: flavorVisual('Cookies & Cream',['#dfe4ea','#333b48','#f4f4f4'],'Envolvente • indulgente • memorável'), description: 'Envolvente e indulgente — pensado para criar desejo e recorrência.', meter: 92 }
];

const modelData = {
  1: {
    tag: 'MAIS PRATICIDADE', name: 'PRODUTO COMPLETO VITA POWER', price: '90,00', unit: 'por unidade de 900 g', total: 'R$ 27.000,00',
    headline: 'Nós cuidamos de toda a cadeia produtiva.',
    description: 'A Vita Power compra e administra os insumos, produz, envasa, finaliza e entrega o produto pronto para retirada.',
    vita: ['Fórmula e base técnica', 'Base sensorial, aromas e edulcorantes', 'Compra e gestão das matérias-primas', 'Mistura e fabricação', 'Controle de qualidade', 'Envase de 900 g e scoop', 'Lacre, selagem e aplicação do rótulo', 'Codificação, caixas e expedição'],
    fly: ['Desenvolvimento da arte conforme dizeres e claims validados', 'Compra dos rótulos, quando utilizado pote', 'Compra do pouch, quando esse formato for escolhido', 'Frete para coleta dos produtos finalizados']
  },
  2: {
    tag: 'MAIS FLEXIBILIDADE', name: 'INDUSTRIALIZAÇÃO + BASE SENSORIAL', price: '20,00', unit: 'por produto finalizado', total: 'R$ 6.000,00',
    headline: 'A FLYPRO compra os principais insumos. Nós industrializamos.',
    description: 'A Vita Power entrega tecnologia sensorial, estrutura fabril, controle de qualidade, envase e acabamento do produto.',
    vita: ['Uso da fórmula e base técnica', 'Base sensorial, aromas e edulcorantes', 'Homologação e conferência dos insumos', 'Mistura e fabricação', 'Controle de qualidade', 'Envase de 900 g e scoop', 'Aplicação de lacre, rótulo e codificação', 'Caixas e expedição'],
    fly: ['Compra de WPC e colágeno', 'Potes e tampas ou pouches', 'Rótulos impressos', 'Frete dos insumos até a Vita Power', 'Documentação técnica dos insumos', 'Frete para coleta dos produtos finalizados', 'Excedente de 4% dos materiais e insumos']
  }
};

function setList(el, items) { el.innerHTML = items.map((x) => `<li>${x}</li>`).join(''); }

function selectFormat(key) {
  const data = formatData[key];
  $$('.format-switch button').forEach((b) => { const active = b.dataset.format === key; b.classList.toggle('active', active); b.setAttribute('aria-selected', String(active)); });
  $('#formatEyebrow').textContent = data.eyebrow;
  $('#formatTitle').textContent = data.title;
  $('#formatDescription').textContent = data.description;
  setList($('#formatBenefits'), data.benefits);
  const img = $('#formatImage');
  img.style.opacity = 0;
  img.style.transform = 'scale(.97)';
  setTimeout(() => { img.src = data.image; img.alt = data.alt; img.style.opacity = 1; img.style.transform = 'scale(1)'; }, 170);
  const radio = $(`input[name="decisionFormat"][value^="${key === 'pote' ? 'Pote' : 'Pouch'}"]`);
  if (radio) radio.checked = true;
}

let activeFlavor = 0;
function selectFlavor(index) {
  activeFlavor = (index + flavorData.length) % flavorData.length;
  const data = flavorData[activeFlavor];
  $$('.flavor-tab').forEach((b) => b.classList.toggle('active', b.dataset.flavor === data.key));
  const img = $('#flavorImage'); img.style.opacity = 0;
  setTimeout(() => { img.src = data.image; img.alt = `Sabor ${data.name}`; img.style.opacity = 1; }, 160);
  $('#flavorNumber').textContent = `${String(activeFlavor + 1).padStart(2, '0')} / 04`;
  $('#flavorTitle').textContent = data.name;
  $('#flavorDescription').textContent = data.description;
  $('#tasteMeter').style.width = `${data.meter}%`;
}

function selectModel(key) {
  const data = modelData[key];
  $$('.model-tabs button').forEach((b) => { const active = b.dataset.model === String(key); b.classList.toggle('active', active); b.setAttribute('aria-selected', String(active)); });
  $('#modelTag').textContent = data.tag;
  $('#modelName').textContent = data.name;
  $('#modelPrice').textContent = data.price;
  $('#modelUnit').textContent = data.unit;
  $('#modelTotal').textContent = data.total;
  $('#modelHeadline').textContent = data.headline;
  $('#modelDescription').textContent = data.description;
  setList($('#vitaResponsibilities'), data.vita);
  setList($('#flyResponsibilities'), data.fly);
  const radio = $(`input[name="decisionModel"][value^="Modelo ${key}"]`);
  if (radio) radio.checked = true;
}

const distribution = { Chocolate: 75, Baunilha: 75, Morango: 75, 'Cookies & Cream': 75 };
function renderSimulator() {
  const root = $('#simulatorList');
  root.innerHTML = Object.entries(distribution).map(([name, value]) => `
    <div class="sim-row"><label>${name}</label><input type="range" min="0" max="300" step="5" value="${value}" data-sim="${name}"><span class="sim-value">${value}</span></div>`).join('');
  $$('[data-sim]', root).forEach((input) => input.addEventListener('input', (e) => {
    distribution[e.target.dataset.sim] = Number(e.target.value);
    e.target.nextElementSibling.textContent = e.target.value;
    updateTotal();
  }));
  updateTotal();
}
function updateTotal() {
  const total = Object.values(distribution).reduce((a,b) => a+b, 0);
  $('#simTotal').textContent = total;
  const pct = Math.min(100, (total/300)*100);
  $('#totalRing').style.background = `conic-gradient(${total === 300 ? '#e00012' : '#ff9a24'} ${pct}%, #24272d 0)`;
  $('#simMessage').textContent = total === 300 ? 'Distribuição completa.' : total < 300 ? `Faltam ${300-total} unidades.` : `Excedeu em ${total-300} unidades.`;
}

function openDrawer() { $('#decisionBackdrop').hidden = false; requestAnimationFrame(() => $('#decisionDrawer').classList.add('open')); $('#decisionDrawer').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeDrawer() { $('#decisionDrawer').classList.remove('open'); $('#decisionDrawer').setAttribute('aria-hidden','true'); setTimeout(() => { $('#decisionBackdrop').hidden = true; document.body.style.overflow=''; }, 320); }
function toast(message) { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove('show'),2200); }
function generateSummary() {
  const model = $('input[name="decisionModel"]:checked').value;
  const format = $('input[name="decisionFormat"]:checked').value;
  const notes = $('#decisionNotes').value.trim() || 'Sem observações adicionais.';
  const chosen = model.startsWith('Modelo 1') ? modelData[1] : modelData[2];
  const split = Object.entries(distribution).map(([k,v]) => `${k}: ${v}`).join(' | ');
  const text = [
    'MANIFESTAÇÃO DE INTERESSE — PROPOSTA FLYPRO', '',
    `Modelo preferido: ${model}`, `Formato preferido: ${format}`,
    `Investimento de referência: R$ ${chosen.price} ${chosen.unit}`, `Total de referência: ${chosen.total}`,
    `Distribuição simulada: ${split}`, '',
    `Observações: ${notes}`, '',
    'Condições consideradas:', '- 300 unidades de 900 g', '- 50% na aprovação e 50% antes da expedição', '- Produção em 10 dias úteis após os requisitos de início', '- Fretes por conta da FLYPRO', '- Proposta válida por 7 dias corridos', '',
    'Esta manifestação registra interesse inicial e está sujeita à validação comercial, técnica, regulatória e contratual.'
  ].join('\n');
  $('#summaryText').value = text; $('#summaryBox').hidden = false;
  const subject = encodeURIComponent('FLYPRO — Preferência da proposta comercial');
  const body = encodeURIComponent(text);
  $('#emailSummary').href = `mailto:andrew@vitapowernutrition.com.br?cc=vitoria@vitapowernutrition.com.br&subject=${subject}&body=${body}`;
  $('#summaryBox').scrollIntoView({behavior:'smooth',block:'nearest'});
}

$$('.format-switch button').forEach((b) => b.addEventListener('click', () => selectFormat(b.dataset.format)));
$$('.flavor-tab').forEach((b) => b.addEventListener('click', () => selectFlavor(flavorData.findIndex((x) => x.key === b.dataset.flavor))));
$('#nextFlavor').addEventListener('click', () => selectFlavor(activeFlavor + 1));
$$('.model-tabs button').forEach((b) => b.addEventListener('click', () => selectModel(b.dataset.model)));
$$('[data-open-decision]').forEach((b) => b.addEventListener('click', openDrawer));
$('#drawerClose').addEventListener('click', closeDrawer); $('#decisionBackdrop').addEventListener('click', closeDrawer);
$('#generateSummary').addEventListener('click', generateSummary);
$('#printBtn').addEventListener('click', () => window.print());
$('#fullscreenBtn').addEventListener('click', async () => { try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); } catch { toast('Modo apresentação não disponível neste navegador.'); } });
$('#equalizeBtn').addEventListener('click', () => { Object.keys(distribution).forEach(k => distribution[k]=75); renderSimulator(); toast('Distribuição igual aplicada.'); });
$('#copyLink').addEventListener('click', async () => { try { await navigator.clipboard.writeText(location.href); toast('Link copiado.'); } catch { toast('Copie o endereço na barra do navegador.'); } });
$('#copySummary').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#summaryText').value); toast('Resumo copiado.'); } catch { $('#summaryText').select(); document.execCommand('copy'); toast('Resumo copiado.'); } });
$('#downloadSummary').addEventListener('click', () => { const blob=new Blob([$('#summaryText').value],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='preferencia-proposta-flypro.txt'; a.click(); URL.revokeObjectURL(a.href); });

document.addEventListener('keydown', (e) => { if(e.key==='Escape' && $('#decisionDrawer').classList.contains('open')) closeDrawer(); });

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if(entry.isIntersecting) entry.target.classList.add('visible'); }), {threshold:.12});
$$('.reveal').forEach((el) => observer.observe(el));

const sections = $$('section[id]');
const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if(entry.isIntersecting) { $$('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`)); } }), {rootMargin:'-25% 0px -65% 0px'});
sections.forEach((s)=>navObserver.observe(s));

window.addEventListener('scroll', () => { const max=document.documentElement.scrollHeight-innerHeight; $('#scrollProgress').style.width=`${max>0?(scrollY/max)*100:0}%`; }, {passive:true});

selectFormat('pote'); selectFlavor(0); selectModel(1); renderSimulator();
