import React, { useState, useMemo } from 'react';
import { Download, ArrowRight, ShieldCheck, ClipboardList, AlertCircle, Info, Landmark, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COUNTRIES } from '../data/countries';
import { useLanguage } from '../LanguageContext';

interface SOP {
  id: string;
  category: string;
  title: string;
  code: string;
  summary: string;
  steps: string[];
  notes: string;
  timeline: string;
  complianceBody: string;
}

interface SOPViewerProps {
  currentCountryId: string;
}

export default function SOPViewer({ currentCountryId }: SOPViewerProps) {
  const { t } = useLanguage();
  const currentCountry = useMemo(() => {
    return COUNTRIES.find(c => c.id === currentCountryId) || COUNTRIES[0];
  }, [currentCountryId]);

  // Dynamically map localized standard operating procedures
  const localizedSops = useMemo<SOP[]>(() => {
    const codeSuffix = currentCountry.id.slice(0, 3).toUpperCase();
    const c = currentCountry;

    const agencies = {
      zimbabwe: { phyto: 'Plant Quarantine Services (Ministry of Lands & Agriculture)', nursery: 'Agricultural Marketing Authority (AMA)', board: 'SAZ (Standards Association of Zimbabwe)', logistics: 'ZIMRA Customs Officers' },
      kenya: { phyto: 'KEPHIS (Kenya Plant Health Inspectorate Service)', nursery: 'HCD (Horticultural Crops Directorate)', board: 'KEBS (Kenya Bureau of Standards)', logistics: 'KRA (Kenya Revenue Authority)' },
      rwanda: { phyto: 'RAB (Rwanda Agriculture & Animal Resources Board)', nursery: 'RDB (Rwanda Development Board)', board: 'RSB (Rwanda Standards Board)', logistics: 'RRA (Rwanda Revenue Authority)' },
      south_africa: { phyto: 'DALRRD (Dept of Agriculture, Land Reform & Rural Dev)', nursery: 'AgriSA / SA-GAP Inspectors', board: 'SABS (South African Bureau of Standards)', logistics: 'SARS (South African Revenue Service)' },
      namibia: { phyto: 'Ministry of Agriculture, Water & Land Reform', nursery: 'AMTA (Agro-Marketing & Trade Agency)', board: 'NSI (Namibia Standards Institution)', logistics: 'NamRA (Namibia Revenue Agency)' },
      botswana: { phyto: 'Ministry of Agricultural Development', nursery: 'BAMB (Botswana Agricultural Marketing Board)', board: 'BOBS (Botswana Bureau of Standards)', logistics: 'BURS (Botswana Unified Revenue Service)' },
      zambia: { phyto: 'PQPS (Plant Quarantine & Phytosanitary Services)', nursery: 'ZAM (Zambia Association of Manufacturers)', board: 'ZABS (Zambia Bureau of Standards)', logistics: 'ZRA (Zambia Revenue Authority)' },
      mozambique: { phyto: 'MADER (Ministério da Agricultura e Desenvolvimento Rural)', nursery: 'IPEME Board Inspectors', board: 'INNOQ (Instituto de Normalização e Qualidade)', logistics: 'Alfandegas Moçambique' },
      tanzania: { phyto: 'TPRI (Tropical Pesticides Research Institute)', nursery: 'SIDO (Small Industries Development Organization)', board: 'TBS (Tanzania Bureau of Standards)', logistics: 'TRA (Tanzania Revenue Authority)' }
    };

    const agency = agencies[c.id as keyof typeof agencies] || agencies.zimbabwe;

    return [
      {
        id: 'import',
        category: 'Agricultural Biosecurity',
        title: 'Bulbil Material Importation & Quarantine Authority',
        code: `SOP-AGV-001-${codeSuffix}`,
        summary: `Mandatory legal protocol for importing certified virus-free Agave propagation vegetative stock into ${c.name}.`,
        timeline: 'Pre-shipment: 30 - 60 Days',
        complianceBody: agency.phyto,
        steps: [
          `File import application detailing origin coordinates with ${agency.phyto}.`,
          `Secure a certified Phytosanitary Certificate verifying raw bulbils are completely free from agave snout weevil larvae.`,
          `Submit port-of-entry declarations to customs officials upon flight/cargo vessel landing.`,
          `Transport directly to isolated quarantine greenhouses without exposure to wild local crops.`,
          `Facilitate scheduled inspections by biosecurity officers for a minimum quarantine monitor period of 60 days.`
        ],
        notes: `WARNING: Unlawful transport of agave offsets without phytosanitary records is subject to severe agricultural fines and immediate cargo confiscation.`
      },
      {
        id: 'nursery',
        category: 'Agronomic Scale-up',
        title: 'Nursery Infrastructure & Initial Soil Preparation',
        code: `SOP-AGV-002-${codeSuffix}`,
        summary: `Standard practices to maximize survival rates of tender bulbils inside dry nurseries before transplanting into ${c.name}'s soil.`,
        timeline: 'Nursery residence: 6 - 8 Months',
        complianceBody: `${agency.nursery} Certified Nursery Framework`,
        steps: [
          `Select nursery plots using well-drained sand loam blends with zero heavy clay accumulation to prevent root standing wet root death.`,
          `Erect 50% physical shade crop netting to buffer tender foliage from scorching solar rays during peak dry seasons.`,
          `Initiate light trickle irrigation cycles once every 10 to 14 days; allow complete soil drying between cycles.`,
          `Manually brush or prune weed boundaries to remove competition for moisture and micro-fertilizer elements.`,
          `Slowly withdraw shade canvas 20 days prior to deep-soil field transplant to thermal harden the shoots.`
        ],
        notes: 'Observe core leaf nodes. Any yellowing or central leaf collapse indicates hazardous moisture accumulation. Halt irrigation immediately.'
      },
      {
        id: 'syrup',
        category: 'Syrup Extraction',
        title: 'Piña Cooking & Low-Pressure Syrup Concentration',
        code: `SOP-AGV-003-${codeSuffix}`,
        summary: `Sanitation rules for steaming harvested cores, juice extraction, and micro-concentration of low-glycemic syrup.`,
        timeline: 'Processing Turnaround: 24 Hours',
        complianceBody: `${agency.board} Food Regulation Guidelines`,
        steps: [
          `Harvest mature Agave cores (minimum target Brix sugar level of 25%) using sharp coa hand blades.`,
          `Place trimmed piñas in stainless steel autoclave ovens; cook at 110°C for 18 hours to perform complete thermal hydrolysis.`,
          `Grind and press cooked fibers inside automated roller screw mill extractors, flushing pulp with warm pure water.`,
          `Filter raw sweet juice down to 5-microns using mesh systems to eliminate bagasse dross particles.`,
          `Evaporate clear juice in vacuum pans under 60°C to secure consistent 74° Brix syrup concentration without caramel scorches.`
        ],
        notes: `Store finished premium syrup in sanitarily sealed stainless steel drums below 25°C to preserve shelf-stability.`
      },
      {
        id: 'fiber',
        category: 'Sisal-Grade Fiber',
        title: 'Mechanical Leaf Decortication & Fiber Brushing',
        code: `SOP-AGV-004-${codeSuffix}`,
        summary: `Sustainable milling of discarded outer agave leaves to extract durable, commercial-grade sisal bio-fibers.`,
        timeline: 'Processing Turnaround: 48 Hours',
        complianceBody: `${agency.nursery} Sustainable Fiber Directorate`,
        steps: [
          `Gather outer leaves cut during core harvests or separate routine pruning sweeps.`,
          `Feed fresh green leaves into mechanical blade decorticators within 24 hours of cutting to prevent sap hardening.`,
          `Wash output raw fibers thoroughly with fresh water to purge acidic green juices which cause strand decay.`,
          `Hang cleaned strands on galvanized wire sun lines for 8 to 12 hours until internal humidity drops below 12%.`,
          `Brush dry fiber bundles, grading strands based on length and cream shading before tight hydraulic baling.`
        ],
        notes: 'Raw fibers packed while moist will rapidly undergo fungal rot, staining the fibers dark and rendering them unmarketable.'
      },
      {
        id: 'export',
        category: 'Trade & Logistics',
        title: 'Bonded Cargo Clearance & International Logistics',
        code: `SOP-AGV-005-${codeSuffix}`,
        summary: `Guidelines for cargo packing, customs documentation filing, and tariff-free shipping across regional corridors via sea ports.`,
        timeline: 'Export Logistics: 15 - 30 Days lead time',
        complianceBody: agency.logistics,
        steps: [
          `Certify manufacturer status with national trade chambers and export bureaus.`,
          `Draft standard export sheets: Bill of Lading, Commercial Packing Invoice, and custom export manifests.`,
          `Apply for SADC/EAC Preferential Trade Certificates to access neighboring regional markets completely tariff-free.`,
          `Secure final pre-shipment phytosanitary clearance certificates from on-site boundary inspectors.`,
          `Securely seal cargo container with customs tags and coordinate road container transport to deep-water sea ports.`
        ],
        notes: `Ensure shipping bottle labels strictly detail country of origin, ABV% content, and regional safety warnings.`
      }
    ];
  }, [currentCountry]);

  const categoryTranslations: Record<string, string> = useMemo(() => ({
    'Agricultural Biosecurity': t.sop.biosecurity,
    'Agronomic Scale-up': t.sop.scaleup,
    'Syrup Extraction': t.sop.extraction,
    'Sisal-Grade Fiber': t.sop.sisal,
    'Trade & Logistics': t.sop.trade,
  }), [t]);

  const [activeSopId, setActiveSopId] = useState('import');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering
  const filteredSops = useMemo(() => {
    return localizedSops.filter(
      (sop) =>
        sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sop.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (categoryTranslations[sop.category] || sop.category).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localizedSops, searchTerm, categoryTranslations]);

  const activeSop = useMemo(() => {
    return filteredSops.find((s) => s.id === activeSopId) || filteredSops[0] || localizedSops[0];
  }, [filteredSops, activeSopId, localizedSops]);

  // Downloader
  const handleDownloadSOP = (sop: SOP) => {
    const content = `===========================================================
STANDARD OPERATING PROCEDURE: ${currentCountry.name.toUpperCase()}
===========================================================
Document Code:  ${sop.code}
Title:          ${sop.title}
Syllabus Class: ${categoryTranslations[sop.category] || sop.category}
Timeline:       ${sop.timeline}
Auditing Board: ${sop.complianceBody}

SYNOPSIS:
${sop.summary}

OPERATIONAL STAGES:
${sop.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

TECHNICAL GUIDANCE & CORRECTIONS:
${sop.notes}

-----------------------------------------------------------
© ${new Date().getFullYear()} ${currentCountry.name} Agave Training Syndicate
Formulated under oversight guidelines for ${currentCountry.name}.
===========================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sop.code}_Standard_Procedure.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="sop-viewer-container" className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 uppercase tracking-wider font-display">
            <ClipboardList className="w-5 h-5 text-agave-650" />
            {t.sop.standardProcedures}
          </h2>
          <p className="text-xs text-stone-500 font-medium font-sans">
            {t.sop.sopSub} <strong>{currentCountry.name}</strong>.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.sop.searchPlaceholder}
            className="w-full bg-white border border-stone-250 rounded-xl px-3.5 py-1.5 pl-9 text-xs focus:ring-1 focus:ring-agave-500 font-semibold"
          />
          <span className="absolute left-3 top-2.5 text-stone-400 text-xs font-bold leading-none">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: SOP Catalogue */}
        <div className="lg:col-span-4 space-y-2 max-h-[450px] overflow-y-auto pr-1">
          {filteredSops.length > 0 ? (
            filteredSops.map((sop) => {
              const isActive = activeSop.id === sop.id;
              return (
                <button
                  key={sop.id}
                  onClick={() => setActiveSopId(sop.id)}
                  type="button"
                  className={`w-full text-left p-3.5 border rounded-2xl transition-all cursor-pointer select-none focus:outline-none ${
                    isActive
                      ? 'border-agave-500 bg-agave-50 shadow-2xs ring-1 ring-agave-100'
                      : 'border-stone-200 hover:border-stone-250 hover:bg-stone-50/50 bg-white'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold bg-white text-agave-750 border border-stone-200 px-2 py-0.5 rounded uppercase font-sans">
                    {sop.code}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 mt-2 leading-snug line-clamp-2">
                    {sop.title}
                  </h4>
                  <p className="text-[10px] text-stone-550 font-semibold mt-1 truncate">
                    {categoryTranslations[sop.category] || sop.category}
                  </p>
                </button>
              );
            })
          ) : (
            <p className="text-xs text-stone-450 italic p-4 text-center">{t.manual.noResults || "No SOP checklists match search."}</p>
          )}
        </div>

        {/* Right Side: Active SOP Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeSop ? (
              <motion.div
                key={activeSop.id}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.1 }}
                className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
              >
                {/* Meta Header */}
                <div className="flex justify-between items-start gap-4 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[9px] font-mono font-bold bg-agave-100/50 text-agave-850 px-2 py-0.5 rounded uppercase">
                      {activeSop.code}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 font-display mt-1.5 leading-snug">
                      {activeSop.title}
                    </h3>
                    <span className="text-[10px] text-stone-450 font-semibold block mt-0.5">
                      {t.sop.category || "Operational Group"}: <strong>{categoryTranslations[activeSop.category] || activeSop.category}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownloadSOP(activeSop)}
                    className="p-1 px-3 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 cursor-pointer flex-shrink-0 transition-all font-sans"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>

                {/* Sub details block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px] font-sans font-medium">
                  <div className="bg-stone-50/70 p-3 rounded-xl border border-stone-150">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block pb-0.5">{t.sop.timeline}</span>
                    <strong className="text-stone-850">{activeSop.timeline}</strong>
                  </div>
                  <div className="bg-stone-50/70 p-3 rounded-xl border border-stone-150">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block pb-0.5">{t.sop.complianceBody}</span>
                    <strong className="text-stone-850">{activeSop.complianceBody}</strong>
                  </div>
                </div>

                {/* Synopsis */}
                <p className="text-xs text-stone-600 font-semibold font-sans leading-relaxed italic bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/70">
                  🧬 <strong>SOP Synopsis:</strong> "{activeSop.summary}"
                </p>

                {/* Sequenced list of actions */}
                <div className="space-y-2.5">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-stone-400 block">{t.sop.steps}</span>
                  <div className="space-y-2">
                    {activeSop.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3 leading-relaxed text-xs font-sans">
                        <span className="w-5 h-5 flex items-center justify-center bg-stone-100 text-stone-600 border border-stone-200 font-bold font-mono rounded text-[10px] flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-stone-750 font-medium pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings notes */}
                {activeSop.notes && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[11px] p-3.5 rounded-xl flex items-start gap-2.5 leading-relaxed font-sans">
                    <AlertCircle className="w-4.5 h-4.5 text-rose-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="uppercase font-bold tracking-wider text-[9px] block mb-0.5">{t.sop.notes}</strong>
                      <span className="font-semibold">{activeSop.notes}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-450 text-sm">
                <Landmark className="w-12 h-12 mx-auto mb-3 text-stone-300 animate-pulse" />
                <p className="font-bold">Select standard operating manual</p>
                <p className="text-xs">No active checklist loaded.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
