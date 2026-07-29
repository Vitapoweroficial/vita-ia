import type { CSSProperties } from 'react';
import { HERO_POTES, HERO_POUCH } from '../assets';
import { FLAVORS, type FlavorKey, type Format } from '../data';
import Icon from './Icon';

export default function ProductExperience({ format, setFormat, flavor, setFlavor, concept }: { format: Format; setFormat: (v: Format)=>void; flavor: FlavorKey; setFlavor: (v: FlavorKey)=>void; concept: ()=>void }) {
  return <>
    <section id="produto" className="fp-section">
      <div className="fp-section-head"><div><span>01 · O produto</span><h2>Performance com sabor que se percebe.</h2></div><p>Um blend de WPC e colágeno com base sensorial Vita Power, pensado para ampliar o portfólio FLYPRO com um produto competitivo e marcante.</p></div>
      <div className="fp-story-grid">
        <article className="fp-story"><em>Visão de lançamento</em><h3>Mais do que um suplemento: uma nova experiência de marca.</h3><p>O conceito une linguagem esportiva, embalagem de alto impacto e uma proposta sensorial conectada ao posicionamento FLYPRO.</p><ul>{['WPC + colágeno','900 g por unidade','Quatro perfis de sabor','Dois formatos de embalagem'].map(x=><li key={x}><Icon name="check"/>{x}</li>)}</ul></article>
        <div className="fp-pillars">{[['Tecnologia sensorial','Equilíbrio, textura e aceitação.'],['Estrutura industrial','Processo, qualidade e rastreabilidade.'],['Identidade FLYPRO','Força, performance e evolução.'],['Parceria estratégica','Do conceito ao produto pronto.']].map(([a,b],i)=><article key={a}><span>0{i+1}</span><h3>{a}</h3><p>{b}</p></article>)}</div>
      </div>
    </section>
    <section id="mockups" className="fp-section fp-dark">
      <div className="fp-section-head"><div><span>02 · Mockups conceituais</span><h2>O produto já pode ser imaginado na prateleira.</h2></div><p>Os mockups usam a identidade FLYPRO e materializam o lançamento antes da arte regulatória definitiva.</p></div>
      <div className="fp-mockup-stage">
        <div className="fp-mockup-copy"><span>{format==='pote'?'Presença premium':'Leveza e eficiência'}</span><h3>{format==='pote'?'Pote 900 g':'Pouch 900 g'}</h3><p>{format==='pote'?'Maior percepção de valor, proteção e experiência tradicional no ponto de venda.':'Formato moderno, menor custo logístico e forte apelo de praticidade.'}</p>{(format==='pote'?['Visual robusto','Alta proteção','Experiência premium','Presença na prateleira']:['Mais leve','Menor volume logístico','Fechamento zip','Apelo contemporâneo']).map(x=><i key={x}><Icon name="check"/>{x}</i>)}</div>
        <div className="fp-mockup-image"><img src={format==='pote'?HERO_POTES:HERO_POUCH} alt={`Linha conceitual em ${format}`}/><button onClick={concept}>Ampliar conceito <Icon name="arrow"/></button></div>
        <div className="fp-format-selector"><button className={format==='pote'?'active':''} onClick={()=>setFormat('pote')}><b>Pote</b><small>900 g</small></button><button className={format==='pouch'?'active':''} onClick={()=>setFormat('pouch')}><b>Pouch</b><small>900 g</small></button></div>
      </div>
      <div className="fp-flavor-title"><div><span>Universo sensorial</span><h3>Quatro portas de entrada para a marca.</h3></div><p>Selecione um sabor para explorar a atmosfera visual de cada versão.</p></div>
      <div className="fp-flavors">{FLAVORS.map(item=><button key={item.key} className={flavor===item.key?'active':''} onClick={()=>setFlavor(item.key)} style={{'--accent':item.accent} as CSSProperties}><img src={item.image} alt={item.key} style={{objectPosition:item.position}}/><div><b>{item.key}</b><span>{item.text}</span></div></button>)}</div>
    </section>
  </>;
}
