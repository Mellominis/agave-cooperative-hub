import React, { useState, useMemo } from 'react';
import { AreaChart, Droplets, Thermometer, Sun, TrendingUp, RefreshCw, BarChart2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface MetricPoint {
  month: string;
  brixPercent: number; // sugar concentration
  soilMoisture: number; // perfect dry range
  heightCm: number; // growth
}

const PILOT_DATA_CHIPINGE: MetricPoint[] = [
  { month: 'Jan', brixPercent: 12.2, soilMoisture: 35, heightCm: 42 },
  { month: 'Feb', brixPercent: 12.4, soilMoisture: 32, heightCm: 45 },
  { month: 'Mar', brixPercent: 13.0, soilMoisture: 25, heightCm: 48 },
  { month: 'Apr', brixPercent: 14.1, soilMoisture: 18, heightCm: 51 },
  { month: 'May', brixPercent: 16.5, soilMoisture: 14, heightCm: 53 },
  { month: 'Jun', brixPercent: 19.0, soilMoisture: 10, heightCm: 55 },
  { month: 'Jul', brixPercent: 21.3, soilMoisture: 8, heightCm: 57 },
  { month: 'Aug', brixPercent: 23.5, soilMoisture: 6, heightCm: 59 },
  { month: 'Sep', brixPercent: 25.8, soilMoisture: 5, heightCm: 61 },
  { month: 'Oct', brixPercent: 26.5, soilMoisture: 4, heightCm: 63 },
  { month: 'Nov', brixPercent: 27.2, soilMoisture: 8, heightCm: 66 },
  { month: 'Dec', brixPercent: 25.0, soilMoisture: 22, heightCm: 68 },
];

export default function TelemetrySimulator() {
  const { t } = useLanguage();
  const [selectedPointIdx, setSelectedPointIdx] = useState<number>(8); // Default to Sept (peak dry / high brix)
  const [isSimulatingUnit, setIsSimulatingUnit] = useState(false);

  const activePoint = PILOT_DATA_CHIPINGE[selectedPointIdx];

  const handleRefresh = () => {
    setIsSimulatingUnit(true);
    setTimeout(() => {
      setIsSimulatingUnit(false);
    }, 600);
  };

  // Generate coordinates for SVG line (Brix %)
  // Width: 600, Height: 150
  const svgCoordinates = useMemo(() => {
    const width = 600;
    const height = 150;
    const padding = 30;

    const pointsCount = PILOT_DATA_CHIPINGE.length;
    const stepX = (width - padding * 2) / (pointsCount - 1);

    // Max brix is approx 30, min is 0
    const maxVal = 30;

    const coords = PILOT_DATA_CHIPINGE.map((pt, i) => {
      const x = padding + i * stepX;
      // Invert Y because SVG coordinates start from top-left (0,0)
      const ratio = pt.brixPercent / maxVal;
      const y = height - padding - ratio * (height - padding * 2);
      return { x, y, pt, idx: i };
    });

    const pathD = coords.reduce((acc, c, i) => {
      return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
    }, '');

    // Area path closing coordinates for gradient fill
    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    return { coords, pathD, areaD, width, height, padding };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 font-display">
            <BarChart2 className="w-5 h-5 text-agave-600" />
            {t.telemetry.telemetryTitle || "Chipinge Pilot Farm Telemetry & Yield Data"}
          </h2>
          <p className="text-sm text-stone-500 font-sans">
            {t.telemetry.telemetryDesc || "Field logging reports on sugar levels (Brix %), moisture sensors, and plant growth curves."}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 border border-stone-200 hover:border-agave-300 rounded-xl bg-white text-stone-700 hover:text-agave-700 text-xs font-semibold shadow-sm transition-all cursor-pointer font-sans"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingUnit ? 'animate-spin text-agave-600' : ''}`} />
          {t.telemetry.pullLateFeeds || "Pull Late Feeds"}
        </button>
      </div>

      {/* Hero indicators panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
        {/* Sugar Concentation Brix indicator */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-start text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.telemetry.leafSugarContent || "Leaf Sugar content"}</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1 bg-amber-50/15 border border-amber-100/60 p-2 rounded-xl">
            <span className="text-3xl font-extrabold text-stone-900 font-sans">{activePoint.brixPercent.toFixed(1)}%</span>
            <span className="text-xs text-amber-700 font-bold font-mono">Brix</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-normal font-sans">
            {t.telemetry.sugarBrixNotice || "Sugar content is highest in late dry cycles (Sep-Oct). Harvesting at 24%+ Brix guarantees supreme spirit distillates."}
          </p>
        </div>

        {/* Soil moisture level indicator */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-start text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.telemetry.avgSoilMoisture || "Average Soil Moisture"}</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1 bg-blue-50/15 border border-blue-100/60 p-2 rounded-xl">
            <span className="text-3xl font-extrabold text-stone-900 font-sans">{activePoint.soilMoisture}%</span>
            <span className="text-xs text-blue-700 font-bold font-mono">Saturation</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-normal font-sans">
            {t.telemetry.soilMoistureNotice || "Agave thrives at 5% - 20% soil water saturation. Rain season levels above 30% are carefully channeled off."}
          </p>
        </div>

        {/* Plant height and expansion indicator */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-start text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.telemetry.avgHeight || "Average Height"}</span>
            <TrendingUp className="w-4 h-4 text-agave-600" />
          </div>
          <div className="flex items-baseline gap-1 bg-agave-50/15 border border-agave-100/60 p-2 rounded-xl">
            <span className="text-3xl font-extrabold text-stone-900 font-sans">{activePoint.heightCm} cm</span>
            <span className="text-xs text-agave-700 font-bold font-mono">{t.telemetry.stemCore || "Stem Core"}</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-normal font-sans">
            {t.telemetry.heightNotice || "Steady development curve proves strong resilience of the Americana strain under low-latitude, semi-arid conditions."}
          </p>
        </div>
      </div>

      {/* SVG Interactive Chart Panel */}
      <div className="bg-white border border-stone-200 p-6 rounded-2xl">
        <div className="flex justify-between items-start mb-4 font-sans">
          <div>
            <h3 className="text-sm font-bold text-stone-850">
              {t.telemetry.twelveMonthCurve || "12-Month Sugar Accumulation Curve (Brix %)"}
            </h3>
            <p className="text-xs text-stone-400">{t.telemetry.curveTooltip || "Click points along the seasonal yield curve to inspect monthly environmental conditions."}</p>
          </div>
          <span className="text-[10px] font-bold text-stone-400 border border-stone-200 px-2 py-0.5 rounded-full uppercase">
            Sabi/Chipinge Trial Block 03
          </span>
        </div>

        {/* Custom Handcrafted Responsive SVG */}
        <div className="relative w-full aspect-[4/1] min-h-[160px] max-h-[220px]">
          <svg
            viewBox={`0 0 ${svgCoordinates.width} ${svgCoordinates.height}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5b947c" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#5b947c" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid helper lines */}
            <line x1="30" y1="30" x2="570" y2="30" stroke="#f1f3f2" strokeWidth="1" />
            <line x1="30" y1="60" x2="570" y2="60" stroke="#f1f3f2" strokeWidth="1" />
            <line x1="30" y1="90" x2="570" y2="90" stroke="#f1f3f2" strokeWidth="1" />
            <line x1="30" y1="120" x2="570" y2="120" stroke="#e5e8e6" strokeWidth="1" />

            {/* Gradient Area under line */}
            <path d={svgCoordinates.areaD} fill="url(#areaGrad)" />

            {/* Line mapping */}
            <path
              d={svgCoordinates.pathD}
              fill="none"
              stroke="#467862"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive coordinates */}
            {svgCoordinates.coords.map((coord, idx) => {
              const isSelected = selectedPointIdx === idx;
              return (
                <g key={coord.pt.month} className="cursor-pointer group">
                  {/* Invisible wide hover zone */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="12"
                    fill="transparent"
                    onClick={() => setSelectedPointIdx(idx)}
                  />

                  {/* Visual Node */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? 6 : 4}
                    // Custom radius matching
                    className={`transition-all duration-150 ${
                      isSelected
                        ? 'fill-agave-600 stroke-white stroke-2'
                        : 'fill-white stroke-agave-400 stroke-2 hover:fill-agave-200'
                    }`}
                    onClick={() => setSelectedPointIdx(idx)}
                  />

                  {/* Horizontal tick text */}
                  <text
                    x={coord.x}
                    y="142"
                    textAnchor="middle"
                    className={`text-[9px] font-medium transition-colors ${
                      isSelected ? 'fill-agave-800 font-bold' : 'fill-stone-400 group-hover:fill-stone-600'
                    }`}
                  >
                    {coord.pt.month}
                  </text>

                  {/* Simple text popup badge directly in SVG for selected pointer */}
                  {isSelected && (
                    <g>
                      <rect
                        x={coord.x - 22}
                        y={coord.y - 25}
                        width="44"
                        height="16"
                        rx="4"
                        fill="#172520"
                        className="opacity-95"
                      />
                      <text
                        x={coord.x}
                        y={coord.y - 14}
                        textAnchor="middle"
                        fill="#ffffff"
                        className="text-[9px] font-mono font-bold"
                      >
                        {coord.pt.brixPercent.toFixed(1)}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Month Report summary bar */}
        <div className="mt-4 bg-stone-50 border border-stone-200/60 rounded-xl p-3 flex flex-wrap gap-x-8 gap-y-2 items-center justify-between text-xs text-stone-600 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-850 uppercase tracking-widest text-[10px] bg-stone-250/50 px-2 py-0.5 rounded">
              {t.telemetry.selectedMonth || "Selected:"} {activePoint.month} Log
            </span>
            <span className="text-stone-300">|</span>
            <span>{t.telemetry.avgSoilMoisture || "Soil Moisture"}: <strong className="text-stone-850">{activePoint.soilMoisture}%</strong></span>
            <span className="text-stone-300">•</span>
            <span>{t.telemetry.leafSugarContent || "Brix Sugar Concentration"}: <strong className="text-stone-850">{activePoint.brixPercent}%</strong></span>
          </div>

          <span className="text-[10px] text-stone-400 font-mono italic">
            Season: {selectedPointIdx >= 4 && selectedPointIdx <= 8 ? 'Winter / Dry Season' : selectedPointIdx >= 9 && selectedPointIdx <= 11 ? 'Start of Rains' : 'Summer Monsoons'}
          </span>
        </div>
      </div>
    </div>
  );
}
