'use client';

import { useEffect, useState } from 'react';
import { FLYPRO_LOGO, HERO_POTES, HERO_POUCH, VITA_LOGO } from './assets';
import { MODELS, currency, type FlavorKey, type Format, type ModelKey } from './data';
import Hero from './components/Hero';
import ProductExperience from './components/ProductExperience';
import CommercialModels from './components/CommercialModels';
import Operations from './components/Operations';
import DecisionDrawer from './components/DecisionDrawer';
import Icon from './components/Icon';

export default function FlyproProposal() {
  const [intro,setIntro]=useState(true); const [menu,setMenu]=useState(false);
  const [format,setFormat]=useState<Format>('pote'); const [model,setModel]=useState<ModelKey>(1);
  const [flavor,setFlavor]=useState<FlavorKey>('Chocolate'); const [faq,setFaq]=useState<number|null>(null);
  const [drawer,setDrawer]=useState(false); const [concept,setConcept]=useState(false); const [toast,setToast]=useState('');
  const [allocation,setAllocation]=useState<Record<FlavorKey,number>>({Chocolate:75,Baunilha:75,Morango:75,'Cookies & Cream':75});
  useEffect(()=>{const t=setTimeout(()=>setIntro(false),1700);return()=>clearTimeout(t)},[]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2500);return()=>clearTimeout(t)},[toast]);
  const go=(id:string)=>{setMenu(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})};
  const summary=()=>{const selected=MODELS[model];const total=Object.values(allocation).reduce((a,b)=>a+b,0);return ['PROPOSTA FLYPRO — RESUMO DE PREFERÊNCIA','',`Modelo: ${selected.title}`,`Formato: ${format==='pote'?'Pote 900 g':'Pouch 900 g'}`,`Investimento unitário: ${currency(selected.unit)}`,`Investimento total: ${currency(selected.total)}`,'','Distribuição simulada:',...Object.entries(allocation).map(([k,v])=>`- ${k}: ${v} unidades`),`Total: ${total} unidades`,'','Condições:','- 50% na aprovação e 50% antes da expedição','- Produção em 10 dias úteis após materiais, aprovação técnica e pagamento','- Validade comercial: 7 dias corridos','- Fretes por conta da FLYPRO','','Mockups conceituais sujeitos à validação técnica, regulatória e gráfica.'].join('\n')};
  const copy=async()=>{await navigator.clipboard.writeText(summary());setToast('Resumo copiado. Pronto para compartilhar.')};
  const download=()=>{const blob=new Blob([summary()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='preferencia-proposta-flypro.txt';a.click();URL.revokeObjectURL(url);setToast('Resumo baixado com sucesso.')};
  const email=()=>{location.href=`mailto:andrew@vitapowernutrition.com.br?cc=vitoria@vitapowernutrition.com.br&subject=${encodeURIComponent('Aprovação da proposta FLYPRO')}&body=${encodeURIComponent(summary())}`};
  return <div className="fp-site">
    {intro&&<div className="fp-intro"><div/><section><img src={FLYPRO_LOGO} alt="FLYPRO"/><span>×</span><img src={VITA_LOGO} alt="Vita Power"/></section><i/><p>Construindo o próximo grande lançamento.</p></div>}
    <header className="fp-header"><div><button className="fp-brand" onClick={()=>go('inicio')}><img src={FLYPRO_LOGO} alt="FLYPRO Nutrition"/></button><nav className={menu?'open':''}>{[['inicio','Início'],['produto','Produto'],['mockups','Mockups'],['modelos','Modelos'],['processo','Processo'],['condicoes','Condições'],['proximos','Próximos passos']].map(([id,label])=><button key={id} onClick={()=>go(id)}>{label}</button>)}</nav><aside><button className="fp-pdf" onClick={()=>window.print()}><Icon name="download"/> PDF</button><button className="fp-btn fp-btn-primary" onClick={()=>setDrawer(true)}>Vamos juntos <Icon name="arrow"/></button><button className="fp-menu" onClick={()=>setMenu(!menu)}><Icon name={menu?'close':'menu'}/></button></aside></div></header>
    <main>
      <Hero format={format} setFormat={setFormat} explore={()=>go('produto')} decision={()=>setDrawer(true)} concept={()=>setConcept(true)}/>
      <ProductExperience format={format} setFormat={setFormat} flavor={flavor} setFlavor={setFlavor} concept={()=>setConcept(true)}/>
      <CommercialModels model={model} setModel={setModel} decision={()=>setDrawer(true)}/>
      <Operations allocation={allocation} setAllocation={setAllocation} faq={faq} setFaq={setFaq}/>
      <section className="fp-finale"><div/><section><div><img src={FLYPRO_LOGO} alt="FLYPRO"/><span>×</span><img src={VITA_LOGO} alt="Vita Power"/></div><h2>Vamos construir juntos o próximo grande lançamento da FLYPRO.</h2><p>Performance. Identidade. Qualidade. Resultado.</p><aside><button className="fp-btn fp-btn-primary" onClick={()=>setDrawer(true)}>Montar minha escolha <Icon name="arrow"/></button><button className="fp-btn fp-btn-secondary" onClick={email}><Icon name="mail"/> Falar com a Vita Power</button></aside></section></section>
    </main>
    <footer className="fp-footer"><div><img src={FLYPRO_LOGO} alt="FLYPRO"/><span>Proposta comercial exclusiva</span></div><div><img src={VITA_LOGO} alt="Vita Power"/><span>Ciência · Qualidade · Confiança</span></div><p>Mockups conceituais sujeitos à aprovação técnica, regulatória e gráfica.</p></footer>
    <DecisionDrawer open={drawer} close={()=>setDrawer(false)} model={model} setModel={setModel} format={format} setFormat={setFormat} allocation={allocation} copy={copy} download={download}/>
    {concept&&<div className="fp-concept" onClick={()=>setConcept(false)}><div onClick={e=>e.stopPropagation()}><button onClick={()=>setConcept(false)}><Icon name="close"/></button><img src={HERO_POTES} alt="Mockups em pote"/><img src={HERO_POUCH} alt="Mockups em pouch"/><section><b>Conceito visual exclusivo</b><p>Nome, alegações, informações nutricionais e dizeres legais serão validados antes da arte final.</p></section></div></div>}
    {toast&&<div className="fp-toast">{toast}</div>}
  </div>;
}
