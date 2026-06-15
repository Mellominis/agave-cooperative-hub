import React, { useState, useMemo, useEffect } from 'react';
import { ShieldAlert, Copy, Check, Download, Landmark, FileText, ArrowRight } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { useLanguage } from '../LanguageContext';

interface CooperativeConstitutionGeneratorProps {
  currentCountryId: string;
}

export default function CooperativeConstitutionGenerator({ currentCountryId }: CooperativeConstitutionGeneratorProps) {
  const { t } = useLanguage();
  const currentCountry = useMemo(() => {
    return COUNTRIES.find(c => c.id === currentCountryId) || COUNTRIES[0];
  }, [currentCountryId]);

  // Determine country specific legal act & currency
  const countryLegalMeta = useMemo(() => {
    const maps = {
      zimbabwe: { act: 'Co-Operative Societies Act [Chapter 24:05]', currency: 'USD', defaultName: 'Chiredzi Agave Growers Cooperative Society', defaultDistrict: 'Mwenezi District, Masvingo Province' },
      kenya: { act: 'Co-operative Societies Act (Cap 490)', currency: 'KES', defaultName: 'Laikipia Western Agave Growers Cooperative', defaultDistrict: 'Laikipia County, Rift Valley' },
      rwanda: { act: 'Co-operative Organizations Law No. 50/2007', currency: 'RWF', defaultName: 'Bugesera Agave Cooperative (BAC)', defaultDistrict: 'Eastern Province, Bugesera District' },
      south_africa: { act: 'Co-operatives Act No. 14 of 2005 (Amended 2013)', currency: 'ZAR', defaultName: 'Karoo Plains Agave Farmers Association', defaultDistrict: 'Graaff-Reinet, Eastern Cape Province' },
      namibia: { act: 'Co-operative Societies Act No. 23 of 1996', currency: 'NAD', defaultName: 'Mariental Arid Agave Producers', defaultDistrict: 'Hardap Region, Mariental Central' },
      botswana: { act: 'Co-operative Societies Act (Cap 42:04)', currency: 'BWP', defaultName: 'Kgalagadi Drylands Agave Cooperative', defaultDistrict: 'Kgalagadi District, Hukuntsi' },
      zambia: { act: 'Co-operative Societies Act No. 20 of 1998', currency: 'ZMW', defaultName: 'Southern Province Agave Syndicate', defaultDistrict: 'Choma District, Southern Province' },
      mozambique: { act: 'Lei Geral das Cooperativas (Lei n.º 23/2009)', currency: 'MZN', defaultName: 'Cooperativa de Agave de Gaza', defaultDistrict: 'Província de Gaza, Chokwé' },
      tanzania: { act: 'Co-operative Societies Act No. 6 of 2013', currency: 'TZS', defaultName: 'Dodoma Drylands Agave Alliance', defaultDistrict: 'Dodoma Region, Chamwino District' }
    };
    return maps[currentCountry.id as keyof typeof maps] || maps.zimbabwe;
  }, [currentCountry]);

  const [formData, setFormData] = useState({
    coopName: '',
    district: '',
    joiningFee: '50',
    shareValue: '20',
    minShares: '5',
    committeeSize: '7',
    primaryObjective: 'Cultivation, sorting, propagation of certified Agave offsets, collective operation of high-heat cooking ovens, syrup filter presses, leaf fiber decorticators, and joint marketing of organic products.',
  });

  // Re-seed defaults when country changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      coopName: countryLegalMeta.defaultName,
      district: countryLegalMeta.defaultDistrict,
      joiningFee: countryLegalMeta.currency === 'RWF' ? '10000' : countryLegalMeta.currency === 'ZAR' ? '250' : countryLegalMeta.currency === 'KES' ? '2000' : '50',
      shareValue: countryLegalMeta.currency === 'RWF' ? '5000' : countryLegalMeta.currency === 'ZAR' ? '100' : countryLegalMeta.currency === 'KES' ? '1000' : '20',
    }));
  }, [countryLegalMeta]);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const constitutionText = useMemo(() => {
    return `MODEL CONSTITUTION OF THE ${formData.coopName.toUpperCase()} COOPERATIVE SOCIETY LIMITED

(Formulated under statutory provisions of the ${countryLegalMeta.act} of the Sovereign Republic of ${currentCountry.name})

SECTION I: CORPORATE IDENTITY & OFFICE REGISTRY
1.1 The registered association shall be known as the "${formData.coopName} Limited" (hereinafter referred to as the "Society").
1.2 The registered head executive office of the Society shall be established globally in ${formData.district}, ${currentCountry.name}.

SECTION II: SPECIFIC PRIMARY OBJECTIVES
2.1 To advance the collective ecological, economic, and training interests of its registered crop members in accordance with unified global cooperative guidelines.
2.2 Specifically, the core cooperative purpose is: ${formData.primaryObjective}
2.3 To construct bulk seedling nurseries, distribute disease-tested mother bulbils, share decortication machinery, and secure direct fair-trade exports.

SECTION III: SHARE CAPITAL & CONTRIBUTION STRUCTURE
3.1 Every applying farmer must pay a non-refundable association entry registration fee of ${countryLegalMeta.currency} ${Number(formData.joiningFee).toLocaleString()}.
3.2 The capital structure shall be divided into separate member shares valuated at ${countryLegalMeta.currency} ${Number(formData.shareValue).toLocaleString()} per unit share.
3.3 Every registered member must subscribe and pay for at least ${formData.minShares} shares (Total initial capital investment: ${countryLegalMeta.currency} ${(Number(formData.shareValue) * Number(formData.minShares)).toLocaleString()}).
3.4 No single farmer shall hold or represent more than twenty percent (20%) of the total issued voting shares, preserving a democratic structure.

SECTION IV: THE MANAGEMENT GOVERNANCE COMMITTEE
4.1 The administrative oversight and agricultural marketing operations of the Society shall be handled by a management committee of exactly ${formData.committeeSize} members, elected at the Annual General Meeting (AGM) for a two-year rotating term.
4.2 The management committee shall elect internally: an Executive Chairperson, Vice-Chair, Recording Secretary, and Treasurer.
4.3 A minimum of three (3) administrative board assemblies must take place during each seasonal crop cycle.

SECTION V: FARMER INDEMNIFICATION & BIOSECURITY SECURITY
5.1 Membership shall terminate upon: formal voluntary resignation, death, default on share payments, or dynamic expulsion.
5.2 Member expulsion is mandatory if a farm integrates uncertified wild bulbils or violates international quarantine procedures (such as SOP-AGV-001) which risk introducing the catastrophic snout weevil pathogen to adjacent members' fields.

SECTION VI: AUDITED DISSERVES & CAPITAL SURPLUS
6.1 No less than twenty percent (20%) of any annual commercial surplus shall flow directly into the statutory Cooperative Reserve Fund.
6.2 The accounting sheets of the Cooperative shall undergo audits by certified inspectors appointed in consult with the Registrar of Cooperatives.

Jointly submitted on this date of: _______________________
Signed by Chairman Elect: _______________________________
Signed by Secretary Elect: ______________________________
`;
  }, [formData, currentCountry, countryLegalMeta]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(constitutionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([constitutionText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.coopName.replace(/\s+/g, '_')}_Model_Constitution_Draft.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="coop-constitution-container" className="space-y-6">
      
      {/* Header and description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div>
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 uppercase tracking-wider font-display">
            <Landmark className="w-5 h-5 text-agave-600" />
            {t.coop.coopTitle || "Cooperative Constitution Generator"}
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            {t.coop.coopDesc || "Draft a governing framework legally aligned with the co-operative legal acts of"} <strong>{currentCountry.name}</strong>.
          </p>
        </div>

        {/* Tabs */}
        <div className="inline-flex gap-1.5 p-1 bg-stone-100 border border-stone-200/60 rounded-xl h-fit w-fit select-none font-sans">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'editor' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.coop.editorTab || "Parameter Editor"}
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>{t.coop.previewTab || "Review Bylaws"}</span>
            <span className="bg-agave-100/70 text-agave-850 text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase">
              {countryLegalMeta.currency} Index
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {activeTab === 'editor' ? (
          <>
            {/* Editor form controls */}
            <div className="lg:col-span-7 space-y-4 bg-white border border-stone-200/90 p-5 sm:p-6 rounded-2xl">
              <h3 className="text-xs font-bold text-stone-850 uppercase tracking-widest border-b border-stone-100 pb-2.5">
                Cooperative Baseline Parameters
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1 animate-fadeIn">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Proposed Society Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.coopName}
                    onChange={(e) => setFormData({ ...formData, coopName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-agave-500"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Registered District/Operational Office</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-agave-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">
                    Joining Fee ({countryLegalMeta.currency})
                  </label>
                  <input
                    type="number"
                    value={formData.joiningFee}
                    onChange={(e) => setFormData({ ...formData, joiningFee: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">
                    Nominal Share Cost ({countryLegalMeta.currency})
                  </label>
                  <input
                    type="number"
                    value={formData.shareValue}
                    onChange={(e) => setFormData({ ...formData, shareValue: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Minimum Shared Multiplier</label>
                  <input
                    type="number"
                    value={formData.minShares}
                    onChange={(e) => setFormData({ ...formData, minShares: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Committee Size</label>
                  <select
                    value={formData.committeeSize}
                    onChange={(e) => setFormData({ ...formData, committeeSize: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-850"
                  >
                    <option value="5">5 Executives (Small Group)</option>
                    <option value="7">7 Executives (Highly recommended)</option>
                    <option value="9">9 Executives (Large Regional Alliance)</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Unified Purpose & Objects</label>
                  <textarea
                    value={formData.primaryObjective}
                    onChange={(e) => setFormData({ ...formData, primaryObjective: e.target.value })}
                    rows={3}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-sans leading-relaxed"
                  />
                </div>
              </div>

              <button
                onClick={() => setActiveTab('preview')}
                className="w-full bg-agave-650 hover:bg-agave-750 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow transition-all cursor-pointer text-xs font-sans"
              >
                {t.coop.compileConstitution || "Compile Legal Constitution"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Assistance Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-stone-850 uppercase tracking-wider flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-agave-600" />
                  National Code Framework
                </h4>
                
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 text-[11px] leading-relaxed text-stone-600 font-sans space-y-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block pb-0.5">Statutory Act Reference</span>
                    <strong className="text-stone-800">{countryLegalMeta.act}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block pb-0.5">Cooperative Liability status</span>
                    <strong className="text-stone-800">Limited (Ltd) liability protection applies</strong>
                  </div>
                </div>

                <ul className="text-[11px] text-stone-500 space-y-2.5 leading-relaxed font-sans font-medium">
                  <li>
                    <strong>Democratic Voting:</strong> Regardless of individual shared contribution caps, policies maintain a "one farmer, one vote" core rule.
                  </li>
                  <li>
                    <strong>Profit Safety Valves:</strong> At least 20% of net annual crop margins must fund the Cooperative Reserve before any dividends release.
                  </li>
                  <li>
                    <strong>Strict Biosecurity:</strong> Farmers are legally bound to propagate only certified virus-free offsets to safeguard adjacent farms from epidemics.
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-900 leading-relaxed">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[9px] block">Registrar Verification Alert</span>
                  <p className="text-[11px] font-sans font-semibold mt-0.5">
                    This template generates a legally sound charter aligning with the registered acts of <strong>{currentCountry.name}</strong>. Members must sign and ratify locally prior to registrar submission.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Preview state with full draft output */
          <div className="lg:col-span-12 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2 font-display">
                <FileText className="w-4 h-4 text-agave-600" />
                Compiled Constitution Draft ({currentCountry.name})
              </span>
              <div className="flex items-center gap-2 font-sans">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 border border-stone-200 hover:border-agave-300 rounded-xl bg-white text-stone-700 hover:text-agave-750 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.coop.copied || "Copied!"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.coop.copyBtn || "Copy Draft"}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-agave-650 hover:bg-agave-750 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.coop.downloadBtn || "Download Draft"}</span>
                </button>
              </div>
            </div>

            <pre className="bg-stone-550/10 border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-inner font-mono text-[10px] leading-relaxed text-stone-850 h-[400px] overflow-y-auto whitespace-pre-wrap select-text selection:bg-agave-200">
              {constitutionText}
            </pre>
            
            <div className="text-center pt-2">
              <button
                onClick={() => setActiveTab('editor')}
                className="text-xs font-semibold text-agave-650 hover:underline cursor-pointer"
              >
                ← Return to configuration parameters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
