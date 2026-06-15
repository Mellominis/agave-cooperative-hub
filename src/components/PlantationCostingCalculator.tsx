import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, Sprout, TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function PlantationCostingCalculator() {
  const { t } = useLanguage();
  const [hectares, setHectares] = useState(2);
  const [bulbilCost, setBulbilCost] = useState(1.10);
  const [laborRate, setLaborRate] = useState(3.50);
  const [processingCap, setProcessingCap] = useState(500); // kg raw piña/day

  // Constants
  const BULBILS_PER_HECTARE = 2500;
  const DRIP_IRRIGATION_PER_HECTARE = 950;
  const FERTILIZATION_PER_HECTARE = 280;
  const CLEARANCE_PER_HECTARE = 220;

  // Calculators
  const costs = useMemo(() => {
    const plantsNeeded = hectares * BULBILS_PER_HECTARE;
    const bulbilTotal = plantsNeeded * bulbilCost;
    const landPrep = hectares * CLEARANCE_PER_HECTARE;
    const fertility = hectares * FERTILIZATION_PER_HECTARE;
    const irrigation = hectares * DRIP_IRRIGATION_PER_HECTARE;
    const laborHectare = hectares * 45 * laborRate; // 45 hours labor per hectare

    const nurseryStructures = 1800; // greenhouse tunnel, netting
    const nurseryPrep = plantsNeeded * 0.15; // soil prep per pot

    const syrupExtractor = 7500; // mill + screwpress
    const syrupVessels = 2900; // cooking autoclave + holding tanks
    const vacuumEvaporator = 12000; // vacuum evaporator

    return {
      plantsNeeded,
      farming: {
        landPrep,
        bulbilTotal,
        fertility,
        irrigation,
        laborHectare,
        subtotal: bulbilTotal + landPrep + fertility + irrigation + laborHectare,
      },
      nursery: {
        nurseryStructures,
        nurseryPrep,
        subtotal: nurseryStructures + nurseryPrep,
      },
      processing: {
        syrupExtractor,
        syrupVessels,
        vacuumEvaporator,
        subtotal: syrupExtractor + syrupVessels + vacuumEvaporator,
      },
    };
  }, [hectares, bulbilCost, laborRate, processingCap]);

  const totalCost = costs.farming.subtotal + costs.nursery.subtotal + costs.processing.subtotal;

  // Percentage shares for custom SVG bar
  const pctFarm = (costs.farming.subtotal / totalCost) * 100;
  const pctNursery = (costs.nursery.subtotal / totalCost) * 100;
  const pctProcessing = (costs.processing.subtotal / totalCost) * 100;

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-agave-600" />
          {t.calculator.calcTitle || "Interactive Costing & Scale-up Simulator"}
        </h2>
        <p className="text-sm text-stone-500">
          {t.calculator.calcDesc || "Model budgets across farming, localized nursery, and initial syrup agro-processing lines."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input variables */}
        <div className="lg:col-span-4 bg-stone-50 border border-stone-200 p-5 rounded-2xl h-fit space-y-4">
          <h3 className="text-sm font-bold text-stone-850 uppercase tracking-widest border-b border-stone-200 pb-2 flex items-center gap-2 font-sans">
            <Sprout className="w-4 h-4 text-agave-600" />
            {t.calculator.modelParams || "Model Parameters"}
          </h3>

          {/* Plant Hectares */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1 flex justify-between font-sans">
              <span>{t.calculator.plantSize || "Plantation Size"}</span>
              <span className="text-agave-700 font-mono font-bold">{hectares} Hectare{hectares > 1 ? 's' : ''}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={hectares}
              onChange={(e) => setHectares(Number(e.target.value))}
              className="w-full accent-agave-600 cursor-pointer"
            />
            <span className="text-[10px] text-stone-400 font-sans">Recommended starting size: 2 - 5 Hectares</span>
          </div>

          {/* Cost per Bulbil */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1 flex justify-between font-sans">
              <span>{t.calculator.costPerBulbil || "Cost per Bulbil (Seedling)"}</span>
              <span className="text-agave-700 font-mono font-bold">${bulbilCost.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.50"
              max="3.00"
              step="0.05"
              value={bulbilCost}
              onChange={(e) => setBulbilCost(Number(e.target.value))}
              className="w-full accent-agave-600 cursor-pointer"
            />
            <span className="text-[10px] text-stone-400 font-sans">Standard certified stock: $1.10 - $1.50</span>
          </div>

          {/* Labor rate */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1 flex justify-between font-sans">
              <span>{t.calculator.hourlyLabor || "Hourly Labor Rate (USD Equivalent)"}</span>
              <span className="text-agave-700 font-mono font-bold">${laborRate.toFixed(2)}/hr</span>
            </label>
            <input
              type="range"
              min="1.50"
              max="10.00"
              step="0.25"
              value={laborRate}
              onChange={(e) => setLaborRate(Number(e.target.value))}
              className="w-full accent-agave-600 cursor-pointer"
            />
            <span className="text-[10px] text-stone-400 font-sans font-medium">Includes specialized transplanting training.</span>
          </div>

          {/* Processing capacity */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1 flex justify-between font-sans">
              <span>{t.calculator.processingCapLabel || "Processing Cap (Piñas/Day)"}</span>
              <span className="text-agave-700 font-mono font-bold">{processingCap} kg</span>
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={processingCap}
              onChange={(e) => setProcessingCap(Number(e.target.value))}
              className="w-full accent-agave-600 cursor-pointer"
            />
            <span className="text-[10px] text-stone-400 font-sans">Syrup line daily batch feed capability.</span>
          </div>

          <div className="bg-agave-50 p-3 rounded-lg border border-agave-100 flex gap-2">
            <Info className="w-4 h-4 text-agave-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-agave-850 leading-relaxed font-sans">
              *Agave requires low direct irrigation and succeeds in arid soils (e.g. regions in Zimbabwe under Ecological Region IV and V).
            </p>
          </div>
        </div>

        {/* Dynamic Budget Display */}
        <div className="lg:col-span-8 bg-white border border-stone-200 p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-sans">{t.calculator.totalStartup || "Total Estimated Startup"}</span>
              <span className="text-3xl font-extrabold text-stone-900 font-sans">{formatUSD(totalCost)}</span>
              <p className="text-[11px] text-stone-500 mt-1 font-sans">
                Provides {costs.plantsNeeded.toLocaleString()} plants covering {hectares} hectare(s).
              </p>
            </div>

            <div className="flex flex-col justify-center bg-stone-50 p-3.5 rounded-xl border border-stone-100">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-stone-700 mb-1 bg-stone-200/50 px-2 py-0.5 rounded w-fit font-sans">
                <TrendingUp className="w-3.5 h-3.5 text-agave-500" />
                Agri-Business Insights
              </div>
              <p className="text-[11px] text-stone-600 leading-normal font-sans">
                {t.calculator.roiYield || "Yield starts at year 5. Projected gross revenue per hectare sits around $12,500 - $18,000 annually in syrup and fiber, producing high ROI post year 6."}
              </p>
            </div>
          </div>

          {/* Custom Responsive SVG Horizontal Stacked Bar Chart */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-stone-850 mb-1 font-sans">
              <span>Financial Allocation Profile</span>
              <span className="text-[10px] text-stone-400">Live share breakdown</span>
            </div>

            {/* Simulated Horizontal Stacked Bar Chart */}
            <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-inner border border-stone-100 select-none">
              <div
                style={{ width: `${pctFarm}%` }}
                className="bg-agave-600 hover:bg-agave-500 transition-all duration-300 relative group flex items-center justify-center text-white text-[10px] font-mono font-bold"
                title={`Farm costs: ${formatUSD(costs.farming.subtotal)}`}
              >
                {pctFarm > 15 && (t.calculator.farmShare || 'Farming')}
              </div>
              <div
                style={{ width: `${pctNursery}%` }}
                className="bg-agave-400 hover:bg-agave-300 transition-all duration-300 relative group flex items-center justify-center text-white text-[10px] font-mono font-bold"
                title={`Nursery costs: ${formatUSD(costs.nursery.subtotal)}`}
              >
                {pctNursery > 15 && (t.calculator.nurseryShare || 'Nursery')}
              </div>
              <div
                style={{ width: `${pctProcessing}%` }}
                className="bg-stone-700 hover:bg-stone-650 transition-all duration-300 relative group flex items-center justify-center text-white text-[10px] font-mono font-bold"
                title={`Processing line: ${formatUSD(costs.processing.subtotal)}`}
              >
                {pctProcessing > 15 && (t.calculator.processingShare || 'Agro-processing')}
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-600 pt-1 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-agave-600 shrink-0"></span>
                <span>{t.calculator.farmShare || "Farming"}: {pctFarm.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-agave-400 shrink-0"></span>
                <span>{t.calculator.nurseryShare || "Nursery"}: {pctNursery.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700 shrink-0"></span>
                <span>{t.calculator.processingShare || "Processing"}: {pctProcessing.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-stone-100 pt-5 mt-4">
            {/* Farming breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-850 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-agave-600" />
                Plantation Costs
              </div>
              <ul className="text-[11px] text-stone-500 space-y-1 font-sans">
                <li className="flex justify-between">
                  <span>Elite bulbils:</span>
                  <span className="font-mono text-stone-700">{formatUSD(costs.farming.bulbilTotal)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Drip Irrigation:</span>
                  <span className="font-mono text-stone-700">{formatUSD(costs.farming.irrigation)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Land Clearance:</span>
                  <span className="font-mono text-stone-700">{formatUSD(costs.farming.landPrep)}</span>
                </li>
                <li className="flex justify-between font-semibold border-t border-stone-100 pt-1 text-stone-850">
                  <span>Farming Subtotal:</span>
                  <span className="font-mono">{formatUSD(costs.farming.subtotal)}</span>
                </li>
              </ul>
            </div>

            {/* Nursery cost breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-850 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-agave-400" />
                Nursery Structure
              </div>
              <ul className="text-[11px] text-stone-500 space-y-1 font-sans">
                <li className="flex justify-between">
                  <span>Greenhouse tunnels:</span>
                  <span className="font-mono text-stone-700">{formatUSD(costs.nursery.nurseryStructures)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Substrate & pots:</span>
                  <span className="font-mono text-stone-700">{formatUSD(costs.nursery.nurseryPrep)}</span>
                </li>
                <li className="flex justify-between py-1"></li>
                <li className="flex justify-between font-semibold border-t border-stone-100 pt-1 text-stone-850">
                  <span>Nursery Subtotal:</span>
                  <span className="font-mono">{formatUSD(costs.nursery.subtotal)}</span>
                </li>
              </ul>
            </div>

            {/* Processing line cost breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-850 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-stone-700" />
                Agro-Processing
              </div>
              <ul className="text-[11px] text-stone-500 space-y-1 font-sans">
                <li className="flex justify-between">
                  <span>Screw Extractor:</span>
                  <span className="font-mono text-stone-700">{formatUSD(costs.processing.syrupExtractor)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Autoclave Cooking:</span>
                  <span className="font-mono text-stone-700">{formatUSD(costs.processing.syrupVessels)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Vacuum Evaporator:</span>
                  <span className="font-mono text-stone-700">{formatUSD(costs.processing.vacuumEvaporator)}</span>
                </li>
                <li className="flex justify-between font-semibold border-t border-stone-100 pt-1 text-stone-850">
                  <span>Processing Subtotal:</span>
                  <span className="font-mono">{formatUSD(costs.processing.subtotal)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
