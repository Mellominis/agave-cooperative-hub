import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { 
  Calculator, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Save, 
  Copy, 
  Trash2, 
  Activity, 
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { WaterCalculationInput, WaterCalculationResult, WaterSourceType } from '../types';
import { COUNTRIES } from '../data/countries';

interface WaterPlannerProps {
  currentCountryId: string;
}

interface SavedCalculation {
  id: string;
  name: string;
  input: WaterCalculationInput;
  result: WaterCalculationResult;
  createdAt: string;
}

export default function WaterPlanner({ currentCountryId }: WaterPlannerProps) {
  const { t } = useLanguage();
  // Map current country settings
  const currentCountry = useMemo(() => {
    return COUNTRIES.find(c => c.id === currentCountryId) || COUNTRIES[0];
  }, [currentCountryId]);

  // Shared Form Inputs
  const [region, setRegion] = useState('');
  const [waterSourceType, setWaterSourceType] = useState<WaterSourceType>('borehole');
  const [dailyLitres, setDailyLitres] = useState<number>(3000);
  const [plantCount, setPlantCount] = useState<number>(1000);
  const [nurseryMonths, setNurseryMonths] = useState<number>(6);
  const [establishmentMonths, setEstablishmentMonths] = useState<number>(12);
  const [notes, setNotes] = useState('');
  
  // Custom Local Saved Calculations list
  const [calcName, setCalcName] = useState('My Agave Pilot Planner');
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  // Automatically suggest a local region based on selected country
  useEffect(() => {
    if (currentCountryId === 'zimbabwe') setRegion('Matabeleland South (Gwanda)');
    else if (currentCountryId === 'kenya') setRegion('Laikipia Plateau');
    else if (currentCountryId === 'rwanda') setRegion('Bugesera District');
    else if (currentCountryId === 'south_africa') setRegion('Great Karoo (Graaff-Reinet)');
    else if (currentCountryId === 'namibia') setRegion('Hardap Region');
    else if (currentCountryId === 'botswana') setRegion('Kgalagadi District');
    else if (currentCountryId === 'zambia') setRegion('Choma, Southern Province');
    else if (currentCountryId === 'mozambique') setRegion('Gaza Sub-Arid Buffer');
    else if (currentCountryId === 'tanzania') setRegion('Dodoma Dry Margins');
  }, [currentCountryId]);

  // Load saved calculations
  useEffect(() => {
    try {
      const stored = localStorage.getItem('agave_water_planner_calculations');
      if (stored) {
        setSavedCalculations(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load calculations', err);
    }
  }, []);

  // Recalculate values dynamically when inputs or country assumptions shift
  const calculationResult: WaterCalculationResult = useMemo(() => {
    const nurseryRate = currentCountry.waterPlanningAssumptions.nurseryDailyLitresPerPlant;
    const establishmentRate = currentCountry.waterPlanningAssumptions.establishmentDailyLitresPerPlant;

    // Available daily litres per plant if distributed evenly
    const dailyLitresPerPlant = plantCount > 0 ? Number((dailyLitres / plantCount).toFixed(3)) : 0;

    // Target daily needs
    const targetNurseryDailyNeed = plantCount * nurseryRate;
    const targetEstablishmentDailyNeed = plantCount * establishmentRate;
    
    // We base the core feasibility evaluation on the larger 'establishment phase' daily demand
    const isFeasible = dailyLitres >= targetEstablishmentDailyNeed;

    // Cumulative totals for planning whole phases
    const nurseryTotalLitres = targetNurseryDailyNeed * (nurseryMonths * 30);
    const establishmentTotalLitres = targetEstablishmentDailyNeed * (establishmentMonths * 30);

    // Risk Rating logic
    let riskRating: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    let verdict = 'Clear. Supply covers high-evaporation peak seasons.';

    const ratio = targetEstablishmentDailyNeed > 0 ? dailyLitres / targetEstablishmentDailyNeed : 0;

    if (ratio >= 1.5) {
      riskRating = 'low';
      verdict = `Optimal. Daily capacity (${dailyLitres}L) exceeds field water requirement (${targetEstablishmentDailyNeed}L) by 50%+; perfect buffer.`;
    } else if (ratio >= 1.0) {
      riskRating = 'moderate';
      verdict = `Feasible. Supply is balanced. Requires micro-drippers and mulching to avoid soil moisture loss under high evaporation risk.`;
    } else if (ratio >= 0.6) {
      riskRating = 'high';
      verdict = `Water Stress Risk! Supply (${dailyLitres}L) is below field targets (${targetEstablishmentDailyNeed}L). Reduce planned plants or deploy shaded block nurseries.`;
    } else {
      riskRating = 'critical';
      verdict = `CRITICAL DEFICIT. Severe root failure risk. Immediate alternative borehole, rainwater harvesting tank, or municipal tie-in is required before transplant.`;
    }

    return {
      dailyLitresPerPlant,
      totalDailyWaterNeed: targetEstablishmentDailyNeed,
      nurseryTotalLitres,
      establishmentTotalLitres,
      isFeasible,
      riskRating,
      verdict
    };
  }, [currentCountry, dailyLitres, plantCount, nurseryMonths, establishmentMonths]);

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save calculation
  const handleSaveCalculation = () => {
    const newCalc: SavedCalculation = {
      id: 'calc_' + Date.now(),
      name: calcName.trim() || `Water Plan (${region || currentCountry.name})`,
      input: {
        country: currentCountryId,
        region,
        waterSourceType,
        dailyLitresAvailable: dailyLitres,
        plantCount,
        nurseryPhaseDuration: nurseryMonths,
        establishmentPhaseDuration: establishmentMonths,
        notes
      },
      result: calculationResult,
      createdAt: new Date().toISOString()
    };

    const updated = [newCalc, ...savedCalculations];
    setSavedCalculations(updated);
    localStorage.setItem('agave_water_planner_calculations', JSON.stringify(updated));
    
    // Set notification toast state instead of alert()
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Delete calculation
  const handleDeleteCalculation = (id: string) => {
    const updated = savedCalculations.filter(c => c.id !== id);
    setSavedCalculations(updated);
    localStorage.setItem('agave_water_planner_calculations', JSON.stringify(updated));
  };

  // Load a saved calculation back into form
  const handleLoadSaved = (calc: SavedCalculation) => {
    setRegion(calc.input.region);
    setWaterSourceType(calc.input.waterSourceType);
    setDailyLitres(calc.input.dailyLitresAvailable);
    setPlantCount(calc.input.plantCount);
    setNurseryMonths(calc.input.nurseryPhaseDuration);
    setEstablishmentMonths(calc.input.establishmentPhaseDuration);
    setNotes(calc.input.notes);
    setCalcName(calc.name);
  };

  return (
    <div id="water-planner-section" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Inputs Form Pane */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Calculator className="w-4 h-4 text-agave-650" />
              {t.planner.waterPlannerTitle || "Hydrological Planning Form"}
            </h3>
            <span className="text-[10px] text-agave-650 font-mono font-bold bg-agave-50 border border-agave-150 px-2.5 py-0.5 rounded-md uppercase font-sans">
              {currentCountry.name} Index
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-stone-500 uppercase font-sans">Target District/Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Region microclimate details"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-stone-500 uppercase font-sans">{t.planner.waterSourceLabel || "Hydrology Source Type"}</label>
              <select
                value={waterSourceType}
                onChange={(e) => setWaterSourceType(e.target.value as WaterSourceType)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-semibold"
              >
                <option value="borehole">{t.planner.borehole || "Solar-Pumped Borehole"}</option>
                <option value="rainwater catchment">{t.planner.rainwater || "Rainwater Storage Reservoir"}</option>
                <option value="river pump">{t.planner.river_pump || "River Extraction Pump"}</option>
                <option value="municipal supply">{t.planner.municipal || "Municipal / Communal Line"}</option>
                <option value="deep well">{t.planner.deep_well || "Shallow Hand-Dug Deep Well"}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-stone-500 uppercase font-sans">
                {t.planner.dailyLitresLabel || "Daily Available Litres *"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={dailyLitres}
                  onChange={(e) => setDailyLitres(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 pr-12 text-xs focus:ring-1 focus:ring-agave-500 font-mono"
                />
                <span className="absolute right-3 top-2 text-[9px] font-mono font-bold text-stone-400">LITRES</span>
              </div>
              <p className="text-[9px] text-stone-400 font-sans italic">
                Verified pumping output rate per 24-hr period.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-stone-500 uppercase font-sans">
                {t.planner.plantCountLabel || "Plant/Bulbil Population COUNT"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={plantCount}
                  onChange={(e) => setPlantCount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 pr-12 text-xs focus:ring-1 focus:ring-agave-500 font-mono"
                />
                <span className="absolute right-3 top-2 text-[9px] font-mono font-bold text-stone-400 font-sans">PLANTS</span>
              </div>
              <p className="text-[9px] text-stone-400 font-sans italic">
                Initial pilot target stock capacity.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-stone-500 uppercase font-sans">
                {t.planner.nurseryPeriodLabel || "Nursery Duration"}
              </label>
              <select
                value={nurseryMonths}
                onChange={(e) => setNurseryMonths(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-semibold"
              >
                <option value="3">3 Months (Tissue culture)</option>
                <option value="6">6 Months (Standard Bulbil)</option>
                <option value="9">9 Months (Acclimatization block)</option>
                <option value="12">12 Months (Cold areas safety)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-stone-500 uppercase font-sans">
                {t.planner.establishmentPeriodLabel || "Establishment Phase"}
              </label>
              <select
                value={establishmentMonths}
                onChange={(e) => setEstablishmentMonths(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-semibold"
              >
                <option value="6">6 Months Core establishment</option>
                <option value="12">12 Months (Recommended)</option>
                <option value="18">18 Months (Sandy/arid region)</option>
                <option value="24">24 Months Full roots validation</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-stone-500 uppercase">Borehole Logs &amp; Catchment Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Log borehole pump recovery tests, rainwater tank storage capacity, seasonal dry spills, etc."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-agave-500 font-sans font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row gap-2.5 items-center">
            <div className="relative flex-grow w-full">
              <input
                type="text"
                value={calcName}
                onChange={(e) => setCalcName(e.target.value)}
                placeholder="Calculation name for reports"
                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-semibold"
              />
            </div>
            <button
              onClick={handleSaveCalculation}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-xl bg-agave-650 hover:bg-agave-750 text-white text-xs font-semibold hover:shadow transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Water Profile</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-150 text-xs font-semibold text-center animate-fadeIn">
              ✓ Borehole Water Plan Saved successfully under reports register below!
            </div>
          )}
        </div>

        {/* Live Calculation Outcomes Display Pane */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex-grow space-y-5">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-100 pb-2.5">
              {t.planner.waterPlannerTitle || "Hydrological Feasibility Audit"}
            </h3>

            {/* Feasibility visual badge */}
            <div className="flex items-center gap-3">
              {calculationResult.isFeasible ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">{t.planner.feasibilityVerdict || "FEASIBILITY STATUS"}</span>
                <span className={`text-sm font-bold font-display ${calculationResult.isFeasible ? 'text-emerald-800' : 'text-red-700'}`}>
                  {calculationResult.isFeasible ? (t.planner.feasibleTitle || 'HYDROLOGY CERTIFIED') : (t.planner.infeasibleTitle || 'HYDROLOGY RISK DETECTED')}
                </span>
              </div>
            </div>

            {/* Micro details metrics list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-medium font-sans">Current Country Assumption</span>
                <span className="font-bold text-stone-800">{currentCountry.flag} {currentCountry.name}</span>
              </div>

              <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-medium font-sans">{t.planner.dailyWaterNeed || "Available Litres per Plant / Day"}</span>
                <span className="font-mono font-bold text-stone-800 font-sans">
                  {calculationResult.dailyLitresPerPlant} L/plant/day
                </span>
              </div>

              <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2 bg-stone-50 p-2 rounded-lg">
                <span className="text-stone-600 font-semibold font-sans">{t.planner.totalNurseryNeed || "Required Nursery Water Rate"}</span>
                <span className="font-bold text-stone-850 font-sans">
                  {currentCountry.waterPlanningAssumptions.nurseryDailyLitresPerPlant} L/plant/day
                </span>
              </div>

              <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2 bg-stone-50 p-2 rounded-lg">
                <span className="text-stone-600 font-semibold font-sans">{t.planner.totalEstablishmentNeed || "Required Field Water Rate"}</span>
                <span className="font-bold text-stone-850 font-sans">
                  {currentCountry.waterPlanningAssumptions.establishmentDailyLitresPerPlant} L/plant/day
                </span>
              </div>

              <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-medium font-sans">{t.planner.dailyWaterHeading || "Peak Daily Need (Field)"}</span>
                <span className="font-mono font-bold text-rose-700">
                  {(plantCount * currentCountry.waterPlanningAssumptions.establishmentDailyLitresPerPlant).toLocaleString()} L/day
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium font-sans">Total Est. Phase Water Volume</span>
                <span className="font-mono font-bold text-stone-800">
                  {calculationResult.establishmentTotalLitres.toLocaleString()} L
                </span>
              </div>
            </div>

            {/* Risk Category Visual Block */}
            <div className={`p-3.5 rounded-xl border text-xs gap-3 flex items-start leading-relaxed ${
              calculationResult.riskRating === 'low'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : calculationResult.riskRating === 'moderate'
                ? 'bg-amber-50/50 border-amber-200 text-amber-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider text-[9px] block mb-0.5">
                  {t.planner.riskRating || "RISK RATING"}: {calculationResult.riskRating.toUpperCase()} (Evaporation Risk: {currentCountry.waterPlanningAssumptions.evaporationRisk.toUpperCase()})
                </span>
                <p className="font-medium font-sans leading-relaxed">
                  {calculationResult.verdict}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local saved plans directory listing */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-stone-100">
          <Database className="w-4 h-4 text-stone-400" />
          Hydrological Plan Register ({savedCalculations.length})
        </h4>

        {savedCalculations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedCalculations.map((item) => {
              const countryInfo = COUNTRIES.find(c => c.id === item.input.country);

              return (
                <div 
                  key={item.id} 
                  className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-3 relative shadow-3xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">SAVED REPORT</span>
                      <h5 className="text-xs font-bold text-stone-800 font-sans line-clamp-1">
                        {item.name}
                      </h5>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {item.input.region} ({countryInfo?.flag} {countryInfo?.name})
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteCalculation(item.id)}
                      className="p-1 hover:bg-red-50 hover:text-red-500 rounded text-stone-300 transition-all cursor-pointer"
                      title="Deplane report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[10px] space-y-1 text-stone-600 bg-white p-2.5 rounded-lg border border-stone-150">
                    <div className="flex justify-between">
                      <span>Daily capacity Available:</span>
                      <strong className="font-mono text-stone-800">{item.input.dailyLitresAvailable.toLocaleString()}L</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Planned stock:</span>
                      <strong className="font-mono text-stone-800">{item.input.plantCount.toLocaleString()} plants</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-stone-100 font-semibold">
                      <span>Feasibility:</span>
                      <span className={item.result.isFeasible ? 'text-emerald-700' : 'text-red-650'}>
                        {item.result.isFeasible ? 'Pass' : 'Risk'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLoadSaved(item)}
                    className="w-full text-center py-1.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                  >
                    Load to Panel Inputs
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-stone-450 italic py-2">
            No saved water models yet. Complete the form inputs and click "Save Water Profile" above to record logs.
          </p>
        )}
      </div>

    </div>
  );
}
