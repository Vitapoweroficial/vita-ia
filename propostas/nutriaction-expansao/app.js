const BRL=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const state={
 crea:{model:'full',active:true,prices:{envase:7,full:29},labels:{envase:'Somente envase',full:'Modelo Full'}},
 blend:{model:'hybrid',active:true,prices:{hybrid:80.5,full:95},labels:{hybrid:'Modelo Híbrido',full:'Modelo Full'}}
};
const scopes={
 crea:{
  envase:{title:'Escopo — Somente envase',badge:'Operação industrial',items:['Recebimento dos itens definidos na ordem','Conferência operacional de entrada','Envase em apresentação de 300 g','Acabamento e liberação conforme escopo']},
  full:{title:'Escopo — Modelo Full',badge:'Fornecimento centralizado',items:['Matéria-prima conforme especificação aprovada','Industrialização e envase','Embalagem e acabamento conforme alinhamento','Produto finalizado sob escopo Vita Power']}
 },
 blend:{
  hybrid:{title:'Escopo — Modelo Híbrido',badge:'Melhor equilíbrio de custo',items:['Nutriaction adquire diretamente o colágeno','Vita Power fornece os demais componentes','Industrialização e envase de 900 g','Investimento estimado final de R$ 80,50/un.']},
  full:{title:'Escopo — Modelo Full',badge:'Máxima conveniência',items:['Fornecimento integral dos componentes','Gestão centralizada da matéria-prima','Industrialização e envase de 900 g','Produto completo por R$ 95,00/un.']}
 }
};
function renderScope(product){const s=scopes[product][state[product].model];document.getElementById(product+'-scope').innerHTML=`<div class="scope-head"><b>${s.title}</b><span>${s.badge}</span></div><ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul>`}
function selectModel(product,model){state[product].model=model;document.querySelectorAll(`[data-product="${product}"]`).forEach(el=>el.classList.toggle('active',el.dataset.model===model));renderScope(product);recalc()}
function stepQty(product,delta){const input=document.getElementById(product+'Qty');input.value=Math.max(0,(Number(input.value)||0)+delta);recalc()}
function toggleProduct(product){state[product].active=!state[product].active;document.getElementById(product+'Toggle').classList.toggle('on',state[product].active);recalc()}
function qty(product){return Math.max(0,Number(document.getElementById(product+'Qty').value)||0)}
function productTotal(product){return state[product].prices[state[product].model]*qty(product)}
function recalc(){
 ['crea','blend'].forEach(p=>{const price=state[p].prices[state[p].model],q=qty(p),total=price*q;document.getElementById(p+'Total').textContent=BRL.format(total);document.getElementById(p+'Formula').textContent=`${q} × ${BRL.format(price)}`;document.getElementById(p+'SelTotal').textContent=BRL.format(total);document.getElementById(p+'SelModel').textContent=`${state[p].labels[state[p].model]} · ${q} unidades`;});
 const active=['crea','blend'].filter(p=>state[p].active);const total=active.reduce((s,p)=>s+productTotal(p),0);const units=active.reduce((s,p)=>s+qty(p),0);const activeText=`${active.length} ${active.length===1?'produto':'produtos'}`;
 document.getElementById('grandTotal').innerHTML=`${BRL.format(total)}<small>cenário editável</small>`;document.getElementById('activeCount').textContent=activeText;document.getElementById('unitCount').textContent=`${units} unidades`;document.getElementById('sumCreaModel').textContent=state.crea.active?state.crea.labels[state.crea.model]:'Não incluída';document.getElementById('sumBlendModel').textContent=state.blend.active?state.blend.labels[state.blend.model]:'Não incluído';document.getElementById('dockTotal').textContent=BRL.format(total);document.getElementById('dockActive').textContent=activeText;
}
function summaryText(){const lines=['PROPOSTA COMERCIAL — EXPANSÃO NUTRIACTION',''];if(state.crea.active){lines.push(`CREATINA 300 G — ${state.crea.labels[state.crea.model]}`,`Quantidade simulada: ${qty('crea')} unidades`,`Valor unitário: ${BRL.format(state.crea.prices[state.crea.model])}`,`Subtotal: ${BRL.format(productTotal('crea'))}`,'')}if(state.blend.active){lines.push(`BLEND PROTEIN 900 G — ${state.blend.labels[state.blend.model]}`,`Quantidade simulada: ${qty('blend')} unidades`,`Valor unitário estimado: ${BRL.format(state.blend.prices[state.blend.model])}`,`Subtotal: ${BRL.format(productTotal('blend'))}`,'');if(state.blend.model==='hybrid')lines.push('Observação: no híbrido, R$ 25,50/un. correspondem ao colágeno adquirido diretamente pela Nutriaction.','')}const active=['crea','blend'].filter(p=>state[p].active);const total=active.reduce((s,p)=>s+productTotal(p),0);lines.push(`INVESTIMENTO TOTAL SIMULADO: ${BRL.format(total)}`,'','Quantidades, pagamento, prazos e escopo final serão formalizados na confirmação do pedido.');return lines.join('\n')}
async function copySummary(){const text=summaryText();try{await navigator.clipboard.writeText(text);toast('Cenário copiado!')}catch(e){const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();toast('Cenário copiado!')}}
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),2300)}
const reveal=()=>document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight-75)el.classList.add('show')});addEventListener('scroll',()=>{reveal();const h=document.documentElement.scrollHeight-innerHeight;document.getElementById('progress').style.width=(scrollY/h*100)+'%'});reveal();renderScope('crea');renderScope('blend');recalc();