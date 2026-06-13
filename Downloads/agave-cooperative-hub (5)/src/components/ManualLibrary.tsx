import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Filter, BookOpenCheck, SlidersHorizontal, ArrowLeftRight, Check, Sparkles, AlertCircle } from 'lucide-react';
import manualData from '../data/manual.json';
import { COUNTRIES } from '../data/countries';
import { useLanguage } from '../LanguageContext';

interface ManualLibraryProps {
  currentCountryId: string;
}

export default function ManualLibrary({ currentCountryId }: ManualLibraryProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1); // Default first open
  const [showFilters, setShowFilters] = useState(false);

  // Get current country information
  const currentCountry = useMemo(() => {
    return COUNTRIES.find(c => c.id === currentCountryId) || COUNTRIES[0];
  }, [currentCountryId]);

  // Dynamically assign realistic country tags to chapters based on their metadata and title.
  // This lets chapters be reusable and filterable across countries!
  const chaptersWithTags = useMemo(() => {
    return manualData.manual.chapters.map(ch => {
      const tags: string[] = ['Core Agave'];
      const text = (ch.title + ' ' + ch.summary + ' ' + ch.content).toLowerCase();

      // Regional mapping logic
      if (text.includes('zimbabwe') || text.includes('matabeleland') || text.includes('chipinge')) {
        tags.push('Zimbabwe');
      }
      if (text.includes('variety') || text.includes('espadín') || text.includes('blue weber') || text.includes('americana')) {
        tags.push('Varieties');
        tags.push('Oaxaca Benchmarks');
      }
      if (text.includes('soil') || text.includes('drainage') || text.includes('clay')) {
        tags.push('Soil Care');
      }
      if (text.includes('irrigation') || text.includes('water') || text.includes('rainfall') || text.includes('borehole')) {
        tags.push('Water Management');
      }
      if (text.includes('pest') || text.includes('weevil') || text.includes('rot') || text.includes('scale')) {
        tags.push('Sanitation & Pests');
      }
      if (text.includes('syrup') || text.includes('sugar') || text.includes('inulin') || text.includes('processing')) {
        tags.push('Syrup Line');
      }
      if (text.includes('fiber') || text.includes('decorticator') || text.includes('rope')) {
        tags.push('Fiber Line');
      }
      if (text.includes('mushroom') || text.includes('bagasse') || text.includes('byproduct')) {
        tags.push('Bagasse Upscaling');
      }
      if (text.includes('cooperative') || text.includes('constitution') || text.includes('ownership')) {
        tags.push('Cooperative');
      }
      if (text.includes('pilot') || text.includes('90-day') || text.includes('roadmap') || text.includes('years')) {
        tags.push('Strategy');
      }

      // If it doesn't have an explicit country tag and is fundamental botanical or general crop science,
      // it applies globally to ALL countries.
      if (!tags.includes('Zimbabwe') && !text.includes('zimbabwe')) {
        tags.push('Pan-African');
      } else {
        // Tag general chapters as applicable to other similar dry nations
        tags.push('Arid Zones');
      }

      return {
        ...ch,
        tags
      };
    });
  }, []);

  // Determine all unique tags for filter dropdowns
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    chaptersWithTags.forEach(ch => {
      ch.tags.forEach(t => set.add(t));
    });
    return ['all', ...Array.from(set)];
  }, [chaptersWithTags]);

  // Filter & Search logic
  const filteredChapters = useMemo(() => {
    return chaptersWithTags.filter(ch => {
      const matchesSearch = 
        ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ch.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ch.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ch.number.toString() === searchTerm;

      const matchesTag = selectedTag === 'all' || ch.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [chaptersWithTags, searchTerm, selectedTag]);

  return (
    <div id="manual-library-section" className="space-y-6">
      {/* Search and Filters panel */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              id="chapter-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.manual.searchPlaceholder || "Search chapters (e.g. soil, weevil, syrup)..."}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 hover:bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agave-500 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-stone-450 hover:text-stone-700 font-semibold"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-2 font-sans">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${
                selectedTag !== 'all' || showFilters
                  ? 'border-agave-200 bg-agave-50 text-agave-700'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-600'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.manual.categoryFilter || "Filters"}</span>
              {selectedTag !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-agave-600"></span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden mt-3 border-t border-stone-100 pt-3"
            >
              <div className="flex flex-wrap gap-1.5 font-sans">
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 self-center mr-1">
                  {t.manual.categoryFilter || "Filter by Tag"}:
                </span>
                {allUniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize border ${
                      selectedTag === tag
                        ? 'bg-agave-700 text-white border-agave-700'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {tag === 'all' ? (t.manual.allCategories || 'All Core Data') : tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Country Specific Warning Strip */}
      <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-3 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 font-sans leading-relaxed">
          <span className="font-bold uppercase tracking-wider text-[10px] block mb-0.5">Country Specific Overlay ({currentCountry.flag} {currentCountry.name})</span>
          While the Core 40 Chapters lay down Oaxaca-standard agronomic benchmarks, we recommend referencing the localized microclimate, compliance codes, and water factors for <strong>{currentCountry.name}</strong> as defined in the companion checklists.
        </div>
      </div>

      {/* Chapter Grid / List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredChapters.length > 0 ? (
          filteredChapters.map((ch) => {
            const isExpanded = expandedChapter === ch.number;
            const isLocalToCountry = ch.tags.includes(currentCountry.name) || ch.tags.includes('Pan-African');

            return (
              <div
                key={ch.number}
                className={`bg-white border rounded-2xl transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-agave-300 shadow-md ring-1 ring-agave-100'
                    : 'border-stone-200 hover:border-stone-250 hover:shadow-xs'
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedChapter(isExpanded ? null : ch.number)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center justify-center bg-agave-100 text-agave-800 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded">
                        CH {ch.number}
                      </span>
                      {isLocalToCountry && (
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-100 px-1 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-0.5 font-sans">
                          <Check className="w-2.5 h-2.5" />
                          Recommended for {currentCountry.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 font-sans leading-tight">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium leading-relaxed font-sans">
                      {ch.summary}
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mt-1 flex-shrink-0 transition-all group-hover:bg-agave-50">
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      className="text-xs font-bold font-mono"
                    >
                      {isExpanded ? '−' : '+'}
                    </motion.div>
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-150 space-y-4">
                        <div className="text-stone-700 text-xs sm:text-sm leading-relaxed p-4 bg-white rounded-xl border border-stone-200/85 whitespace-pre-line shadow-2xs font-sans font-medium italic">
                          "{ch.content}"
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 font-sans">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 mr-1 flex items-center gap-0.5">
                            <BookOpenCheck className="w-3 h-3 text-stone-400" /> Syllabus Tags:
                          </span>
                          {ch.tags.map(t => (
                            <span 
                              key={t}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                                t === currentCountry.name
                                  ? 'bg-agave-100 text-agave-800 border-agave-200'
                                  : 'bg-white text-stone-500 border-stone-200'
                              }`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center bg-white border border-stone-200 p-12 rounded-2xl font-sans">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-600">{t.manual.noResults || "No chapters found"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
