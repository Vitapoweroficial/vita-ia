import { MODELS, currency, type ModelKey } from '../data';
import Icon from './Icon';

export default function CommercialModels({ model, setModel, decision }: { model: ModelKey; setModel: (v: ModelKey)=>void; decision: ()=>void }) {
  const selected = MODELS[model];
  const rows = [['WPC e colágeno','Vita Power','FLYPRO'],['Base sensorial','Vita Power','Vita Power'],['Fórmula e conhecimento técnico','Vita Power','Vita Power'],['Pote/tampa ou pouch','FLYPRO','FLYPRO'],['Rótulos','FLYPRO','FLYPRO'],['Produção, envase e acabamento','Vita Power','Vita Power'],['Scoop, caixas e fita','Vita Power','Vita Power'],['Fretes','FLYPRO','FLYPRO']];
  return <section id="modelos" className="fp-section">
    <div className="fp-section-head"><div><span>03 · Modelos comerciais</span><h2>Dois caminhos. O mesmo padrão de execução.</h2></div><p>A FLYPRO escolhe entre máxima praticidade e maior participação na aquisição dos insumos.</p></div>
    <div className="fp-model-tabs">{([1,2] as ModelKey[]).map(k=><button key={k} className={model===k?'active':''} onClick={()=>setModel(k)}><span>{MODELS[k].eyebrow}</span><strong>{MODELS[k].title}</strong></button>)}</div>
    <div className="fp-model-panel">
      <div className="fp-price"><span>{selected.eyebrow}</span><h3>{selected.title}</h3><p>{selected.subtitle}</p><div className="fp-unit"><small>Investimento por produto</small><strong>{currency(selected.unit)}</strong><i>unidade de 900 g</i></div><div className="fp-total"><span>Total para 300 unidades</span><strong>{currency(selected.total)}</strong></div><p>{selected.note}</p><button className="fp-btn fp-btn-primary" onClick={decision}>Selecionar este modelo <Icon name="arrow"/></button></div>
      <div className="fp-responsibilities"><div><em>A Vita Power entrega</em>{selected.vita.map(x=><p key={x}><Icon name="check"/>{x}</p>)}</div><div><em>A FLYPRO fornece ou executa</em>{selected.client.map(x=><p key={x}><Icon name="arrow"/>{x}</p>)}</div></div>
    </div>
    <div className="fp-comparison"><header><h3>Comparativo objetivo</h3><p>O Modelo 2 não inclui os principais insumos fornecidos pela FLYPRO.</p></header><div><table><thead><tr><th>Elemento</th><th>Modelo 1</th><th>Modelo 2</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}><td>{r[0]}</td><td><span className={r[1]==='Vita Power'?'vita':'client'}>{r[1]}</span></td><td><span className={r[2]==='Vita Power'?'vita':'client'}>{r[2]}</span></td></tr>)}</tbody></table></div></div>
  </section>;
}
