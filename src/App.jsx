import React, { useState, useEffect, useRef } from 'react';
import {
  Download, Upload, Plus, Trash2, Printer,
  Briefcase, GraduationCap, User, Mail, Phone,
  MapPin, Linkedin, Globe, FileText, ChevronDown,
  ChevronUp, Layout, Palette, Save, Camera,
  CreditCard, CheckCircle, Lock, Languages, Sparkles,
  ArrowUp, ArrowDown, X, Star, ExternalLink, FileType
} from 'lucide-react';

// --- CONFIGURATION ---
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/bJe14p4ZabDo6gXgXQ7ok00";
const APP_NAME = "ProResume";
const PRICE = 5.00;
const CURRENCY = "$";

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    personal: "Personal Details",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    summary: "Professional Summary",
    photo: "Profile Photo",
    uploadPhoto: "Upload Photo",
    fullName: "Full Name",
    jobTitle: "Job Title",
    email: "Email",
    phone: "Phone",
    location: "Location",
    website: "Website / LinkedIn",
    position: "Position",
    company: "Company",
    startDate: "Start Date",
    endDate: "End Date",
    description: "Description (Bullet points recommended)",
    school: "School / University",
    degree: "Degree / Qualification",
    addExp: "Add Experience",
    addEdu: "Add Education",
    addSkill: "Add Skill",
    present: "Present",
    download: "PDF Export",
    wordExport: "Word Export",
    saveProject: "Save Project",
    payToDownload: `Buy Lifetime Access (${CURRENCY}${PRICE})`,
    paymentTitle: "Get ProResume Forever",
    paymentDesc: "One-time payment of $5.00. No subscriptions. Unlocks PDF/Word export & removes watermark.",
    cardNum: "Card Number",
    expiry: "Expiry",
    cvc: "CVC",
    payNow: "Pay $5.00 Once",
    processing: "Redirecting...",
    importTitle: "Import Old Resume",
    importDesc: "Paste the text content of your old resume here. Our smart engine will auto-fill the fields.",
    pasteHere: "Paste resume text here...",
    analyze: "Analyze & Import",
    watermark: "PRO RESUME PREVIEW • UNPAID",
    reset: "Reset All",
    successMsg: "Payment Successful! You now have lifetime access.",
    freePreview: "Free Preview Mode",
    selectTemplate: "Select Template"
  },
  de: {
    personal: "Persönliche Daten",
    experience: "Berufserfahrung",
    education: "Ausbildung",
    skills: "Fähigkeiten",
    languages: "Sprachen",
    summary: "Profil",
    photo: "Profilbild",
    uploadPhoto: "Foto hochladen",
    fullName: "Vollständiger Name",
    jobTitle: "Berufsbezeichnung",
    email: "E-Mail",
    phone: "Telefon",
    location: "Adresse / Ort",
    website: "Webseite / LinkedIn",
    position: "Position",
    company: "Firma",
    startDate: "Startdatum",
    endDate: "Enddatum",
    description: "Beschreibung (Stichpunkte empfohlen)",
    school: "Schule / Universität",
    degree: "Abschluss",
    addExp: "Erfahrung hinzufügen",
    addEdu: "Ausbildung hinzufügen",
    addSkill: "Skill hinzufügen",
    present: "Heute",
    download: "PDF Export",
    wordExport: "Word Export",
    saveProject: "Projekt Speichern",
    payToDownload: `Lebenslang kaufen (${CURRENCY}${PRICE})`,
    paymentTitle: "ProResume Freischalten",
    paymentDesc: "Einmalige Zahlung von $5.00. Keine Abos. Entfernt Wasserzeichen & aktiviert Export.",
    cardNum: "Kartennummer",
    expiry: "Gültig bis",
    cvc: "Prüfnummer",
    payNow: "Einmalig $5.00 zahlen",
    processing: "Leite weiter...",
    importTitle: "Importieren",
    importDesc: "Text einfügen. System füllt Felder automatisch.",
    pasteHere: "Lebenslauf-Text hier einfügen...",
    analyze: "Analysieren",
    watermark: "PRO RESUME VORSCHAU • UNBEZAHLT",
    reset: "Zurücksetzen",
    successMsg: "Zahlung erfolgreich! Lebenslanger Zugriff aktiviert.",
    freePreview: "Kostenlose Vorschau",
    selectTemplate: "Vorlage Wählen"
  }
};

const INITIAL_DATA = {
  personal: { fullName: "Alex Meier", title: "Product Manager", email: "alex@example.com", phone: "+1 234 567 890", location: "New York, NY", website: "linkedin.com/in/alexmeier", photo: null, summary: "Experienced product leader with 10+ years building innovative solutions." },
  experience: [{ id: 1, company: "TechFlow AG", position: "Head of Product", startDate: "2020", endDate: "Present", description: "Led product strategy for SaaS platform serving 500K+ users.\n• Increased revenue by 150% through strategic feature launches.\n• Built and scaled a team of 12 product managers." }],
  education: [{ id: 1, school: "University of St. Gallen", degree: "M.A. Business Administration", startDate: "2010", endDate: "2012", description: "" }],
  skills: ["Product Strategy", "Agile", "JIRA"],
  languages: ["German", "English"]
};

// --- PARSER ---
const parseResumeText = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const newData = JSON.parse(JSON.stringify(INITIAL_DATA));
  newData.personal = { ...INITIAL_DATA.personal, photo: null, summary: "" };
  newData.experience = []; 
  newData.education = []; 
  newData.skills = [];
  
  if (lines.length > 0) newData.personal.fullName = lines[0];
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  if (emailMatch) newData.personal.email = emailMatch[0];
  
  let currentSection = 'summary';
  lines.forEach((line, index) => {
    if (index === 0) return;
    const lower = line.toLowerCase();
    if (lower.includes('experience') || lower.includes('berufserfahrung')) { currentSection = 'experience'; return; }
    if (lower.includes('education') || lower.includes('ausbildung')) { currentSection = 'education'; return; }
    if (lower.includes('skills')) { currentSection = 'skills'; return; }
    
    if (currentSection === 'summary' && line.length > 20) newData.personal.summary += line + ' ';
    else if (currentSection === 'skills') {
      if (line.includes(',')) line.split(',').forEach(s => newData.skills.push(s.trim()));
      else newData.skills.push(line);
    }
  });
  
  if (newData.experience.length === 0) newData.experience.push({ id: Date.now(), company: '', position: '', startDate: '', endDate: '', description: '' });
  return newData;
};

// --- TEMPLATES ---
const TemplateBerlin = ({ data, t }) => (
  <div className="h-full bg-white text-slate-800 grid grid-cols-[30%_70%]">
    <div className="bg-slate-900 text-white p-8 flex flex-col gap-6 text-center">
      {data.personal.photo ? <img src={data.personal.photo} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white" alt="Profile" /> : <User className="w-32 h-32 mx-auto text-slate-700" />}
      <div className="text-xs space-y-2 opacity-90 text-left">
        <div className="border-b border-slate-800 pb-1">{data.personal.email}</div>
        <div className="border-b border-slate-800 pb-1">{data.personal.phone}</div>
        <div>{data.personal.location}</div>
      </div>
      <div className="text-left">
        <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">{t.skills}</h3>
        <div className="flex flex-wrap gap-1">{data.skills.map((s,i) => <span key={i} className="px-2 py-1 bg-slate-800 text-white text-[10px] rounded">{s}</span>)}</div>
      </div>
    </div>
    <div className="p-8">
      <h1 className="text-4xl font-bold uppercase mb-1">{data.personal.fullName}</h1>
      <p className="text-xl text-blue-600 mb-6">{data.personal.title}</p>
      <div className="space-y-6">
        {data.experience.map(exp => (
          <div key={exp.id}>
            <h3 className="font-bold">{exp.position}</h3>
            <p className="text-xs text-slate-500 uppercase font-bold">{exp.company} • {exp.startDate} - {exp.endDate}</p>
            <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TemplateMunich = ({ data, t }) => (
  <div className="h-full bg-white text-gray-800 p-10 font-serif relative">
    <div className="absolute top-0 left-0 w-full h-3 bg-emerald-800"></div>
    <div className="flex gap-6 items-end mb-8 mt-4 border-b pb-6">
      {data.personal.photo && <img src={data.personal.photo} className="w-24 h-32 object-cover rounded shadow-lg" alt="Profile" />}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 leading-none">{data.personal.fullName}</h1>
        <p className="text-xl italic text-emerald-800">{data.personal.title}</p>
      </div>
    </div>
    <div className="grid grid-cols-[2fr_1fr] gap-8">
      <div>
        <h2 className="font-sans text-xs font-black uppercase tracking-widest text-emerald-800 mb-4">{t.experience}</h2>
        {data.experience.map(exp => (
          <div key={exp.id} className="mb-6 pl-4 border-l-2 border-emerald-100">
            <h3 className="font-bold text-lg">{exp.position}</h3>
            <p className="text-xs text-emerald-700 font-bold mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</p>
            <p className="text-sm text-gray-600">{exp.description}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 p-4 rounded-lg h-fit">
        <h2 className="font-sans text-xs font-black uppercase tracking-widest text-emerald-800 mb-4">{t.skills}</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {data.skills.map((s, i) => <span key={i} className="px-2 py-1 bg-white rounded text-xs font-bold">{s}</span>)}
        </div>
      </div>
    </div>
  </div>
);

const TemplateZurich = ({ data, t }) => (
  <div className="h-full bg-white text-black p-10 font-sans grid grid-cols-12 gap-6">
    <div className="col-span-12 border-b-4 border-black pb-6 mb-4">
      <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">{data.personal.fullName}</h1>
      <p className="text-2xl text-gray-500 tracking-tight font-bold">{data.personal.title}</p>
    </div>
    <div className="col-span-4 border-r border-gray-200 pr-6 space-y-8">
      <div>
        <h3 className="font-black uppercase text-xs mb-2">Contact</h3>
        <p className="text-sm font-bold">{data.personal.email}</p>
        <p className="text-sm font-bold">{data.personal.phone}</p>
      </div>
      <div>
        <h3 className="font-black uppercase text-xs mb-2">{t.skills}</h3>
        <ul className="text-sm font-bold space-y-1">{data.skills.map((s, i) => <li key={i}>• {s}</li>)}</ul>
      </div>
    </div>
    <div className="col-span-8 space-y-8">
      <div>
        <h3 className="font-black uppercase text-xs mb-4 bg-black text-white inline-block px-2 py-1">{t.experience}</h3>
        {data.experience.map(exp => (
          <div key={exp.id} className="grid grid-cols-12 gap-4 mb-6">
            <div className="col-span-3 text-xs font-black">{exp.startDate}<br/>{exp.endDate}</div>
            <div className="col-span-9">
              <h4 className="text-xl font-black leading-none mb-1">{exp.position}</h4>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">{exp.company}</p>
              <p className="text-sm font-medium">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function ProResume() {
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('proResumeData') || 'null') || INITIAL_DATA);
  const [lang, setLang] = useState('en');
  const [template, setTemplate] = useState('berlin');
  const [activeTab, setActiveTab] = useState('personal');
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem('pro_status') === 'lifetime');
  const [showPayment, setShowPayment] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const t = TRANSLATIONS[lang];
  
  useEffect(() => localStorage.setItem('proResumeData', JSON.stringify(data)), [data]);
  
  // --- PAYMENT SUCCESS LISTENER ---
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setIsPaid(true);
      localStorage.setItem('pro_status', 'lifetime'); // SAVE LIFETIME STATUS
      setShowPayment(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      alert(t.successMsg);
    }
  }, [t.successMsg]);
  
  // --- ACTIONS ---
  const handlePrint = () => {
    if (!isPaid) { setShowPayment(true); return; }
    window.print();
  };
  
  const handleWordExport = () => {
    if (!isPaid) { setShowPayment(true); return; }
    // Simple HTML export that Word can read
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + document.getElementById("resume-content").innerHTML + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Resume_${data.personal.fullName.replace(/\s+/g, '_')}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };
  
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `ProResume_Project_${data.personal.fullName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };
  
  const loadJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { try { setData(JSON.parse(e.target.result)); } catch(err) { alert('Invalid file'); } };
    reader.readAsText(file);
  };
  
  const redirectToStripe = () => window.location.href = STRIPE_PAYMENT_LINK;
  const handleImport = () => { setData(parseResumeText(importText)); setShowImport(false); };
  
  // Update Helpers
  const updatePersonal = (f, v) => setData(p => ({ ...p, personal: { ...p.personal, [f]: v } }));
  const handlePhotoUpload = (e) => { const r = new FileReader(); r.onload = () => updatePersonal('photo', r.result); if(e.target.files[0]) r.readAsDataURL(e.target.files[0]); };
  const updateList = (sec, id, f, v) => setData(p => ({ ...p, [sec]: p[sec].map(i => i.id === id ? {...i, [f]:v} : i) }));
  const addList = (sec) => setData(p => ({ ...p, [sec]: [{ id: Date.now(), company: '', position: '', startDate: '', endDate: '', description: '', school: '', degree: '' }, ...p[sec]] }));
  const removeList = (sec, id) => setData(p => ({ ...p, [sec]: p[sec].filter(i => i.id !== id) }));
  
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      <style>{`@media print { @page { margin: 0; } body { background: white; } .no-print { display: none !important; } }`}</style>
      
      {/* Header */}
      <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-lg no-print">
        <div className="flex items-center gap-2"><Sparkles className="text-yellow-400" /> <span className="text-xl font-black">{APP_NAME}</span></div>
        <div className="flex gap-3">
          <button onClick={() => setLang(lang === 'en' ? 'de' : 'en')} className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-700 flex items-center gap-1"><Languages className="w-3 h-3"/> {lang.toUpperCase()}</button>
          <div className="h-6 w-[1px] bg-slate-700 mx-1"></div>
          <button onClick={downloadJSON} className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-700 flex items-center gap-1"><Save className="w-3 h-3"/> {t.saveProject}</button>
          <label className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-700 flex items-center gap-1 cursor-pointer">
            <Upload className="w-3 h-3"/> {t.importTitle}
            <input type="file" onChange={loadJSON} className="hidden" accept=".json" />
          </label>
          <div className="h-6 w-[1px] bg-slate-700 mx-1"></div>
          {isPaid ? (
            <>
              <button onClick={handleWordExport} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">
                <FileType className="w-3 h-3" /> {t.wordExport}
              </button>
              <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700">
                <Printer className="w-3 h-3" /> {t.download}
              </button>
            </>
          ) : (
            <button onClick={() => setShowPayment(true)} className="flex items-center gap-2 px-4 py-1.5 bg-yellow-500 text-black rounded text-xs font-black hover:bg-yellow-400">
              <Lock className="w-3 h-3" /> {t.payToDownload}
            </button>
          )}
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Sidebar */}
        <aside className="w-[450px] bg-white border-r border-slate-200 flex flex-col no-print">
          {/* Template Selector */}
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2"><Layout className="w-4 h-4"/> {t.selectTemplate}</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[{id:'berlin', n:'Berlin', c:'bg-slate-800'}, {id:'munich', n:'Munich', c:'bg-emerald-800'}, {id:'zurich', n:'Zurich', c:'bg-black'}].map(tm => (
                <button key={tm.id} onClick={() => setTemplate(tm.id)} className={`flex flex-col items-center gap-1 ${template === tm.id ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full ${tm.c} border-2 border-white shadow-md`}></div>
                  <span className="text-[10px] font-bold text-slate-600">{tm.n}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex overflow-x-auto p-2 gap-2 border-b border-slate-100 bg-white">
            {[{id:'personal', icon:User, l:t.personal}, {id:'experience', icon:Briefcase, l:t.experience}, {id:'education', icon:GraduationCap, l:t.education}, {id:'skills', icon:Star, l:t.skills}].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 px-4 py-2 rounded transition ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                <tab.icon className="w-5 h-5 mb-1" /> <span className="text-[10px] font-bold uppercase">{tab.l}</span>
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center relative cursor-pointer hover:opacity-80">
                    {data.personal.photo ? <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" /> : <Camera className="w-8 h-8 text-slate-400" />}
                    <input type="file" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                  <div><label className="text-xs font-bold uppercase text-slate-500">{t.uploadPhoto}</label></div>
                </div>
                <input className="w-full p-2 border rounded" placeholder={t.fullName} value={data.personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.jobTitle} value={data.personal.title} onChange={e => updatePersonal('title', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.email} value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.phone} value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.location} value={data.personal.location} onChange={e => updatePersonal('location', e.target.value)} />
                <textarea className="w-full p-2 border rounded" placeholder={t.summary} rows={4} value={data.personal.summary} onChange={e => updatePersonal('summary', e.target.value)} />
              </div>
            )}
            
            {activeTab === 'experience' && (
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="p-4 border rounded bg-white relative shadow-sm hover:shadow-md transition">
                    <button onClick={() => removeList('experience', exp.id)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4"/></button>
                    <input className="w-full font-bold border-b mb-2 outline-none" placeholder={t.position} value={exp.position} onChange={e => updateList('experience', exp.id, 'position', e.target.value)} />
                    <input className="w-full text-sm border-b mb-2 outline-none" placeholder={t.company} value={exp.company} onChange={e => updateList('experience', exp.id, 'company', e.target.value)} />
                    <div className="flex gap-2 mb-2"><input className="w-1/2 text-xs border rounded p-1" placeholder={t.startDate} value={exp.startDate} onChange={e => updateList('experience', exp.id, 'startDate', e.target.value)} /><input className="w-1/2 text-xs border rounded p-1" placeholder={t.endDate} value={exp.endDate} onChange={e => updateList('experience', exp.id, 'endDate', e.target.value)} /></div>
                    <textarea className="w-full text-xs border rounded p-1" rows={3} placeholder={t.description} value={exp.description} onChange={e => updateList('experience', exp.id, 'description', e.target.value)} />
                  </div>
                ))}
                <button onClick={() => addList('experience')} className="w-full py-3 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-indigo-400 hover:text-indigo-600 font-bold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> {t.addExp}</button>
              </div>
            )}
            
            {activeTab === 'education' && (
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="p-4 border rounded bg-white relative shadow-sm hover:shadow-md transition">
                    <button onClick={() => removeList('education', edu.id)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4"/></button>
                    <input className="w-full font-bold border-b mb-2 outline-none" placeholder={t.degree} value={edu.degree} onChange={e => updateList('education', edu.id, 'degree', e.target.value)} />
                    <input className="w-full text-sm border-b mb-2 outline-none" placeholder={t.school} value={edu.school} onChange={e => updateList('education', edu.id, 'school', e.target.value)} />
                    <div className="flex gap-2 mb-2"><input className="w-1/2 text-xs border rounded p-1" placeholder={t.startDate} value={edu.startDate} onChange={e => updateList('education', edu.id, 'startDate', e.target.value)} /><input className="w-1/2 text-xs border rounded p-1" placeholder={t.endDate} value={edu.endDate} onChange={e => updateList('education', edu.id, 'endDate', e.target.value)} /></div>
                    <textarea className="w-full text-xs border rounded p-1" placeholder="Additional details..." value={edu.description} onChange={e => updateList('education', edu.id, 'description', e.target.value)} />
                  </div>
                ))}
                <button onClick={() => addList('education')} className="w-full py-3 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-indigo-400 hover:text-indigo-600 font-bold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> {t.addEdu}</button>
              </div>
            )}
            
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase">{t.skills}</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s, i) => (
                      <div key={i} className="flex items-center bg-slate-100 rounded px-2 py-1 gap-1">
                        <input className="bg-transparent p-1 text-xs w-24 outline-none" value={s} onChange={e => {
                          const newSkills = [...data.skills]; newSkills[i] = e.target.value; setData(p => ({...p, skills: newSkills}));
                        }} />
                        <button onClick={() => setData(p => ({...p, skills: p.skills.filter((_, idx) => idx !== i)}))} className="text-red-500 hover:bg-red-100 rounded p-0.5"><X className="w-3 h-3"/></button>
                      </div>
                    ))}
                    <button onClick={() => setData(p => ({...p, skills: [...p.skills, 'New Skill']}))} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 flex items-center gap-1"><Plus className="w-3 h-3"/> {t.addSkill}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
        
        {/* Preview Area */}
        <main className="flex-1 bg-slate-200/80 relative flex justify-center overflow-auto p-8">
          <div className="relative shadow-2xl origin-top bg-white" style={{ width: '210mm', height: '297mm', transform: 'scale(0.75)', transformOrigin: 'top center' }}>
            {!isPaid && (
              <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="transform -rotate-45 text-slate-900/10 text-6xl font-black whitespace-nowrap leading-loose">
                  {t.watermark} &nbsp; {t.watermark}
                </div>
              </div>
            )}
            <div id="resume-content" className="w-full h-full">
              {template === 'berlin' && <TemplateBerlin data={data} t={t} />}
              {template === 'munich' && <TemplateMunich data={data} t={t} />}
              {template === 'zurich' && <TemplateZurich data={data} t={t} />}
            </div>
          </div>
        </main>
      </div>
      
      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="font-bold text-lg">{t.importTitle}</h3>
            <textarea className="w-full h-48 border rounded p-2 text-sm" placeholder={t.pasteHere} value={importText} onChange={e => setImportText(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={handleImport} className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">{t.analyze}</button>
              <button onClick={() => setShowImport(false)} className="px-4 py-2 border rounded hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center space-y-6">
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2">{t.paymentTitle}</h2>
            <p className="text-slate-500 mb-6">{t.paymentDesc}</p>
            <button onClick={redirectToStripe} className="w-full py-4 bg-green-600 text-white rounded-lg font-black text-lg hover:bg-green-700 flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> {t.payNow}
            </button>
            <button onClick={() => setShowPayment(false)} className="mt-4 text-xs text-slate-400 hover:text-slate-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
