import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, CheckSquare, Square, AlertCircle, RefreshCw } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { useLanguage } from '../LanguageContext';

interface ComplianceItem {
  id: string;
  phase: 'import' | 'nursery' | 'spirits';
  title: string;
  description: string;
  authority: string;
  mandatory: boolean;
}

interface ComplianceRoadmapProps {
  currentCountryId: string;
}

export default function ComplianceRoadmap({ currentCountryId }: ComplianceRoadmapProps) {
  const { t } = useLanguage();
  const currentCountry = useMemo(() => {
    return COUNTRIES.find(c => c.id === currentCountryId) || COUNTRIES[0];
  }, [currentCountryId]);

  // Generates dynamic compliance requirements based on the chosen country's local structure
  const dynamicComplianceItems = useMemo<ComplianceItem[]>(() => {
    const c = currentCountry;
    const name = c.name;

    // Map authority overrides
    const agencies = {
      zimbabwe: { phyto: 'Mazowe Services (Ministry of Agriculture)', env: 'EMA (Environmental Management Agency)', tax: 'ZIMRA (Zimbabwe Revenue Authority)', craft: 'ZimTrade', std: 'SAZ (Standards Association of Zimbabwe)', board: 'AMA (Agricultural Marketing Authority)', tradeBlock: 'SADC Trade Certificate' },
      kenya: { phyto: 'KEPHIS (Kenya Plant Health Inspectorate Service)', env: 'NEMA (National Environment Management Authority)', tax: 'KRA (Kenya Revenue Authority)', craft: 'KenTrade / EPZA', std: 'KEBS (Kenya Bureau of Standards)', board: 'HCD (Horticultural Crops Directorate)', tradeBlock: 'EAC Certificate of Origin' },
      rwanda: { phyto: 'RAB (Rwanda Agriculture & Animal Resources Board)', env: 'REMA (Rwanda Environment Management Authority)', tax: 'RRA (Rwanda Revenue Authority)', craft: 'RDB (Rwanda Development Board)', std: 'RSB (Rwanda Standards Board)', board: 'MINAGRI Export Wing', tradeBlock: 'EAC Preferential Cargo Act' },
      south_africa: { phyto: 'DALRRD (Department of Agriculture, Land Reform & Rural Dev)', env: 'DFFE (Dept of Forestry, Fisheries & the Environment)', tax: 'SARS (South African Revenue Service)', craft: 'AgriSA / Wesgro', std: 'SABS (South African Bureau of Standards)', board: 'Wine & Spirit Board / SA-GAP', tradeBlock: 'SACU / SADC Trade Agreement' },
      namibia: { phyto: 'Ministry of Agriculture, Water & Land Reform', env: 'MEFT (Ministry of Environment, Forestry & Tourism)', tax: 'NamRA (Namibia Revenue Agency)', craft: 'Namibia Chamber of Commerce', std: 'NSI (Namibia Standards Institution)', board: 'AMTA (Agro-Marketing & Trade Agency)', tradeBlock: 'SACU Regional Certificate' },
      botswana: { phyto: 'Ministry of Agricultural Development & Food Security', env: 'Department of Environmental Affairs', tax: 'BURS (Botswana Unified Revenue Service)', craft: 'BITC (Botswana Investment & Trade Centre)', std: 'BOBS (Botswana Bureau of Standards)', board: 'BAMB (Botswana Agricultural Marketing Board)', tradeBlock: 'SACU / SADC Customs Form' },
      zambia: { phyto: 'PQPS (Plant Quarantine & Phytosanitary Services)', env: 'ZEMA (Zambia Environmental Management Agency)', tax: 'ZRA (Zambia Revenue Authority)', craft: 'Zambia Chamber of Commerce', std: 'ZABS (Zambia Bureau of Standards)', board: 'ZAM (Zambia Association of Manufacturers)', tradeBlock: 'COMESA / SADC Trade Agreement' },
      mozambique: { phyto: 'MADER (Ministério da Agricultura e Desenvolvimento Rural)', env: 'AQUA (Agência Nacional para o Desenvolvimento da Qualidade Ambiental)', tax: 'Autoridade Tributária de Moçambique', craft: 'IPEME', std: 'INNOQ (Instituto Nacional de Normalização e Qualidade)', board: 'Zimtrade-Beira Trade Corridor', tradeBlock: 'SADC Trade Protocol' },
      tanzania: { phyto: 'TPRI (Tropical Pesticides Research Institute) / TOSCI', env: 'NEMC (National Environment Management Council)', tax: 'TRA (Tanzania Revenue Authority)', craft: 'TanTrade', std: 'TBS (Tanzania Bureau of Standards)', board: 'SIDO (Small Industries Development Organization)', tradeBlock: 'EAC / SADC Customs Certificate' }
    };

    const agency = agencies[c.id as keyof typeof agencies] || agencies.zimbabwe;

    return [
      {
        id: 'p1_import_permit',
        phase: 'import',
        title: 'Phytosanitary Import Permit',
        description: `Prior written permission from biological customs inspectors verifying imported Agave bulbils are free from snout weevil and fusarium pathogen spores.`,
        authority: agency.phyto,
        mandatory: true,
      },
      {
        id: 'p1_quarantine_auth',
        phase: 'import',
        title: 'Approved Quarantine Nursery Layout',
        description: `Authorization to isolate incoming imported stock inside a double-gated, insect-proof shade greenhouse for the introductory 60-day biosecurity audit window.`,
        authority: `${agency.env} & Quarantine Services`,
        mandatory: true,
      },
      {
        id: 'p1_border_declare',
        phase: 'import',
        title: 'Port-of-Entry Biological Cargo Declaration',
        description: `Official log entry and verification of phytosanitary paper trail at major border checkpoints or regional international airports.`,
        authority: `${agency.tax} Customs & Excise`,
        mandatory: true,
      },
      {
        id: 'p2_grower_register',
        phase: 'nursery',
        title: `${c.id.toUpperCase() === 'ZIMBABWE' ? 'AMA' : 'National'} Grower Registration &座標 Mapping`,
        description: `Filing legal land-tenure bounds and GPS coordinates of the seedling nursery site/field blocks with crop marketing authorities.`,
        authority: agency.board,
        mandatory: true,
      },
      {
        id: 'p2_env_assessment',
        phase: 'nursery',
        title: 'Waste & Water Soil Clearance',
        description: `Environmental consent approving sustainable disposal guidelines for acidic liquid waste extract (spent bagasse wash water and decortication runoffs).`,
        authority: agency.env,
        mandatory: false,
      },
      {
        id: 'p2_food_std',
        phase: 'nursery',
        title: `${c.id.toUpperCase() === 'ZIMBABWE' ? 'SAZ ISO 22000' : 'National Food Quality'} Hygiene Certificate`,
        description: `Certified food-grade sanitation clearance for raw agave syrup cooking autoclaves, filtration lines, and bottling lines.`,
        authority: agency.std,
        mandatory: true,
      },
      {
        id: 'p3_distiller_permit',
        phase: 'spirits',
        title: 'Micro-Distillery Manufacturing License',
        description: `Customs and excise authorization to conduct steam hydrolysis and kettle distillation to refine pure Agave spirits.`,
        authority: `Excise Division & ${agency.std}`,
        mandatory: true,
      },
      {
        id: 'p3_tax_seal',
        phase: 'spirits',
        title: 'Bonded Warehouse Excise Seal',
        description: `Registration and physical vault audits verifying tax declarations for finished high-proof agave spirits prior to local or international retail distribution.`,
        authority: agency.tax,
        mandatory: true,
      },
      {
        id: 'p3_craft_export',
        phase: 'spirits',
        title: 'Exporter Hub Validation License',
        description: `Trade registration clearance allowing collective exporter privileges and tax-free shipping of raw syrup or sisal bio-fibers.`,
        authority: agency.craft,
        mandatory: false,
      },
      {
        id: 'p3_regional_trade',
        phase: 'spirits',
        title: `${agency.tradeBlock} Form`,
        description: `Trade origin certificate certifying localized farming production, allowing tax-free and tariff-free shipping across regional economic zones.`,
        authority: `${agency.tradeBlock} Office`,
        mandatory: true,
      }
    ];
  }, [currentCountry]);

  const [checkedIds, setCheckedIds] = useState<string[]>([
    'p1_import_permit',
    'p2_grower_register'
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'mandatory'>('all');

  // Reset progress when country shifts
  useEffect(() => {
    setCheckedIds(['p1_import_permit', 'p2_grower_register']);
  }, [currentCountryId]);

  const progress = useMemo(() => {
    const total = dynamicComplianceItems.length;
    const completed = dynamicComplianceItems.filter((item) => checkedIds.includes(item.id)).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [checkedIds, dynamicComplianceItems]);

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const filteredItems = useMemo(() => {
    return dynamicComplianceItems.filter(
      (item) => activeFilter === 'all' || item.mandatory
    );
  }, [dynamicComplianceItems, activeFilter]);

  return (
    <div id="compliance-roadmap-container" className="space-y-6">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 uppercase tracking-wider font-display">
            <ShieldCheck className="w-5 h-5 text-agave-600" />
            {t.compliance.complianceTitle || "Regulatory Compliance roadmap"}
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            {t.compliance.complianceDesc || "Review and check off regulatory permits required to maintain legal standing for local farming and international exports in"} **{currentCountry.name}**.
          </p>
        </div>

        {/* Filters */}
        <div className="inline-flex gap-1.5 p-1 bg-stone-100 border border-stone-200/60 rounded-xl h-fit w-fit select-none font-sans">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeFilter === 'all' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.compliance.allMilestones || "All Milestones"}
          </button>
          <button
            onClick={() => setActiveFilter('mandatory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeFilter === 'mandatory' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.compliance.mandatoryOnly || "Mandatory Only"}
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Audit Readiness Index ({currentCountry.name})</span>
          <span className="text-xl font-extrabold text-stone-900 font-display mt-0.5 block">{progress}% {t.compliance.verifiedCompliant || "Verified compliant"}</span>
          <p className="text-[10px] text-stone-500 font-sans italic mt-0.5">
            {t.compliance.inspectionCheckText || "Check off actions as they undergo certified local board inspections."}
          </p>
        </div>

        <div className="space-y-2 flex-grow sm:flex-grow-0 sm:min-w-[200px] font-sans">
          <div className="flex justify-between text-xs font-semibold text-stone-600">
            <span>{t.compliance.progressLabel || "Progress:"}</span>
            <span>{checkedIds.length} {t.compliance.metLabel || "of"} {dynamicComplianceItems.length} {t.compliance.metLabel ? "" : "met"}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden shadow-inner flex font-sans">
            <div
              style={{ width: `${progress}%` }}
              className="bg-agave-650 transition-all duration-300 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Region Notification Badge */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-start gap-2.5 font-sans">
        <AlertCircle className="w-4 h-4 text-agave-600 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
          <strong>Jurisdiction:</strong> You are currently viewing the regulatory codes governed by statutory instruments of <strong>{currentCountry.name}</strong>. Switching the country selector in the workspace header will automatically redefine audit authorities and local compliance benchmarks.
        </p>
      </div>

      {/* Items list grouped by phase */}
      <div className="space-y-6">
        {(['import', 'nursery', 'spirits'] as const).map((phase) => {
          const itemsInPhase = filteredItems.filter((i) => i.phase === phase);
          if (itemsInPhase.length === 0) return null;

          const phaseLabels = {
            import: t.compliance.phase1 || 'Phase 1: Seed Propagation & Quarantine (Pre-cultivation)',
            nursery: `${t.compliance.phase2 || 'Phase 2: Local Production & Food Quality (Scale-up)'} (${currentCountry.flag})`,
            spirits: t.compliance.phase3 || 'Phase 3: Spirit Distillation & Export Trade (Market Launch)',
          };

          return (
            <div key={phase} className="space-y-3 font-sans">
              <h3 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest border-s-2 border-agave-500 ps-2.5">
                {phaseLabels[phase]}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itemsInPhase.map((item) => {
                  const isChecked = checkedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChecked(item.id)}
                      className={`p-4 border.5 rounded-2xl flex gap-3.5 items-start text-left cursor-pointer select-none transition-all duration-150 ${
                        isChecked
                          ? 'bg-emerald-50/45 border-emerald-305 ring-1 ring-emerald-100 shadow-2xs'
                          : 'bg-white border-stone-200 hover:border-stone-250 hover:shadow-xs'
                      }`}
                    >
                      <div className="mt-0.5 text-emerald-800 flex-shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <Square className="w-5 h-5 text-stone-350" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-bold leading-tight ${isChecked ? 'text-stone-500 line-through' : 'text-stone-900'}`}>
                            {item.title}
                          </span>
                          {item.mandatory && (
                            <span className="text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded bg-rose-50 border border-rose-100 text-rose-700">
                              {t.compliance.mandatoryBadge || "Mandatory"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-500 font-sans leading-relaxed font-semibold">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-1 pt-1">
                          <span className="text-[9px] font-extrabold text-stone-450 uppercase">AUDIT BOARD:</span>
                          <span className="text-[9px] font-bold text-stone-650">{item.authority}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
