import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { 
  Sprout, 
  Search, 
  MapPin, 
  Globe, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  FileCheck, 
  SlidersHorizontal,
  Info,
  Calendar
} from 'lucide-react';
import { ProvenanceLog, ProvenanceStatus } from '../types';
import { COUNTRIES } from '../data/countries';

interface PlantProvenanceLogProps {
  currentCountryId: string;
}

const SEED_LOGS: ProvenanceLog[] = [
  // Zimbabwe
  {
    id: 'prov_1',
    country: 'zimbabwe',
    supplier: 'Oaxaca Elite Semilleros',
    supplierCountry: 'Mexico',
    motherPlantSource: 'Espadín Broadleaf Certified Clone #98',
    motherPlantLocation: 'Santiago Matatlán, Oaxaca',
    variety: 'Agave Espadín',
    quantity: 500,
    importDate: '2026-02-15',
    phytosanitaryStatus: true,
    importPermitStatus: true,
    notes: 'Quarantined successfully at Gwanda nursery block C. Checked and cleared by PQS inspectors for fusarium.',
    status: 'verified',
    batchSerialNumber: 'ZIM-AGV-OAX-0982'
  },
  {
    id: 'prov_2',
    country: 'zimbabwe',
    supplier: 'Karoo Succulent Propagators Ltd',
    supplierCountry: 'South Africa',
    motherPlantSource: 'Blue Weber Offsets Parent Block A',
    motherPlantLocation: 'Graaff-Reinet, Eastern Cape',
    variety: 'Agave Tequilana (Blue Weber)',
    quantity: 1200,
    importDate: '2026-04-10',
    phytosanitaryStatus: true,
    importPermitStatus: true,
    notes: 'Initial yellow leaf margins observed on arrival due to overland transit delays. Recovered well under 50% shadecloth netting.',
    status: 'verified',
    batchSerialNumber: 'ZIM-AGV-SAK-1221'
  },
  {
    id: 'prov_3',
    country: 'zimbabwe',
    supplier: 'Gaborone Private Offsets',
    supplierCountry: 'Botswana',
    motherPlantSource: 'Americana Naturalised wild parent stock',
    motherPlantLocation: 'Kgalagadi Border Margin',
    variety: 'Agave americana',
    quantity: 250,
    importDate: '2026-05-01',
    phytosanitaryStatus: false,
    importPermitStatus: true,
    notes: 'Awaiting secondary soil analysis verification due to missing micro-pathogen paperwork from border check.',
    status: 'pending',
    batchSerialNumber: 'ZIM-AGV-BOT-0331'
  }
];

export default function PlantProvenanceLog({ currentCountryId }: PlantProvenanceLogProps) {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<ProvenanceLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<'current' | 'all-countries'>('current');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Log inputs
  const [supplier, setSupplier] = useState('');
  const [supplierCountry, setSupplierCountry] = useState('Mexico');
  const [motherPlantSource, setMotherPlantSource] = useState('');
  const [motherPlantLocation, setMotherPlantLocation] = useState('');
  const [variety, setVariety] = useState('Agave Espadín');
  const [quantity, setQuantity] = useState<number>(500);
  const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0]);
  const [phytosanitaryStatus, setPhytosanitaryStatus] = useState(true);
  const [importPermitStatus, setImportPermitStatus] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ProvenanceStatus>('pending');
  const [formError, setFormError] = useState('');
  const [logToDeleteId, setLogToDeleteId] = useState<string | null>(null);

  // Loaded current country
  const currentCountry = useMemo(() => {
    return COUNTRIES.find(c => c.id === currentCountryId) || COUNTRIES[0];
  }, [currentCountryId]);

  // Handle load log database
  useEffect(() => {
    try {
      const stored = localStorage.getItem('agave_provenance_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setLogs(parsed);
          return;
        }
      }
      setLogs(SEED_LOGS);
      localStorage.setItem('agave_provenance_logs', JSON.stringify(SEED_LOGS));
    } catch (err) {
      console.error('Failed to load provenance log', err);
      setLogs(SEED_LOGS);
    }
  }, []);

  // Save changes
  const saveLogs = (updated: ProvenanceLog[]) => {
    setLogs(updated);
    localStorage.setItem('agave_provenance_logs', JSON.stringify(updated));
  };

  // Submit new provenance form
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier.trim()) {
      setFormError('Supplier Name is required');
      return;
    }
    setFormError('');

    const randomSerial = `${currentCountry.id.slice(0, 3).toUpperCase()}-AGV-${supplierCountry.slice(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLog: ProvenanceLog = {
      id: 'prov_' + Date.now(),
      country: currentCountryId,
      supplier,
      supplierCountry,
      motherPlantSource: motherPlantSource || 'Unnamed Parent Field',
      motherPlantLocation: motherPlantLocation || 'Oaxaca / regional wild offsets',
      variety,
      quantity,
      importDate,
      phytosanitaryStatus,
      importPermitStatus,
      notes,
      status,
      batchSerialNumber: randomSerial
    };

    const updated = [newLog, ...logs];
    saveLogs(updated);

    // Reset fields
    setSupplier('');
    setSupplierCountry('Mexico');
    setMotherPlantSource('');
    setMotherPlantLocation('');
    setVariety('Agave Espadín');
    setQuantity(500);
    setPhytosanitaryStatus(true);
    setImportPermitStatus(true);
    setNotes('');
    setStatus('pending');
    setShowAddForm(false);
  };

  // Delete log
  const handleDeleteLog = (id: string) => {
    setLogToDeleteId(id);
  };

  const confirmDeleteLog = () => {
    if (logToDeleteId) {
      const updated = logs.filter(l => l.id !== logToDeleteId);
      saveLogs(updated);
      setLogToDeleteId(null);
    }
  };

  // Modify validation status
  const handleUpdateStatus = (id: string, nextStatus: ProvenanceStatus) => {
    const updated = logs.map(l => {
      if (l.id === id) {
        return { ...l, status: nextStatus };
      }
      return l;
    });
    saveLogs(updated);
  };

  // Filter logs logic
  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      // Scope filter
      if (scopeFilter === 'current' && l.country !== currentCountryId) {
        return false;
      }

      // Search matching
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        l.supplier.toLowerCase().includes(query) ||
        l.variety.toLowerCase().includes(query) ||
        l.motherPlantSource.toLowerCase().includes(query) ||
        l.batchSerialNumber.toLowerCase().includes(query) ||
        l.supplierCountry.toLowerCase().includes(query);

      // Status matching
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [logs, currentCountryId, scopeFilter, searchTerm, statusFilter]);

  return (
    <div id="provenance-log-section" className="space-y-6">
      
      {/* Information Header Banner */}
      <div className="bg-emerald-800 text-white rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden">
        {/* Abstract leafy shape */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
          <Sprout className="w-48 h-48" />
        </div>

        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-agave-300" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-agave-300 font-mono">Organic Transparency Traceability</span>
        </div>
        <h3 className="text-base font-bold font-display leading-tight">
          Pan-African Provenance Registry
        </h3>
        <p className="text-xs text-stone-200 leading-relaxed max-w-xl font-medium font-sans">
          {t.provenance.provenanceDesc || "To qualify for premium global food and cosmetic export tariffs, farmers must document the pedigree (mother plant coordinates, species uniformity, and phytosanitary certificates) of every bulbil under cultivation."}
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 p-1 rounded-xl self-start w-full sm:w-auto">
            <button
              onClick={() => setScopeFilter('current')}
              className={`flex-grow sm:flex-grow-0 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                scopeFilter === 'current'
                  ? 'bg-agave-600 text-white shadow-3xs'
                  : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              Only {currentCountry.name}
            </button>
            <button
              onClick={() => setScopeFilter('all-countries')}
              className={`flex-grow sm:flex-grow-0 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                scopeFilter === 'all-countries'
                  ? 'bg-agave-600 text-white shadow-3xs'
                  : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              All Regions
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            id="log-provenance-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-xl bg-agave-650 hover:bg-agave-750 text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.provenance.logBatchBtn || "Record New Bulbil Entry"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-stone-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by supplier, serial, parent source, variety..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-agave-500 font-medium"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-agave-500 text-stone-800 font-semibold"
            >
              <option value="all">All Verification Statuses</option>
              <option value="pending">{t.provenance.pending || "Pending Validation"}</option>
              <option value="verified">{t.provenance.verified || "Verified Clear"}</option>
              <option value="rejected">{t.provenance.rejected || "Rejected"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add form overlay */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-stone-50 border border-emerald-200/80 rounded-2xl p-5 shadow-inner"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-4">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-700" />
                Sovereign Provenance Entry form
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddLog} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Bulbil Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karoo Succulents Ltd"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Supplier Country of Origin</label>
                <input
                  type="text"
                  placeholder="e.g. South Africa, Mexico"
                  value={supplierCountry}
                  onChange={(e) => setSupplierCountry(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Quantity / Offset Count</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Mother Plant Parent Block</label>
                <input
                  type="text"
                  placeholder="e.g. Espadín Clone F-34"
                  value={motherPlantSource}
                  onChange={(e) => setMotherPlantSource(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Mother Plant Physical Location</label>
                <input
                  type="text"
                  placeholder="e.g. Graaff-Reinet Greenhouse 3"
                  value={motherPlantLocation}
                  onChange={(e) => setMotherPlantLocation(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Crop Botanical Variety</label>
                <select
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-850"
                >
                  <option value="Agave Espadín">Agave Espadín (Syllabus standard)</option>
                  <option value="Agave Tequilana (Blue Weber)">Agave Tequilana (Blue Weber)</option>
                  <option value="Agave americana">Agave americana</option>
                  <option value="Agave salmiana">Agave salmiana (Giant Pulquero)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase font-mono">Import Date</label>
                <input
                  type="date"
                  value={importDate}
                  onChange={(e) => setImportDate(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="phyto-status"
                    checked={phytosanitaryStatus}
                    onChange={(e) => setPhytosanitaryStatus(e.target.checked)}
                    className="rounded border-stone-300 text-agave-650 focus:ring-0 w-3.5 h-3.5"
                  />
                  <label htmlFor="phyto-status" className="text-[10px] font-bold text-stone-600 uppercase cursor-pointer select-none">
                    Phytosanitary certificate clear
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="permit-status"
                    checked={importPermitStatus}
                    onChange={(e) => setImportPermitStatus(e.target.checked)}
                    className="rounded border-stone-300 text-agave-650 focus:ring-0 w-3.5 h-3.5"
                  />
                  <label htmlFor="permit-status" className="text-[10px] font-bold text-stone-600 uppercase cursor-pointer select-none">
                    Import Permit active
                  </label>
                </div>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Pedigree Tracing &amp; Bio-Risk Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record fumigation certificates, quarantine observations, government inspection schedules..."
                  className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs font-sans"
                />
              </div>

              <div className="space-y-1 md:col-span-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">Verification Level</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProvenanceStatus)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-850 font-bold"
                >
                  <option value="pending">Pending Quarantine Monitor</option>
                  <option value="verified">Verified and Certified CLEAR</option>
                  <option value="rejected">REJECTED (Biohazard flag!)</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2.5 items-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-50"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-agave-600 text-white rounded-xl text-xs font-semibold hover:bg-agave-700 shadow shadow-agave-600/10 cursor-pointer"
                >
                  Pin to Provenance Register
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logs render grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(item => {
            const countryMeta = COUNTRIES.find(c => c.id === item.country);

            return (
              <div 
                key={item.id} 
                className="bg-white border border-stone-200/90 hover:border-stone-250 rounded-2xl p-4.5 space-y-4 hover:shadow-xs transition-all relative"
              >
                {/* Header card info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">BATCH: {item.batchSerialNumber}</span>
                    <h4 className="text-sm font-bold text-stone-800 line-clamp-1">{item.supplier}</h4>
                    <span className="text-[10px] text-stone-500 font-semibold flex items-center gap-1">
                      <Globe className="w-3 h-3 text-stone-400" /> Imported from <strong>{item.supplierCountry}</strong>
                    </span>
                  </div>

                  {/* Status Dropdowns */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as ProvenanceStatus)}
                      className={`text-[9px] font-bold uppercase tracking-wide border rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer ${
                        item.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-305'
                          : item.status === 'rejected'
                          ? 'bg-red-50 text-red-800 border-red-305'
                          : 'bg-amber-50 text-amber-800 border-amber-305'
                      }`}
                    >
                      <option value="pending">{t.provenance.pending || "Pending Audit"}</option>
                      <option value="verified">{t.provenance.verified || "VERIFIED CLEAR"}</option>
                      <option value="rejected">{t.provenance.rejected || "REJECTED"}</option>
                    </select>

                    <button
                      onClick={() => handleDeleteLog(item.id)}
                      className="p-1 hover:bg-red-50 hover:text-red-500 rounded text-stone-300 transition-all cursor-pointer"
                      title="Remove card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub specifications mapping */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 text-[11px] grid grid-cols-2 gap-2 font-sans font-medium text-stone-650">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block ">{t.provenance.tableVariety || "Agave Variety"}</span>
                    <span className="font-bold text-stone-850">{item.variety}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">{t.provenance.tableQty || "Quantity Delivered"}</span>
                    <span className="font-bold text-stone-850">{item.quantity.toLocaleString()} offsets</span>
                  </div>
                  <div className="col-span-2 border-t border-stone-150 pt-2 grid grid-cols-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">{t.provenance.motherPlant || "Mother Pedigree"}</span>
                      <span>{item.motherPlantSource}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">{t.provenance.tableOrigin || "Mother Farm Location"}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" /> {item.motherPlantLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification badges */}
                <div className="flex flex-wrap gap-2 items-center justify-between text-[10px] font-sans font-semibold pt-2 border-t border-stone-100">
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center gap-1 ${item.phytosanitaryStatus ? 'text-emerald-700' : 'text-stone-450'}`}>
                      {item.phytosanitaryStatus ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-stone-350" />}
                      Phytosanitary Cert {item.phytosanitaryStatus ? 'Clear' : 'Pending'}
                    </span>
                    <span className={`inline-flex items-center gap-1 ${item.importPermitStatus ? 'text-emerald-700' : 'text-stone-450'}`}>
                      {item.importPermitStatus ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-stone-350" />}
                      Import Permit {item.importPermitStatus ? 'Active' : 'Unfiled'}
                    </span>
                  </div>

                  <span className="text-stone-400 text-[9px] flex items-center gap-0.5">
                    <Calendar className="w-3.5 h-3.5" /> Ordered: {item.importDate}
                  </span>
                </div>

                {/* Custom Notes */}
                {item.notes && (
                  <div className="text-[10px] leading-relaxed text-stone-500 mt-2 p-2 bg-stone-50/50 rounded-lg italic font-sans font-medium border-l-2 border-stone-300">
                    "{item.notes}"
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 text-center bg-white border border-stone-200 p-12 rounded-2xl">
            <Sprout className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-600 font-display">No pedigree log entries registered</p>
            <p className="text-xs text-stone-450 mt-1">
              Toggle 'All Regions' or register a custom propagation set under <strong>{currentCountry.name}</strong>.
            </p>
          </div>
        )}
      </div>

      {logToDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-4 animate-[bounce_1s_infinite]">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-1 font-display">
              Delete Pedigree Log?
            </h3>
            <p className="text-xs text-stone-450 leading-relaxed mb-6 font-medium">
              Are you sure you want to delete this provenance tracing log card? Sustainability audit trails require continuous record preservation!
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogToDeleteId(null)}
                className="py-2.5 px-4 rounded-xl border border-stone-250 text-stone-600 hover:bg-stone-50 text-xs font-extrabold tracking-wide transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteLog}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
