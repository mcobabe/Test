'use client';

import { useMemo, useState } from 'react';

type Candidate={id:string;trade:string;level:string;days:number;years:number;region:string;price:number;skills:string[]};
const candidates:Candidate[]=[
{id:'P-18427',trade:'Plumbing',level:'Journeyman / Certified',days:8,years:9,region:'Sacramento',price:100,skills:['Cast Iron','Copper Water','Medical Gas','ABS Waste']},
{id:'P-18291',trade:'Electrical',level:'Journeyman / Certified',days:4,years:7,region:'Roseville',price:100,skills:['Commercial','OSHA 30']},
{id:'P-17381',trade:'Plumbing',level:'Foreman',days:12,years:14,region:'Sacramento',price:250,skills:['Public Works','Underground','Cast Iron']},
{id:'P-17104',trade:'HVAC',level:'Apprentice',days:2,years:3,region:'Folsom',price:100,skills:['Commercial HVAC']},
{id:'P-16840',trade:'Plumbing',level:'Superintendent',days:17,years:19,region:'El Dorado Hills',price:250,skills:['Commercial','Public Works','Leadership']}
];

export default function WorkerSearch(){
 const [trade,setTrade]=useState('All'); const [level,setLevel]=useState('All');
 const results=useMemo(()=>candidates.filter(c=>(trade==='All'||c.trade===trade)&&(level==='All'||c.level===level)),[trade,level]);
 return <main className="shell"><header className="topbar"><div className="brand">ABC NORCAL<span>AVAILABLE WORKFORCE</span></div><nav className="nav"><a href="/">Home</a><a href="/member">Contractor Dashboard</a></nav></header><div className="wrap"><h1>Search Available Workers</h1><p className="muted">Identity and direct contact information remain protected until a paid contact release.</p><div className="card"><div className="grid grid2"><label>Trade<select value={trade} onChange={e=>setTrade(e.target.value)} style={{display:'block',width:'100%',padding:10,marginTop:6}}><option>All</option><option>Plumbing</option><option>Electrical</option><option>HVAC</option></select></label><label>Level<select value={level} onChange={e=>setLevel(e.target.value)} style={{display:'block',width:'100%',padding:10,marginTop:6}}><option>All</option><option>Apprentice</option><option>Journeyman / Certified</option><option>Foreman</option><option>Superintendent</option></select></label></div></div><section className="section"><h2>{results.length} Matching Candidates</h2>{results.map(c=><div className="card" key={c.id} style={{marginBottom:12}}><div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}><div><h3>Candidate #{c.id} — {c.trade}</h3><p style={{color:'#18794e',fontWeight:800}}>AVAILABLE — {c.days} DAYS</p><p>{c.level} · {c.years} years construction experience · {c.region}</p><p>{c.skills.map(s=><span className="pill" key={s}>{s}</span>)}</p><p className="muted">Name 🔒 · Phone 🔒 · Email 🔒</p></div><div><div className="stat" style={{fontSize:24}}>${c.price}</div><p className="muted">72-hour contact unlock</p><button className="button">View Full Anonymous Profile</button></div></div></div>)}</section></div></main>
}
