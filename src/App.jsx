import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, Upload, Plus, Trash2, Printer, 
  Briefcase, GraduationCap, User, Mail, Phone, 
  MapPin, Linkedin, Globe, FileText, ChevronDown, 
  ChevronUp, Layout, Palette, Save, Camera, 
  CreditCard, CheckCircle, Lock, Languages, Sparkles,
  ArrowUp, ArrowDown, X, Star, ExternalLink, Type, FileType
} from 'lucide-react';

// --- CONFIGURATION ---
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/bJe14p4ZabDo6gXgXQ7ok00"; 
const APP_NAME = "ProResume";
const PRICE = 5.00; 
const CURRENCY = "$";

// --- THEME CONFIGURATION ---
const THEME_COLORS = {
  navy: { name: 'Navy', hex: '#1e3a8a', bg: 'bg-blue-900', text: 'text-blue-900', border: 'border-blue-900' },
  emerald: { name: 'Emerald', hex: '#065f46', bg: 'bg-emerald-800', text: 'text-emerald-800', border: 'border-emerald-800' },
  purple: { name: 'Royal', hex: '#581c87', bg: 'bg-purple-900', text: 'text-purple-900', border: 'border-purple-900' },
  maroon: { name: 'Maroon', hex: '#7f1d1d', bg: 'bg-red-900', text: 'text-red-900', border: 'border-red-900' },
  black: { name: 'Onyx', hex: '#111827', bg: 'bg-gray-900', text: 'text-gray-900', border: 'border-gray-900' },
  teal: { name: 'Teal', hex: '#0f766e', bg: 'bg-teal-700', text: 'text-teal-700', border: 'border-teal-700' },
  blue: { name: 'Azure', hex: '#2563eb', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600' },
  slate: { name: 'Slate', hex: '#475569', bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-600' },
};

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
    uploadPhoto: "Click to Upload",
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
    description: "Description",
    school: "School / University",
    degree: "Degree / Qualification",
    addExp: "Add Experience",
    addEdu: "Add Education",
    addSkill: "Add Skill",
    present: "Present",
    downloadPdf: "Export PDF",
    downloadWord: "Export Word",
    payToDownload: `Unlock Lifetime (${CURRENCY}${PRICE})`,
    paymentTitle: "Upgrade to Pro",
    paymentDesc: "One-time fee for lifetime access. Unlocks both PDF and Word exports.",
    payNow: "Proceed to Checkout",
    processing: "Redirecting...",
    importTitle: "Import Old Resume",
    importDesc: "Paste text content. Our smart engine will auto-fill fields.",
    pasteHere: "Paste resume text here...",
    analyze: "Analyze & Import",
    watermark: "PRO RESUME PREVIEW • UNPAID",
    reset: "Reset All",
    successMsg: "Payment Successful! Pro features unlocked.",
    freePreview: "Free Preview Mode",
    selectTemplate: "Resume Style",
    selectFont: "Typography",
    selectColor: "Accent Color"
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
    description: "Beschreibung",
    school: "Schule / Universität",
    degree: "Abschluss",
    addExp: "Erfahrung hinzufügen",
    addEdu: "Ausbildung hinzufügen",
    addSkill: "Skill hinzufügen",
    present: "Heute",
    downloadPdf: "PDF Exportieren",
    downloadWord: "Word Exportieren",
    payToDownload: `Alle Exporte freischalten (${CURRENCY}${PRICE})`,
    paymentTitle: "Upgrade auf Pro",
    paymentDesc: "Einmalige Gebühr für lebenslangen Zugriff auf PDF und Word Export.",
    payNow: "Zur Kasse",
    processing: "Leite weiter...",
    importTitle: "Importieren",
    importDesc: "Text einfügen. System füllt Felder automatisch.",
    pasteHere: "Lebenslauf-Text hier einfügen...",
    analyze: "Analysieren",
    watermark: "PRO RESUME VORSCHAU • UNBEZAHLT",
    reset: "Zurücksetzen",
    successMsg: "Zahlung erfolgreich! Pro-Features freigeschaltet.",
    freePreview: "Kostenlose Vorschau",
    selectTemplate: "Lebenslauf-Stil",
    selectFont: "Schriftart",
    selectColor: "Akzentfarbe"
  }
};

const INITIAL_DATA = {
  personal: { fullName: "Thomas Weber", title: "Senior Product Manager", email: "thomas.weber@example.com", phone: "+49 170 123 45 67", location: "Berlin, Germany", website: "linkedin.com/in/tweber", summary: "Experienced Project Manager with a proven track record of leading cross-functional teams to deliver complex projects on time and within budget. Bilingual (German/English) with a strong focus on agile methodologies and process optimization.", photo: null },
  experience: [{ id: 1, company: "Global Tech Solutions", position: "Lead Project Manager", startDate: "2019-03", endDate: "Present", description: "• Managed a portfolio of 5+ enterprise software projects valued at $2M+.\n• Implemented Agile Scrum methodology, increasing team velocity by 20%.\n• Coordinate with stakeholders across 3 time zones." }, { id: 2, company: "Innovate GmbH", position: "Junior Consultant", startDate: "2016-06", endDate: "2019-02", description: "• Assisted in the digital transformation of a major automotive client.\n• Conducted market research and prepared data-driven reports.\n• Organized workshops for over 50 participants." }],
  education: [{ id: 1, school: "Technical University of Munich", degree: "M.Sc. in Management", startDate: "2014-09", endDate: "2016-05", description: "Focus on Innovation Management. Grade: 1.3" }],
  skills: ["Agile/Scrum", "JIRA & Confluence", "Budgeting", "Risk Management", "Leadership", "Python (Basic)"],
  languages: ["German (Native)", "English (Fluent)", "French (B1)"]
};

// --- PARSER ---
const parseResumeText = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const newData = JSON.parse(JSON.stringify(INITIAL_DATA));
  newData.personal = { ...INITIAL_DATA.personal, photo: null, summary: "" };
  newData.experience = []; newData.education = []; newData.skills = [];

  if (lines.length > 0) newData.personal.fullName = lines[0];
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  if (emailMatch) newData.personal.email = emailMatch[0];
  const phoneMatch = text.match(/(\+?\d[\d\s-]{8,})/g);
  if (phoneMatch) newData.personal.phone = phoneMatch[0];

  let currentSection = 'summary';
  lines.forEach((line, index) => {
    if (index === 0) return;
    const lower = line.toLowerCase();
    if (lower.includes('experience') || lower.includes('berufserfahrung')) { currentSection = 'experience'; return; }
    if (lower.includes('education') || lower.includes('ausbildung')) { currentSection = 'education'; return; }
    if (lower.includes('skills')) { currentSection = 'skills'; return; }

    if (currentSection === 'summary' && line.length > 20) newData.personal.summary += line + " ";
    else if (currentSection === 'skills') {
      if (line.includes(',')) line.split(',').forEach(s => newData.skills.push(s.trim()));
      else newData.skills.push(line);
    }
  });
  
  if (newData.experience.length === 0) newData.experience.push({ id: Date.now(), position: "Imported Role", company: "Company", startDate: "2020", endDate: "2023", description: "Please edit details." });
  return newData;
};

// --- TEMPLATES ---

// 1. MODERN SPLIT
const TemplateModern = ({ data, t, font, theme }) => (
  <div className={`h-full bg-white text-slate-800 grid grid-cols-[30%_70%] ${font}`}>
    <div className={`text-white p-8 flex flex-col gap-6 text-center transition-colors duration-300`} style={{backgroundColor: theme.hex}}>
      {data.personal.photo ? <img src={data.personal.photo} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 shadow-lg" /> : <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mx-auto text-xs text-white/50 border-2 border-dashed border-white/20">PHOTO</div>}
      <div className="text-xs space-y-3 text-white/90 text-left w-full mt-4">
         <div className="border-b border-white/10 pb-1 break-all"><span className="opacity-50 block text-[9px] uppercase tracking-wider">Email</span>{data.personal.email}</div>
         <div className="border-b border-white/10 pb-1"><span className="opacity-50 block text-[9px] uppercase tracking-wider">Phone</span>{data.personal.phone}</div>
         <div className="border-b border-white/10 pb-1"><span className="opacity-50 block text-[9px] uppercase tracking-wider">Location</span>{data.personal.location}</div>
         <div className="break-all"><span className="opacity-50 block text-[9px] uppercase tracking-wider">Web</span>{data.personal.website}</div>
      </div>
      <div className="text-left mt-4">
        <h3 className="text-xs font-bold uppercase text-white/50 mb-2 tracking-widest">{t.skills}</h3>
        <div className="flex flex-wrap gap-1">{data.skills.map((s,i) => <span key={i} className="bg-white/10 px-2 py-1 rounded text-[10px] text-white/90 border border-white/10">{s}</span>)}</div>
      </div>
    </div>
    <div className="p-10 pt-12">
      <h1 className="text-5xl font-black uppercase mb-1 tracking-tight leading-none" style={{color: theme.hex}}>{data.personal.fullName}</h1>
      <p className="text-xl mb-6 font-medium tracking-wide text-slate-500">{data.personal.title}</p>
      <div className="mb-8 text-sm leading-relaxed text-slate-600">{data.personal.summary}</div>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-4" style={{color: theme.hex}}>{t.experience}</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg">{exp.position}</h3>
                <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{backgroundColor: theme.hex}}>{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wide mb-2 opacity-70" style={{color: theme.hex}}>{exp.company}</p>
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-slate-100 pb-2 mb-4" style={{color: theme.hex}}>{t.education}</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{edu.school}</h3>
                <span className="text-xs font-bold text-slate-400">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-sm text-slate-600 italic">{edu.degree}</p>
              <p className="text-xs text-slate-500 mt-1">{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 2. CLASSIC SERIF
const TemplateClassic = ({ data, t, font, theme }) => (
  <div className={`h-full bg-white text-gray-800 p-10 font-serif relative ${font}`}>
    <div className="absolute top-0 left-0 w-full h-3" style={{backgroundColor: theme.hex}}></div>
    <div className="flex gap-8 items-end mb-10 mt-6 border-b pb-8">
      {data.personal.photo && <img src={data.personal.photo} className="w-28 h-36 object-cover shadow-md border border-gray-200 p-1 bg-white" />}
      <div>
        <h1 className="text-5xl font-bold text-gray-900 leading-none mb-2">{data.personal.fullName}</h1>
        <p className="text-2xl italic" style={{color: theme.hex}}>{data.personal.title}</p>
        <div className="flex gap-4 mt-4 text-xs font-sans text-gray-500 uppercase tracking-widest">
           {data.personal.location && <span>📍 {data.personal.location}</span>}
           {data.personal.email && <span>✉️ {data.personal.email}</span>}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-[2fr_1fr] gap-10">
      <div>
        <section className="mb-10">
          <h2 className="font-sans text-xs font-black uppercase tracking-[0.2em] mb-6 border-b border-gray-200 pb-2" style={{color: theme.hex}}>{t.experience}</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-8 pl-4 border-l-2" style={{borderColor: theme.hex + '40'}}>
              <h3 className="font-bold text-xl text-gray-900 leading-tight">{exp.position}</h3>
              <div className="flex justify-between text-sm mb-3 mt-1">
                <span className="font-bold italic" style={{color: theme.hex}}>{exp.company}</span>
                <span className="font-sans text-xs text-gray-400 font-bold uppercase">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </section>
      </div>
      <div className="space-y-8">
         <section>
          <h2 className="font-sans text-xs font-black uppercase tracking-[0.2em] mb-4" style={{color: theme.hex}}>{t.education}</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-4">
              <h3 className="font-bold text-gray-900 leading-tight">{edu.school}</h3>
              <p className="text-sm italic" style={{color: theme.hex}}>{edu.degree}</p>
              <p className="font-sans text-xs text-gray-400 mt-1">{edu.startDate} – {edu.endDate}</p>
            </div>
          ))}
         </section>
         <section>
          <h2 className="font-sans text-xs font-black uppercase tracking-[0.2em] mb-4" style={{color: theme.hex}}>{t.skills}</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => <span key={i} className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-sans font-bold border border-gray-200">{s}</span>)}
          </div>
         </section>
         <section>
          <h2 className="font-sans text-xs font-black uppercase tracking-[0.2em] mb-4" style={{color: theme.hex}}>{t.languages}</h2>
          <ul className="space-y-2">
            {data.languages.map((l, i) => <li key={i} className="text-sm font-sans text-gray-600 pb-1 border-b border-gray-100 last:border-0">{l}</li>)}
          </ul>
         </section>
      </div>
    </div>
  </div>
);

// 3. SWISS CLEAN
const TemplateSwiss = ({ data, t, font, theme }) => (
  <div className={`h-full bg-white text-black p-12 font-sans grid grid-cols-12 gap-8 ${font}`}>
    <div className="col-span-12 border-b-4 pb-8 mb-6 flex justify-between items-end" style={{borderColor: theme.hex}}>
      <div>
        <h1 className="text-7xl font-black uppercase tracking-tighter leading-none mb-2" style={{color: theme.hex}}>{data.personal.fullName}</h1>
        <p className="text-3xl text-gray-400 tracking-tight font-bold">{data.personal.title}</p>
      </div>
      {data.personal.photo && <img src={data.personal.photo} alt="Me" className="w-24 h-32 object-cover grayscale contrast-125 filter" />}
    </div>
    <div className="col-span-4 border-r-2 border-gray-100 pr-8 space-y-10">
       <div>
         <h3 className="font-black uppercase tracking-widest text-xs mb-4" style={{color: theme.hex}}>Contact</h3>
         <div className="text-sm font-bold space-y-2">
           <p>{data.personal.email}</p>
           <p>{data.personal.phone}</p>
           <p>{data.personal.location}</p>
           <p className="underline decoration-2" style={{textDecorationColor: theme.hex}}>{data.personal.website}</p>
         </div>
       </div>
       <div>
         <h3 className="font-black uppercase tracking-widest text-xs mb-4" style={{color: theme.hex}}>{t.skills}</h3>
         <ul className="text-sm font-bold space-y-2">{data.skills.map((s, i) => <li key={i} className="border-b border-gray-100 pb-1">{s}</li>)}</ul>
       </div>
    </div>
    <div className="col-span-8 space-y-12 pl-4">
      <div>
         <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-white inline-block px-3 py-1" style={{backgroundColor: theme.hex}}>{t.experience}</h3>
         {data.experience.map(exp => (
           <div key={exp.id} className="grid grid-cols-12 gap-4 mb-8">
              <div className="col-span-3 text-xs font-black pt-1.5 uppercase" style={{color: theme.hex}}>{exp.startDate}<br/>{exp.endDate}</div>
              <div className="col-span-9">
                <h4 className="text-2xl font-black leading-none mb-1">{exp.position}</h4>
                <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">{exp.company}</p>
                <p className="text-sm font-medium leading-relaxed">{exp.description}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  </div>
);

// 4. TIMELINE
const TemplateTimeline = ({ data, t, font, theme }) => (
  <div className={`h-full bg-[#faf9f6] text-slate-800 p-12 font-sans ${font}`}>
    <div className="flex gap-8 mb-12 items-center border-b-2 border-slate-200 pb-10">
      {data.personal.photo && <img src={data.personal.photo} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl" />}
      <div>
        <h1 className="text-5xl font-black mb-2" style={{color: theme.hex}}>{data.personal.fullName}</h1>
        <p className="text-xl font-medium text-slate-500">{data.personal.title}</p>
        <div className="flex gap-4 mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          {data.personal.email} • {data.personal.location}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-[1fr_2fr] gap-12">
      <div className="space-y-10">
        <section>
          <h3 className="font-black uppercase tracking-widest text-xs mb-4 border-b-2 border-slate-200 pb-2" style={{color: theme.hex}}>{t.summary}</h3>
          <p className="text-sm leading-relaxed text-slate-600 italic">"{data.personal.summary}"</p>
        </section>
        <section>
          <h3 className="font-black uppercase tracking-widest text-xs mb-4 border-b-2 border-slate-200 pb-2" style={{color: theme.hex}}>{t.skills}</h3>
          <div className="flex flex-col gap-2">
            {data.skills.map((s, i) => <span key={i} className="text-sm font-bold text-slate-600 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200">{s}</span>)}
          </div>
        </section>
      </div>
      <div className="space-y-10 border-l-2 border-slate-200 pl-10 relative">
        {data.experience.map(exp => (
          <div key={exp.id} className="relative">
            <div className="absolute -left-[49px] top-1 w-4 h-4 rounded-full border-4 border-[#faf9f6]" style={{backgroundColor: theme.hex}}></div>
            <span className="text-xs font-bold uppercase mb-1 block tracking-wider" style={{color: theme.hex}}>{exp.startDate} — {exp.endDate}</span>
            <h3 className="text-2xl font-bold text-slate-900">{exp.position}</h3>
            <p className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wide">{exp.company}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 5. EXECUTIVE
const TemplateExecutive = ({ data, t, font, theme }) => (
  <div className={`h-full bg-white text-slate-900 font-sans ${font} flex flex-col`}>
    <div className="text-white p-12 flex justify-between items-center transition-colors" style={{backgroundColor: theme.hex}}>
      <div>
        <h1 className="text-5xl font-bold tracking-tight mb-2">{data.personal.fullName}</h1>
        <p className="text-xl text-white/70 font-light">{data.personal.title}</p>
        <div className="flex gap-6 mt-6 text-xs text-white/60 font-medium tracking-wide">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>
      {data.personal.photo && <img src={data.personal.photo} className="w-32 h-32 rounded-lg object-cover border-2 border-white/20" />}
    </div>
    <div className="p-12 grid grid-cols-3 gap-12 flex-1">
      <div className="col-span-2 space-y-10">
        <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2" style={{color: theme.hex}}>{t.experience}</h3>
        {data.experience.map(exp => (
          <div key={exp.id}>
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="text-xl font-bold">{exp.position}</h4>
              <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-sm font-bold text-slate-500 mb-3">{exp.company}</p>
            <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-4">{exp.description}</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-50 p-8 rounded-xl h-fit space-y-8">
        <div>
          <h3 className="text-xs font-black uppercase mb-4 tracking-wider" style={{color: theme.hex}}>{t.skills}</h3>
          <div className="flex flex-wrap gap-2">{data.skills.map((s, i) => <span key={i} className="text-xs font-bold bg-white border px-3 py-1.5 rounded-full shadow-sm">{s}</span>)}</div>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase mb-4 tracking-wider" style={{color: theme.hex}}>{t.languages}</h3>
          <ul className="text-sm space-y-2">{data.languages.map((l, i) => <li key={i} className="border-b border-slate-200 pb-1">{l}</li>)}</ul>
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function ProResume() {
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('proResumeData')) || INITIAL_DATA);
  const [lang, setLang] = useState('en');
  const [template, setTemplate] = useState('modern');
  const [font, setFont] = useState('font-modern');
  const [theme, setTheme] = useState(THEME_COLORS.navy); 
  const [activeTab, setActiveTab] = useState('personal');
  const [isPaid, setIsPaid] = useState(() => localStorage.getItem('pro_status') === 'lifetime'); 
  const [showPayment, setShowPayment] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const t = TRANSLATIONS[lang];

  useEffect(() => localStorage.setItem('proResumeData', JSON.stringify(data)), [data]);

  // --- PAYMENT LISTENER ---
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setIsPaid(true);
      localStorage.setItem('pro_status', 'lifetime');
      setShowPayment(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      alert(t.successMsg);
    }
  }, [t.successMsg]);

  // --- ACTIONS ---
  const handlePrint = () => { if (!isPaid) setShowPayment(true); else window.print(); };
  
  const handleWordExport = () => {
    if (!isPaid) { setShowPayment(true); return; }
    const content = document.getElementById("resume-content").innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const link = document.createElement("a");
    link.href = source;
    link.download = `Resume_${data.personal.fullName.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const redirectToStripe = () => window.location.href = STRIPE_PAYMENT_LINK;
  const handleImport = () => { setData(parseResumeText(importText)); setShowImport(false); };
  
  const updatePersonal = (f, v) => setData(p => ({ ...p, personal: { ...p.personal, [f]: v } }));
  const handlePhotoUpload = (e) => { const r = new FileReader(); r.onload = () => updatePersonal('photo', r.result); r.readAsDataURL(e.target.files[0]); };
  const updateList = (sec, id, f, v) => setData(p => ({ ...p, [sec]: p[sec].map(i => i.id === id ? { ...i, [f]: v } : i) }));
  const addList = (sec) => setData(p => ({ ...p, [sec]: [{ id: Date.now(), company: "New", position: "Role", startDate: "2023", endDate: "Present", description: "" }, ...p[sec]] }));
  const removeList = (sec, id) => setData(p => ({ ...p, [sec]: p[sec].filter(i => i.id !== id) }));

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col h-screen">
      <style>{`@media print { @page { margin: 0; } body { background: white; } .no-print { display: none !important; } .print-container { display: block !important; width: 210mm; height: 297mm; margin: 0; padding: 0; overflow: hidden; page-break-after: always; transform: scale(1) !important; } } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }`}</style>

      {/* Header */}
      <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-md z-50 no-print flex-shrink-0">
        <div className="flex items-center gap-2"><Sparkles className="text-yellow-400 w-5 h-5"/> <h1 className="font-bold text-lg">{APP_NAME}</h1> {isPaid && <span className="bg-yellow-400 text-black text-[10px] px-2 rounded font-bold">PRO</span>}</div>
        <div className="flex gap-4">
          <button onClick={() => setLang(lang === 'en' ? 'de' : 'en')} className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded flex gap-2 items-center"><Languages className="w-3 h-3"/> {lang.toUpperCase()}</button>
          <button onClick={() => setShowImport(true)} className="text-xs font-bold bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded flex gap-2 items-center text-white shadow-sm ring-1 ring-blue-400/50"><Upload className="w-3 h-3"/> {t.importTitle}</button>
          
          <div className="flex gap-2">
             <button onClick={handleWordExport} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold shadow-lg transition-all">
                <FileType className="w-3 h-3" /> {t.downloadWord}
             </button>
             <button onClick={handlePrint} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all ${isPaid ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-green-600 hover:bg-green-500'}`}>
                {isPaid ? <Printer className="w-4 h-4" /> : <Lock className="w-4 h-4" />} {isPaid ? t.downloadPdf : t.payToDownload}
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Sidebar */}
        <aside className="w-[450px] bg-white border-r border-slate-200 flex flex-col no-print z-40 shadow-xl">
          
          {/* Template & Font Selector */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-2"><Layout className="w-3 h-3"/> {t.selectTemplate}</h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  {id:'modern', n:'Modern Split', c:'bg-slate-800'}, {id:'classic', n:'Classic Serif', c:'bg-emerald-700'}, 
                  {id:'swiss', n:'Swiss Clean', c:'bg-black'}, {id:'timeline', n:'Timeline', c:'bg-amber-900'}, 
                  {id:'executive', n:'Executive', c:'bg-slate-900'}
                ].map(tm => (
                  <button key={tm.id} onClick={() => setTemplate(tm.id)} className={`flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-lg transition-all ${template === tm.id ? 'bg-white shadow-md ring-2 ring-indigo-500' : 'hover:bg-white/50 opacity-60'}`}>
                    <div className={`w-6 h-6 rounded-full ${tm.c} border-2 border-white shadow-sm`} style={{backgroundColor: theme.hex}}></div>
                    <span className="text-[9px] font-bold text-slate-600 whitespace-nowrap">{tm.n}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-2"><Type className="w-3 h-3"/> {t.selectFont}</h3>
                <div className="flex gap-1">
                  <button onClick={() => setFont('font-modern')} className={`px-2 py-1.5 rounded text-[10px] font-bold border ${font === 'font-modern' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}>Sans</button>
                  <button onClick={() => setFont('font-classic')} className={`px-2 py-1.5 rounded text-[10px] font-bold border font-serif ${font === 'font-classic' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}>Serif</button>
                  <button onClick={() => setFont('font-elegant')} className={`px-2 py-1.5 rounded text-[10px] font-bold border font-serif ${font === 'font-elegant' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}>Elegant</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-2"><Palette className="w-3 h-3"/> {t.selectColor}</h3>
                <div className="flex gap-1 flex-wrap">
                  {Object.values(THEME_COLORS).map(c => (
                    <button key={c.name} onClick={() => setTheme(c)} className={`w-5 h-5 rounded-full border-2 ${theme.name === c.name ? 'border-indigo-500 scale-125' : 'border-white'} shadow-sm`} style={{backgroundColor: c.hex}} title={c.name}></button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex overflow-x-auto p-2 gap-2 border-b border-slate-100">
             {[{id:'personal', icon:User, l:t.personal}, {id:'experience', icon:Briefcase, l:t.experience}, {id:'education', icon:GraduationCap, l:t.education}, {id:'skills', icon:Sparkles, l:t.skills}].map(tab => (
               <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[80px] transition-all ${activeTab === tab.id ? 'bg-slate-100 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
                 <tab.icon className="w-5 h-5 mb-1" /> <span className="text-[10px] uppercase">{tab.l}</span>
               </button>
             ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'personal' && (
              <div className="space-y-4">
                {/* PHOTO UPLOAD - PROMINENT */}
                <div className="relative group w-full h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                   <Camera className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500" />
                   <span className="text-xs font-bold text-slate-500 uppercase group-hover:text-blue-600">{t.uploadPhoto}</span>
                   {data.personal.photo && <img src={data.personal.photo} className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50 group-hover:opacity-20" />}
                   <input type="file" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>

                <input className="w-full p-2 border rounded" placeholder={t.fullName} value={data.personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.jobTitle} value={data.personal.title} onChange={e => updatePersonal('title', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.email} value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.phone} value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.location} value={data.personal.location} onChange={e => updatePersonal('location', e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder={t.website} value={data.personal.website} onChange={e => updatePersonal('website', e.target.value)} />
                <textarea className="w-full p-2 border rounded" placeholder={t.summary} rows={4} value={data.personal.summary} onChange={e => updatePersonal('summary', e.target.value)} />
              </div>
            )}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="p-4 border rounded bg-white relative">
                    <button onClick={() => removeList('experience', exp.id)} className="absolute top-2 right-2 text-red-400"><Trash2 className="w-4 h-4"/></button>
                    <input className="w-full font-bold border-b mb-2 outline-none" value={exp.position} onChange={e => updateList('experience', exp.id, 'position', e.target.value)} />
                    <input className="w-full text-sm border-b mb-2 outline-none" value={exp.company} onChange={e => updateList('experience', exp.id, 'company', e.target.value)} />
                    <div className="flex gap-2 mb-2"><input className="w-1/2 text-xs border rounded p-1" value={exp.startDate} onChange={e => updateList('experience', exp.id, 'startDate', e.target.value)} /><input className="w-1/2 text-xs border rounded p-1" value={exp.endDate} onChange={e => updateList('experience', exp.id, 'endDate', e.target.value)} /></div>
                    <textarea className="w-full text-xs border rounded p-1" rows={3} value={exp.description} onChange={e => updateList('experience', exp.id, 'description', e.target.value)} />
                  </div>
                ))}
                <button onClick={() => addList('experience')} className="w-full py-2 border-2 border-dashed rounded text-sm font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-600 transition-colors flex justify-center items-center gap-2"><Plus className="w-4 h-4"/> {t.addExp}</button>
              </div>
            )}
            {activeTab === 'education' && (
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="p-4 border rounded bg-white relative">
                    <button onClick={() => removeList('education', edu.id)} className="absolute top-2 right-2 text-red-400"><Trash2 className="w-4 h-4"/></button>
                    <input className="w-full font-bold border-b mb-2 outline-none" placeholder={t.school} value={edu.school} onChange={e => updateList('education', edu.id, 'school', e.target.value)} />
                    <input className="w-full text-sm border-b mb-2 outline-none" placeholder={t.degree} value={edu.degree} onChange={e => updateList('education', edu.id, 'degree', e.target.value)} />
                    <div className="flex gap-2 mb-2"><input className="w-1/2 text-xs border rounded p-1" placeholder={t.startDate} value={edu.startDate} onChange={e => updateList('education', edu.id, 'startDate', e.target.value)} /><input className="w-1/2 text-xs border rounded p-1" placeholder={t.endDate} value={edu.endDate} onChange={e => updateList('education', edu.id, 'endDate', e.target.value)} /></div>
                    <textarea className="w-full text-xs border rounded p-1" placeholder={t.description} rows={2} value={edu.description} onChange={e => updateList('education', edu.id, 'description', e.target.value)} />
                  </div>
                ))}
                <button onClick={() => addList('education')} className="w-full py-2 border-2 border-dashed rounded text-sm font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-600 transition-colors flex justify-center items-center gap-2"><Plus className="w-4 h-4"/> {t.addEdu}</button>
              </div>
            )}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div>
                   <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">{t.skills}</h4>
                   <div className="flex flex-wrap gap-2">
                     {data.skills.map((s, i) => (
                       <div key={i} className="flex items-center bg-slate-100 rounded px-2">
                         <input className="bg-transparent p-1 text-xs w-24 outline-none" value={s} onChange={e => {
                           const newSkills = [...data.skills]; newSkills[i] = e.target.value; setData(p => ({...p, skills: newSkills}));
                         }} />
                         <button onClick={() => setData(p => ({...p, skills: p.skills.filter((_, idx) => idx !== i)}))} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                       </div>
                     ))}
                     <button onClick={() => setData(p => ({...p, skills: [...p.skills, "New Skill"]}))} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold hover:bg-indigo-100">+</button>
                   </div>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">{t.languages}</h4>
                   <div className="flex flex-wrap gap-2">
                     {data.languages.map((l, i) => (
                       <div key={i} className="flex items-center bg-slate-100 rounded px-2">
                         <input className="bg-transparent p-1 text-xs w-24 outline-none" value={l} onChange={e => {
                           const newLangs = [...data.languages]; newLangs[i] = e.target.value; setData(p => ({...p, languages: newLangs}));
                         }} />
                         <button onClick={() => setData(p => ({...p, languages: p.languages.filter((_, idx) => idx !== i)}))} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                       </div>
                     ))}
                     <button onClick={() => setData(p => ({...p, languages: [...p.languages, "Language"]}))} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold hover:bg-indigo-100">+</button>
                   </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-slate-200/80 relative flex justify-center overflow-y-auto pt-8 pb-20 px-8">
          <div className="relative shadow-2xl origin-top bg-white" style={{ width: '210mm', minHeight: '297mm', transform: 'scale(0.85)' }}>
            {!isPaid && (
              <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden no-print">
                 <div className="transform -rotate-45 text-slate-900/10 text-6xl font-black whitespace-nowrap select-none">
                    {t.watermark}   {t.watermark}
                 </div>
              </div>
            )}
            <div id="resume-content" className="w-full h-full">
              {template === 'modern' && <TemplateModern data={data} t={t} font={font} theme={theme} />}
              {template === 'classic' && <TemplateClassic data={data} t={t} font={font} theme={theme} />}
              {template === 'swiss' && <TemplateSwiss data={data} t={t} font={font} theme={theme} />}
              {template === 'timeline' && <TemplateTimeline data={data} t={t} font={font} theme={theme} />}
              {template === 'executive' && <TemplateExecutive data={data} t={t} font={font} theme={theme} />}
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
              <button onClick={handleImport} className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold">{t.analyze}</button>
              <button onClick={() => setShowImport(false)} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2">{t.paymentTitle}</h2>
            <p className="text-slate-500 mb-6">{t.paymentDesc}</p>
            <button onClick={redirectToStripe} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> {t.payNow}
            </button>
            <button onClick={() => setShowPayment(false)} className="mt-4 text-xs text-slate-400 underline">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
