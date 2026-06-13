import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Tag, 
  TrendingUp, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Buyer, BuyerCategory, BuyerStatus } from '../types';
import { COUNTRIES } from '../data/countries';
import { useLanguage } from '../LanguageContext';

interface MarketProbeToolProps {
  currentCountryId: string;
}

const SEED_BUYERS: Buyer[] = [
  // Zimbabwe
  {
    id: 'b1',
    country: 'zimbabwe',
    buyerName: 'Victoria Falls Safari Lodge',
    buyerType: 'lodges',
    location: 'Victoria Falls',
    contactPerson: 'Sandra Nkomo',
    phone: '+263 13 44751',
    email: 'purchasing@vicfallsinn.co.zw',
    productInterest: 'Premium Agave Syrup for cocktail bars and gourmet cuisine.',
    notes: 'Strong interest in organic native syrups. Requests 20L trial batch.',
    status: 'sample_sent',
    createdAt: '2026-05-10T10:00:00.000Z'
  },
  {
    id: 'b2',
    country: 'zimbabwe',
    buyerName: 'Bulawayo Organic Health Hub',
    buyerType: 'health shops',
    location: 'Bulawayo Suburbs',
    contactPerson: 'Farai Moyo',
    phone: '+263 9 224151',
    email: 'info@byoorganics.org',
    productInterest: 'Low-GI Liquid Inulin Syrup for consumer jars.',
    notes: 'Prefers 500ml squeezable retail bottles. Demands SI 265 certification.',
    status: 'active_buyer',
    createdAt: '2026-06-01T14:30:00.000Z'
  },
  {
    id: 'b3',
    country: 'zimbabwe',
    buyerName: 'Matabeleland Woven Arts Guild',
    buyerType: 'craft buyers',
    location: 'Gwanda District',
    contactPerson: 'Sithandekile Sibanda',
    phone: '+263 284 22001',
    email: 'crafts@gwandaagave.co.zw',
    productInterest: 'Brushed Sisal-Grade Agave Leaves Fiber.',
    notes: 'High tensile strength required for basketweaving cooperatives. Pays cash on delivery.',
    status: 'active_buyer',
    createdAt: '2026-05-20T09:00:00.000Z'
  },
  // South Africa
  {
    id: 'b4',
    country: 'south_africa',
    buyerName: 'Karoo Craft Distillery',
    buyerType: 'distributors',
    location: 'Graaff-Reinet',
    contactPerson: 'Pieter de Wet',
    phone: '+27 49 892 1100',
    email: 'pieter@karoodistill.co.za',
    productInterest: 'Raw Hydrolyzed Agave Sugars/Juice and bulk cooked pinas.',
    notes: 'Established boutique distiller. Seeking reliable local source to bypass Mexican import lag.',
    status: 'meeting_set',
    createdAt: '2026-05-18T16:20:00.000Z'
  },
  // Kenya
  {
    id: 'b5',
    country: 'kenya',
    buyerName: 'Nairobi Eco-Wellness Shop',
    buyerType: 'health shops',
    location: 'Karen, Nairobi',
    contactPerson: 'Jane Wambui',
    phone: '+254 20 551061',
    email: 'wambui@ecowellness.ke',
    productInterest: 'Organic Sweet Agave Nectar',
    notes: 'Seeking plastic-free wholesale container supplies. Values smallholder provenance certificates.',
    status: 'prospect',
    createdAt: '2026-06-05T11:45:00.000Z'
  }
];

export default function MarketProbeTool({ currentCountryId }: MarketProbeToolProps) {
  const { t } = useLanguage();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<'current' | 'all-countries'>('current');

  // Input fields for New Buyer
  const [newBuyerData, setNewBuyerData] = useState<Omit<Buyer, 'id' | 'country' | 'createdAt'>>({
    buyerName: '',
    buyerType: 'hotels',
    location: '',
    contactPerson: '',
    phone: '',
    email: '',
    productInterest: '',
    notes: '',
    status: 'prospect'
  });

  const [formError, setFormError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [buyerToDeleteId, setBuyerToDeleteId] = useState<string | null>(null);

  // Get current country information
  const currentCountry = useMemo(() => {
    return COUNTRIES.find(c => c.id === currentCountryId) || COUNTRIES[0];
  }, [currentCountryId]);

  // Load buyers on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('agave_market_probe_buyer_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setBuyers(parsed);
          return;
        }
      }
      // If none, default to SEED_BUYERS
      setBuyers(SEED_BUYERS);
      localStorage.setItem('agave_market_probe_buyer_list', JSON.stringify(SEED_BUYERS));
    } catch (err) {
      console.error('Failed to load buyer list', err);
      setBuyers(SEED_BUYERS);
    }
  }, []);

  // Save buyers to localStorage helper
  const saveBuyers = (updatedList: Buyer[]) => {
    setBuyers(updatedList);
    localStorage.setItem('agave_market_probe_buyer_list', JSON.stringify(updatedList));
  };

  // Add Buyer Submit Handler
  const handleAddBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuyerData.buyerName.trim()) {
      setFormError('Buyer Name is required');
      return;
    }
    setFormError('');

    const created: Buyer = {
      ...newBuyerData,
      id: 'buyer_' + Date.now(),
      country: currentCountryId, // Bound to current country context!
      createdAt: new Date().toISOString()
    };

    const updated = [created, ...buyers];
    saveBuyers(updated);

    // Reset Form
    setNewBuyerData({
      buyerName: '',
      buyerType: 'hotels',
      location: '',
      contactPerson: '',
      phone: '',
      email: '',
      productInterest: '',
      notes: '',
      status: 'prospect'
    });
    setShowAddForm(false);
  };

  // Delete Buyer Handler
  const handleDeleteBuyer = (id: string) => {
    setBuyerToDeleteId(id);
  };

  const confirmDeleteBuyer = () => {
    if (buyerToDeleteId) {
      const updated = buyers.filter(b => b.id !== buyerToDeleteId);
      saveBuyers(updated);
      setBuyerToDeleteId(null);
    }
  };

  // Status Change trigger
  const handleUpdateStatus = (id: string, nextStatus: BuyerStatus) => {
    const updated = buyers.map(b => {
      if (b.id === id) {
        return { ...b, status: nextStatus };
      }
      return b;
    });
    saveBuyers(updated);
  };

  // Filter & Search Logic
  const filteredBuyers = useMemo(() => {
    return buyers.filter(b => {
      // Country scope check
      if (scopeFilter === 'current' && b.country !== currentCountryId) {
        return false;
      }

      // Search match
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        b.buyerName.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query) ||
        b.contactPerson.toLowerCase().includes(query) ||
        b.productInterest.toLowerCase().includes(query) ||
        b.notes.toLowerCase().includes(query);

      // Type matcher
      const matchesType = selectedType === 'all' || b.buyerType === selectedType;

      // Status matcher
      const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [buyers, currentCountryId, scopeFilter, searchTerm, selectedType, selectedStatus]);

  // Aggregated Stats
  const stats = useMemo(() => {
    const filteredByCountry = buyers.filter(b => b.country === currentCountryId);
    return {
      activeBuyerCount: filteredByCountry.filter(b => b.status === 'active_buyer').length,
      sampleSentCount: filteredByCountry.filter(b => b.status === 'sample_sent').length,
      prospectsCount: filteredByCountry.filter(b => b.status === 'prospect').length,
      totalCount: filteredByCountry.length
    };
  }, [buyers, currentCountryId]);

  return (
    <div id="market-probe-container" className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-stone-200 p-4 rounded-xl shadow-xs font-sans">
        <div className="text-center p-2 border-r border-stone-100 last:border-0">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">{t.probe.locationLabel || "Target Marketplace"}</span>
          <span className="text-base font-bold text-stone-800 flex items-center justify-center gap-1 mt-0.5">
            {currentCountry.flag} {currentCountry.name}
          </span>
        </div>
        <div className="text-center p-2 border-r border-stone-100 last:border-0">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">{t.probe.active_buyer || "Active buyers"}</span>
          <span className="text-base font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            {stats.activeBuyerCount}
          </span>
        </div>
        <div className="text-center p-2 border-r border-stone-100 last:border-0">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">{t.probe.sample_sent || "Samples Sent"}</span>
          <span className="text-base font-bold text-amber-600 block mt-0.5 font-sans">
            {stats.sampleSentCount}
          </span>
        </div>
        <div className="text-center p-2">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">{t.probe.searchAndLog || "Total Active Records"}</span>
          <span className="text-base font-bold text-stone-700 block mt-0.5">
            {stats.totalCount}
          </span>
        </div>
      </div>

      {/* Controller Controls Toolbar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 p-1 rounded-xl self-start w-full sm:w-auto font-sans">
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
            id="add-buyer-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-xl bg-agave-650 hover:bg-agave-700 text-white text-xs font-semibold transition-all shadow-md shadow-agave-600/10 cursor-pointer font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>{t.probe.addBuyerBtn}</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-stone-100 font-sans">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.probe.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-agave-500 font-medium text-stone-800"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-agave-500 text-stone-800 font-semibold"
            >
              <option value="all">{t.probe.allStatuses || "All Channels"}</option>
              <option value="hotels">{t.probe.hotels || "Hotels"}</option>
              <option value="lodges">{t.probe.lodges || "Lodges"}</option>
              <option value="health shops">{t.probe.health_shops || "Health Shops"}</option>
              <option value="craft buyers">{t.probe.craft_buyers || "Craft Buyers"}</option>
              <option value="distributors">{t.probe.distributors || "Distributors"}</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-agave-500 text-stone-800 font-semibold2"
            >
              <option value="all">All States</option>
              <option value="prospect">{t.probe.prospect}</option>
              <option value="contacted">{t.probe.contacted}</option>
              <option value="meeting_set">{t.probe.meeting_set}</option>
              <option value="sample_sent">{t.probe.sample_sent}</option>
              <option value="active_buyer">{t.probe.active_buyer}</option>
              <option value="inactive">{t.probe.inactive}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add New Buyer Interactive Form Overlay */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-stone-50 border border-agave-200/80 rounded-2xl p-5 shadow-inner font-sans"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-agave-650" />
                {t.probe.buyerNameLabel || "Registry Form"} ({currentCountry.name})
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-mono font-bold px-1.5 py-0.5 rounded cursor-pointer"
              >
                {t.probe.cancelBtn || "Cancel"}
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-lg flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddBuyer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">{t.probe.buyerNameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harare High-Gourmet Delicatessen"
                  value={newBuyerData.buyerName}
                  onChange={(e) => setNewBuyerData({...newBuyerData, buyerName: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">{t.probe.buyerTypeLabel}</label>
                <select
                  value={newBuyerData.buyerType}
                  onChange={(e) => setNewBuyerData({...newBuyerData, buyerType: e.target.value as BuyerCategory})}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-semibold"
                >
                  <option value="hotels">{t.probe.hotels || "Hotels Only"}</option>
                  <option value="lodges">{t.probe.lodges || "Lodges Only"}</option>
                  <option value="health shops">{t.probe.health_shops || "Health Specialty"}</option>
                  <option value="craft buyers">{t.probe.craft_buyers || "Cracft Guilds"}</option>
                  <option value="distributors">{t.probe.distributors || "Distributors Only"}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">{t.probe.locationLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. Victoria Falls Resort Strip"
                  value={newBuyerData.location}
                  onChange={(e) => setNewBuyerData({...newBuyerData, location: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">{t.probe.contactPersonLabel}</label>
                <input
                  type="text"
                  placeholder="Full name of representative"
                  value={newBuyerData.contactPerson}
                  onChange={(e) => setNewBuyerData({...newBuyerData, contactPerson: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">{t.probe.phoneLabel}</label>
                <input
                  type="text"
                  placeholder="+263 7..."
                  value={newBuyerData.phone}
                  onChange={(e) => setNewBuyerData({...newBuyerData, phone: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">{t.probe.emailLabel}</label>
                <input
                  type="email"
                  placeholder="orders@establishment.com"
                  value={newBuyerData.email}
                  onChange={(e) => setNewBuyerData({...newBuyerData, email: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">{t.probe.productInterestLabel}</label>
                <input
                  type="text"
                  placeholder="Specific requirements (e.g., Raw concentrated syrup in 25L drums compliance)"
                  value={newBuyerData.productInterest}
                  onChange={(e) => setNewBuyerData({...newBuyerData, productInterest: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-agave-500 font-semibold"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] font-bold text-stone-500 uppercase">{t.probe.notesLabel}</label>
                <textarea
                  rows={2}
                  placeholder="Provide logs of interactions, required certifications (SAZ, KEBS), or samples dispatched..."
                  value={newBuyerData.notes}
                  onChange={(e) => setNewBuyerData({...newBuyerData, notes: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-agave-500 font-sans font-medium"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-xs font-semibold hover:bg-stone-100 cursor-pointer"
                >
                  {t.probe.cancelBtn || "Discard"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-agave-600 text-white rounded-xl text-xs font-semibold hover:bg-agave-700 shadow shadow-agave-600/10 cursor-pointer"
                >
                  {t.probe.saveBtn || "Insert to Country Database"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBuyers.length > 0 ? (
          filteredBuyers.map((buyer) => {
            const countryMeta = COUNTRIES.find(c => c.id === buyer.country);

            return (
              <div
                key={buyer.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 hover:shadow-sm transition-all space-y-4 shadow-3xs hover:border-stone-300 relative font-sans"
              >
                {/* Header Block */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 bg-stone-100 border border-stone-200 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md text-stone-600">
                      <Tag className="w-2.5 h-2.5" />
                      {t.probe[buyer.buyerType] || buyer.buyerType}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 leading-tight">
                      {buyer.buyerName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{buyer.location}</span>
                      {scopeFilter === 'all-countries' && (
                        <span className="inline-flex items-center gap-1 bg-agave-50 p-0.5 px-1 rounded text-stone-600 font-bold border border-agave-100">
                          {countryMeta?.flag} {countryMeta?.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Indicator Dropdowns */}
                  <div className="flex flex-col items-end gap-1">
                    <select
                      value={buyer.status}
                      onChange={(e) => handleUpdateStatus(buyer.id, e.target.value as BuyerStatus)}
                      className={`text-[10px] font-bold border rounded-lg px-2 py-1 focus:outline-none transition-all cursor-pointer ${
                        buyer.status === 'active_buyer'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-250/70'
                          : buyer.status === 'sample_sent'
                          ? 'bg-amber-50 text-amber-800 border-amber-250'
                          : buyer.status === 'meeting_set'
                          ? 'bg-indigo-50 text-indigo-850 border-indigo-200'
                          : buyer.status === 'contacted'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : buyer.status === 'prospect'
                          ? 'bg-stone-50 text-stone-600 border-stone-250'
                          : 'bg-stone-50 text-stone-500 border-stone-200/80'
                      }`}
                    >
                      <option value="prospect">{t.probe.prospect}</option>
                      <option value="contacted">{t.probe.contacted}</option>
                      <option value="meeting_set">{t.probe.meeting_set}</option>
                      <option value="sample_sent">{t.probe.sample_sent}</option>
                      <option value="active_buyer">{t.probe.active_buyer}</option>
                      <option value="inactive">{t.probe.inactive}</option>
                    </select>

                    <button
                      onClick={() => handleDeleteBuyer(buyer.id)}
                      title="Delete card"
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-stone-350 transition-all cursor-pointer self-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Technical / Product Specifications */}
                <div className="bg-stone-50/50 p-3 rounded-xl border border-stone-150 space-y-2 text-[11px] leading-relaxed">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">{t.probe.productInterestLabel || "Product Focus"}</span>
                    <p className="text-stone-750 font-medium font-sans">
                      {buyer.productInterest || 'General unrefined agave syrup requirements.'}
                    </p>
                  </div>
                  {buyer.notes && (
                    <div className="pt-2 border-t border-stone-100 space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">{t.probe.notesLabel || "Negotiation Log Entry"}</span>
                      <p className="text-stone-600 font-sans italic">
                        "{buyer.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Card Row */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-sans font-semibold pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-stone-600 truncate font-sans">
                    <User className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate capitalize">{buyer.contactPerson || 'Purchasing Manager'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600 truncate justify-end">
                    <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{buyer.phone || 'No Phone Registered'}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-stone-600 truncate">
                    <Mail className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{buyer.email || 'orders@establishment.com'}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 text-center bg-white border border-stone-200 p-12 rounded-2xl font-sans">
            <Building className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-600">{t.probe.noResults || "No matching buyers mapped"}</p>
          </div>
        )}
      </div>

      {buyerToDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-4 animate-[bounce_1s_infinite]">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-1 font-display">
              {t.probe.deleteConfirmTitle || "Delete Buyer Card?"}
            </h3>
            <p className="text-xs text-stone-450 leading-relaxed mb-6 font-medium">
              Are you sure you want to remove this buyer registry card? This action is local and cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBuyerToDeleteId(null)}
                className="py-2.5 px-4 rounded-xl border border-stone-250 text-stone-600 hover:bg-stone-50 text-xs font-extrabold tracking-wide transition-all cursor-pointer"
              >
                {t.probe.cancelBtn || "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmDeleteBuyer}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {t.probe.deleteConfirmBtn || "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
