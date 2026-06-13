import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { 
  Bug, 
  HelpCircle, 
  AlertOctagon, 
  Trash2, 
  ShieldAlert, 
  ArrowRight, 
  CheckSquare, 
  Square,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface PestIssue {
  id: string;
  name: string;
  scientificName: string;
  symptom: string;
  visualCue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  immediateAction: string;
  followUpAction: string;
  timeframe: string;
  isolateOrRemove: 'isolate' | 'remove' | 'none';
  checklist: string[];
}

const PEST_ISSUES: PestIssue[] = [
  {
    id: 'weevil',
    name: 'Agave Snout Weevil',
    scientificName: 'Scyphophorus acupunctatus',
    symptom: 'Small puncture wounds or listing (tilting) at the base of the plant. Softening, rancid fermentation scent in the lower core leaves.',
    visualCue: 'Outer leaves collapse, core easily pulls loose showing fat white grubs feeding inside the piña.',
    severity: 'critical',
    immediateAction: 'Directly uproot, clear, and cleanly bag infested plants. Do not compost. Thoroughly incinerate or bury the core at least 1 meter deep.',
    followUpAction: 'Surround the perimeter block with specialized sticky barriers or organic pyrethrum soil drenches. Conduct daily inspections on adjacent blocks.',
    timeframe: 'Immediate - within 24 Hours',
    isolateOrRemove: 'remove',
    checklist: [
      'Locate and label tilting or collapsing plants',
      'Uproot the entire plant, including the tap root core',
      'Inspect core for fat, white grubs or black adult weevils',
      'Seal entire plant in airtight bags (prevent weevils crawling away)',
      'Cleanly incinerate material off-site or bury deep with lime',
      'Infuse empty hole with diatomaceous earth or organic drench',
      'Set weevil pheromone bait traps in 50m buffers around the nursery margin'
    ]
  },
  {
    id: 'scale',
    name: 'Scale Insects',
    scientificName: 'Acanthococcus coccineus',
    symptom: 'Small, waxy white or grey crusty scales clustered tightly along leaf undersides, weakening sap levels.',
    visualCue: 'Stunted leaf shoots, honeydew residues inviting black sooty mold specs.',
    severity: 'medium',
    immediateAction: 'Separate adjacent nursery plants manually. Mist-spray infested leaves with a high-pressure horticultural oil or mild soapy neem solution.',
    followUpAction: 'Brush scales gently from leaves with broad nylon wire or soft broom bristles. Spray systemic copper-based soaps.',
    timeframe: 'Within 5 Days',
    isolateOrRemove: 'isolate',
    checklist: [
      'Identify scale clusters under lower leaf folds',
      'Isolate infested nursery pots to a segregated 20-meter buffer quarantine zone',
      'Scrape thick crusts manually using soft brushes or cardboard tabs',
      'Spray entire plant thoroughly with organic soapy soap (2% neem concentration)',
      'Sanitize pruning clippers with methylated spirits before moving to clean rows'
    ]
  },
  {
    id: 'rot',
    name: 'Fungal / Bacterial Heart Rot',
    scientificName: 'Erwinia / Fusarium oxysporum',
    symptom: 'Water-soaked grey/brown lesion at base of shoot or center stem. Soft mushy decay expanding rapidly.',
    visualCue: 'The center heart spike turns black, mushy, and gives off an offensive, stagnant sewer-like odor.',
    severity: 'high',
    immediateAction: 'Halt all irrigation instantly. Sever infected leaves or remove entire plant if heart rot is advanced.',
    followUpAction: 'Apply dry copper or lime dust to the cuts. Optimize field drainage channels and spacing.',
    timeframe: 'Within 48 Hours',
    isolateOrRemove: 'remove',
    checklist: [
      'Halt all drip cycles and manual watering to dry out soil',
      'Cut off partially decayed leaves 5cm below the margin of visible rot',
      'Treat cut surface with dry copper oxychloride dusting powder',
      'Discard severed leaf tissues in dry incineration pit',
      'If center growing core is mushy, pull plant completely and treat hole with copper'
    ]
  },
  {
    id: 'dehydration',
    name: 'Severe Dehydration Stress',
    scientificName: 'Non-parasitic abiotic condition',
    symptom: 'Leaf margins fold inward tightly, margins turn pale purple/yellow, tips feel brittle and dried out.',
    visualCue: 'Lower leaves shrivel and form severe transverse wrinkling across leaf faces. Overall plant flattens.',
    severity: 'low',
    immediateAction: 'Initiate a short, deep 10-litre watering cycle per plant at midnight or pre-dawn to bypass solar heat evaporation.',
    followUpAction: 'Lay dry straw, grass mulch, or stone chips around the root base to trap dew. Retain weekly watering for 1 month.',
    timeframe: 'Within 7 Days',
    isolateOrRemove: 'none',
    checklist: [
      'Evaluate soil dryness by inserting a metal rod 15cm deep',
      'Provide slow drip cycle (calculated 5-10L per plant)',
      'Add light grass mulch around base (keep 5cm away from direct leafy crown to avoid moisture trap rot)',
      'Monitor for leaf expansion and color recovery over 14 days'
    ]
  },
  {
    id: 'shock',
    name: 'Transplant Shock',
    scientificName: 'Abiotic transplant stress',
    symptom: 'Yellowing or reddening of outer margins shortly after shifting bulbils from nursery container to deep open field soils.',
    visualCue: 'Outer leaf whorls dry up and die off, while center spike remains green but static.',
    severity: 'medium',
    immediateAction: 'Avoid adding synthetic fertilizers which burn raw roots. Secure soil stability and add a temporary palm branch shade cover.',
    followUpAction: 'Apply organic kelp root drenches to stimulate secondary fibrous feed roots. Delay mechanical weeding near core.',
    timeframe: 'Within 3 Days',
    isolateOrRemove: 'none',
    checklist: [
      'Verify plant is held firmly upright in soil (stiffen soil base if wobbly)',
      'Erect temporary, angled palm frond shade on the sunny western face',
      'Ensure zero standing puddle water is pooling around the planting neck',
      'Apply high-dilution seaweed or compost tea root drench'
    ]
  }
];

export default function PestDecisionTree() {
  const { t } = useLanguage();
  const [activeIssueId, setActiveIssueId] = useState<string>('weevil');
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({});

  const activeIssue = PEST_ISSUES.find(p => p.id === activeIssueId) || PEST_ISSUES[0];

  const handleToggleStep = (issueId: string, step: string) => {
    const current = completedSteps[issueId] || [];
    const updated = current.includes(step)
      ? current.filter(s => s !== step)
      : [...current, step];

    setCompletedSteps({
      ...completedSteps,
      [issueId]: updated
    });
  };

  const currentCompleted = completedSteps[activeIssue.id] || [];
  const percentComplete = Math.round((currentCompleted.length / activeIssue.checklist.length) * 100);

  return (
    <div id="pest-decision-tree-container" className="space-y-6">
      
      {/* Visual Diagnostic selector tabs */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest block mb-3 pl-1 font-sans">
          {t.pest.selectSymptom || "Select Field Symptoms"}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 select-none">
          {PEST_ISSUES.map(pest => {
            const isActive = activeIssue.id === pest.id;
            return (
              <button
                key={pest.id}
                onClick={() => setActiveIssueId(pest.id)}
                className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-red-400/80 bg-red-50/50 text-red-950 shadow-3xs'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-600'
                }`}
              >
                <Bug className={`w-4 h-4 mb-1.5 ${isActive ? 'text-red-700' : 'text-stone-400'}`} />
                <span className="text-xs font-bold font-sans tracking-tight block truncate w-full">
                  {pest.name}
                </span>
                <span className={`text-[8px] font-bold font-mono uppercase px-1 py-0.2 rounded mt-1 ${
                  pest.severity === 'critical'
                    ? 'bg-red-200 text-red-900'
                    : pest.severity === 'high'
                    ? 'bg-orange-100 text-orange-950'
                    : pest.severity === 'medium'
                    ? 'bg-amber-100 text-amber-950'
                    : 'bg-stone-200 text-stone-750'
                }`}>
                  {pest.severity === 'critical' ? t.pest.critical : pest.severity === 'high' ? t.pest.high : pest.severity === 'medium' ? t.pest.medium : t.pest.low}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main symptom diagnostics sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Warning card description */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <AlertOctagon className={`w-5 h-5 ${
              activeIssue.severity === 'critical' ? 'text-red-700 animate-bounce' : 'text-orange-600'
            }`} />
            <div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block font-sans">{t.pest.diagnosticTitle || "Diagnostic Warning Card"}</span>
              <h3 className="text-sm font-bold text-stone-800">{activeIssue.name}</h3>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block font-sans">Scientific Strain</span>
              <span className="font-mono text-stone-600 italic text-[11px] font-semibold">{activeIssue.scientificName}</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block font-sans">Primary Field Symptom</span>
              <p className="text-stone-750 leading-relaxed font-sans">{activeIssue.symptom}</p>
            </div>

            <div className="bg-stone-50 border border-stone-150 p-3 rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1 font-sans">Visual Cues &amp; Key Identifiers</span>
              <p className="text-stone-600 leading-relaxed font-sans italic">"{activeIssue.visualCue}"</p>
            </div>

            {/* Quarantine instruction badge */}
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              activeIssue.isolateOrRemove === 'remove'
                ? 'bg-red-50 border-red-200 text-red-800'
                : activeIssue.isolateOrRemove === 'isolate'
                ? 'bg-amber-50/50 border-amber-200 text-amber-800'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}>
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-bold uppercase tracking-wider text-[9px] block font-sans">{t.pest.isolatingRequired || "Quarantine Protocol"}</span>
                <span className="font-sans font-bold text-[11px]">
                  {activeIssue.isolateOrRemove === 'remove' && (t.pest.yesRemove || 'REMOVE & INCINERATE IMMEDIATELY')}
                  {activeIssue.isolateOrRemove === 'isolate' && (t.pest.yesIsolate || 'ISOLATE INFESTED POTS TO BUFFER ZONE')}
                  {activeIssue.isolateOrRemove === 'none' && (t.pest.noActionRequired || 'NO QUARANTINE NEEDED - FIELD TREATMENT')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action tree timeline checklist */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-105 pb-2.5 flex items-center justify-between font-sans">
            <span>{t.pest.remedyAction || "IF SYMPTOM DETECTED: ACTION TREE"}</span>
            <span className="text-[10px] bg-red-100 text-red-950 font-bold px-2 py-0.5 rounded flex items-center gap-1 font-sans">
              <Clock className="w-3.5 h-3.5" />
              {activeIssue.timeframe}
            </span>
          </h4>

          {/* Action response steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-50 border border-stone-150 p-4 rounded-xl space-y-1.5 shadow-2xs">
              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-widest block font-mono">1. {t.pest.remedyAction || "Immediate Response"}</span>
              <p className="text-xs text-stone-700 font-sans leading-relaxed font-medium">
                {activeIssue.immediateAction}
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-150 p-4 rounded-xl space-y-1.5 shadow-2xs">
              <span className="text-[10px] text-blue-800 font-bold uppercase tracking-widest block font-mono">2. {t.pest.followUpAction || "Follow-Up Action"}</span>
              <p className="text-xs text-stone-700 font-sans leading-relaxed font-semibold">
                {activeIssue.followUpAction}
              </p>
            </div>
          </div>

          {/* Field worker sub checklist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Field-Worker Response Checklist</span>
              <span className="text-[10px] font-bold font-mono text-agave-650 bg-agave-50 border border-agave-150 px-2 rounded">
                {percentComplete}% DONE
              </span>
            </div>

            {/* Staggered progress bar */}
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-agave-600 h-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {activeIssue.checklist.map((step, idx) => {
                const isChecked = currentCompleted.includes(step);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleStep(activeIssue.id, step)}
                    className="w-full flex items-start gap-2.5 text-left p-2 rounded-lg hover:bg-stone-50 border border-transparent transition-all select-none cursor-pointer text-xs"
                  >
                    <span className="mt-0.5 text-agave-600 flex-shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400" />
                      )}
                    </span>
                    <span className={`font-medium ${isChecked ? 'text-stone-400 line-through' : 'text-stone-700'}`}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
