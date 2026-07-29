import { HERO_POTES, HERO_POUCH } from '../assets';
import type { Format } from '../data';
import Icon from './Icon';

export default function Hero({ format, setFormat, explore, decision, concept }: { format: Format; setFormat: (v: Format) => void; explore: () => void; decision: () => void; concept: () => void }) {
  return <section id="inicio" className="fp-hero">
    <div className="fp-grid-noise" />
    <div className="fp-hero-grid">
      <div className="fp-hero-copy">
        <div className="fp-eyebrow"><Icon name="spark" /> Proposta comercial exclusiva</div>
        <h1>FLYPRO<span>Blend Proteico</span></h1>
        <h2>Um novo nível para a marca.</h2>
        <p>A força da FLYPRO encontra a tecnologia industrial da Vita Power para criar um produto com identidade, sabor e presença de mercado.</p>
        <div className="fp-actions">
          <button className="fp-btn fp-btn-primary" onClick={explore}>Explorar o projeto <Icon name="arrow" /></button>
          <button className="fp-btn fp-btn-secondary" onClick={concept}><Icon name="cube" /> Ver conceito completo</button>
        </div>
        <div className="fp-metrics">{[['300','unidades'],['900 g','por produto'],['4','sabores'],['2','modelos comerciais']].map(([a,b])=><div key={b}><strong>{a}</strong><span>{b}</span></div>)}</div>
      </div>
      <div className="fp-hero-visual">
        <div className="fp-orbit" />
        <img src={format === 'pote' ? HERO_POTES : HERO_POUCH} alt={`Mockup conceitual em ${format}`} />
        <div className="fp-format-toggle"><button className={format==='pote'?'active':''} onClick={()=>setFormat('pote')}>Pote</button><button className={format==='pouch'?'active':''} onClick={()=>setFormat('pouch')}>Pouch</button></div>
        <div className="fp-validity"><span>Proposta válida por</span><strong>07 dias</strong><small>corridos</small></div>
      </div>
    </div>
    <div className="fp-benefit-rail">{[['Fórmula','Base técnica consolidada'],['Sensorial','Sabores de alta aceitação'],['Qualidade','Processo industrial controlado'],['Flexibilidade','Pote ou pouch'],['Agilidade','Produção em 10 dias úteis']].map(([a,b])=><div key={a}><Icon name="check"/><span><b>{a}</b>{b}</span></div>)}</div>
    <button className="fp-floating-decision" onClick={decision}>Montar escolha <Icon name="arrow"/></button>
  </section>;
}
