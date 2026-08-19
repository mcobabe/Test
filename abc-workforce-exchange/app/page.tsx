const journeyman = [
  ['Electricians',147,38],['Plumbers',62,20],['HVAC Technicians',34,15],['Operators',18,5],['Superintendents',27,10]
];
const apprentices = [
  ['Electricians',104,29],['Plumbers',62,20],['HVAC Technicians',34,15],['Operators',18,5]
];

function WorkforceTable({title,rows}:{title:string;rows:(string|number)[][]}){
  return <div className="card"><h3>{title}</h3><table><thead><tr><th>Trade</th><th>Total Profiles</th><th>Available Now</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td><strong>{r[2]}</strong></td></tr>)}</tbody></table></div>
}

export default function Home(){
  return <main className="shell">
    <header className="topbar"><div className="brand">ABC NORCAL<span>WORKFORCE EXCHANGE</span></div><nav className="nav"><a href="#workforce">Workforce</a><a href="#pricing">Pricing</a><a href="#how">How It Works</a><a href="/candidate">Candidate Portal</a><a href="/member">Member Portal</a></nav></header>
    <div className="wrap">
      <section className="hero"><h1>Build Your Workforce. Strengthen the Merit Shop.</h1><p>A live, privacy-controlled workforce network connecting ABC member contractors with apprentices, graduates, journeymen, foremen, superintendents, project managers, estimators and construction leaders.</p><div className="callout">Contractors search trade, apprenticeship history, project experience, exact systems worked on, credentials, region and days available — without seeing a candidate's name, phone number or email until authorized contact access is purchased.</div><div className="actions"><a className="button" href="/member/search">Search Available Workers</a><a className="button secondary" href="/candidate/signup">Create Candidate Profile</a></div></section>
      <section className="section" id="workforce"><h2>Live Workforce Network <span className="muted" style={{fontSize:13}}>DEMO DATA</span></h2><div className="grid grid2"><WorkforceTable title="Journeyman / Certified Level" rows={journeyman}/><WorkforceTable title="Apprentice Level" rows={apprentices}/></div></section>
      <section className="section" id="pricing"><h2>Member Contact Pricing</h2><div className="grid grid3"><div className="card"><h3>Standard Candidate</h3><div className="stat">$100</div><p className="muted">Apprentice / Journeyman / Certified</p></div><div className="card"><h3>Foreman / Superintendent</h3><div className="stat">$250</div></div><div className="card"><h3>Executive / PM / Estimator</h3><div className="stat">$500</div></div></div></section>
      <section className="section" id="how"><h2>How It Works</h2><div className="grid grid3"><div className="card"><h3>1. Permanent Record</h3><p>Trade, apprenticeship term, training, project-by-project experience, specific systems/materials, credentials and certifications remain with the candidate profile.</p></div><div className="card"><h3>2. 30-Day Availability</h3><p>Available profiles show the exact days available and automatically expire after 30 days unless renewed.</p></div><div className="card"><h3>3. Anonymous Search</h3><p>Members see qualifications and experience, but not the candidate's identity or direct contact information.</p></div><div className="card"><h3>4. Paid Contact Release</h3><p>Members purchase contact access based on candidate level.</p></div><div className="card"><h3>5. 72-Hour Access</h3><p>Candidate contact information is visible for three days after purchase and then locks again.</p></div><div className="card"><h3>6. Career-Long Connection</h3><p>The ABC relationship continues from apprentice to graduate, employee, journeyman, foreman, superintendent/management and eventually employer.</p></div></div></section>
    </div><footer className="footer">ABC NorCal Workforce Exchange · Production application foundation</footer>
  </main>
}
