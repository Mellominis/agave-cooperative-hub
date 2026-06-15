import { CountryProfile } from '../types';

export const COUNTRIES: CountryProfile[] = [
  {
    id: 'zimbabwe',
    name: 'Zimbabwe',
    flag: '🇿🇼',
    currency: 'USD/ZWG',
    overview: 'Focused primarily on semi-arid and low-elevation zones such as Matabeleland South and parts of Chipinge. Agave development here serves as a major drought-proofing alternative for communal dryland farms.',
    localRules: {
      labeling: 'Standard food-labelling requirements conform strictly to Zimbabwe Statutory Instrument (SI) 265 of 2002. Labels must detail net volume, physical location of origin, and certified ingredients list.',
      importRules: 'All living offsets, bulbils, or plant stock require an active Phytosanitary certificate verifying freedom from Agave Snout Weevil, issued pre-shipment by PQS (Plant Quarantine Services, Mazowe).',
      cooperativeAct: 'Cooperatives must be formalised and registered under Zimbabwe’s Co-operative Societies Act [Chapter 24:05], aligning with the regional registrar of cooperative networks.',
      originProtection: "Explicit compliance with international terroir guidelines. Protected terms such as 'Mezcal' and 'Tequila' are legally restricted to designated Mexican jurisdictions, requiring local spirits to be branded as 'Agave Spirit'."
    },
    buyerCategories: ['hotels', 'lodges', 'health shops', 'craft buyers', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 1.5,
      establishmentDailyLitresPerPlant: 3.0,
      evaporationRisk: 'high'
    },
    provenanceLogContext: 'Regulated via Ministry of Lands & PQS. Custom clearances must link back to physical phytosanitary quarantine registers.'
  },
  {
    id: 'kenya',
    name: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    overview: 'Targeting drylands of Laikipia, Baringo, and the expansive Rift Valley margins. Sisal cultivation histories here offer solid layout models for high-yield Agave Tequilana setups.',
    localRules: {
      labeling: 'Governed under Kenya Bureau of Standards (KEBS) KS EAS 38. Food labels require full ingredients list in English, nutritional indicators, and explicit distributor details.',
      importRules: 'Requires import clearances from KEPHIS (Kenya Plant Health Inspectorate Service). Strict post-entry quarantine isolation periods apply to prevent systemic rust transfers.',
      cooperativeAct: 'Cooperatives must be initiated and structured according to Kenya Co-operative Societies Act, Cap 490, overseen by the Ministry of Co-operatives.',
      originProtection: "In line with KEBS directives, final spirits must be labeled as 'Kenya Agave Spirits' or 'Spirituous Agave Liquors' to protect traditional denominations."
    },
    buyerCategories: ['hotels', 'lodges', 'health shops', 'craft buyers', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 1.8,
      establishmentDailyLitresPerPlant: 3.5,
      evaporationRisk: 'medium'
    },
    provenanceLogContext: 'Regulated by KEPHIS. Transports from Mombasa port are tracked under quarantine logs.'
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    flag: '🇷🇼',
    currency: 'RWF',
    overview: 'Focused on drier sectors of the Eastern Province, particularly Bugesera and Kayonza districts. High land density makes well-organized smallholder cooperatives essential.',
    localRules: {
      labeling: 'Managed under Rwanda Standards Board (RSB) labelling protocols. Package text should support both French and Kinyarwanda/English options.',
      importRules: 'Under RAB (Rwanda Agriculture & Animal Resources Development Board) protocols. Living tissue culture offcuts must hold import and pest clearance stamps.',
      cooperativeAct: 'Governed by Rwanda Cooperative Law N° 50/2021, detailing micro-lending guidelines and structural oversight boards.',
      originProtection: 'Adheres to strict geographical origin boundaries. Spirits are bottled under localized names to uphold fair competition standards.'
    },
    buyerCategories: ['hotels', 'lodges', 'health shops', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 1.2,
      establishmentDailyLitresPerPlant: 2.8,
      evaporationRisk: 'low'
    },
    provenanceLogContext: 'Monitored by RAB. Focuses on tissue culture offset tracking for maximum uniformity.'
  },
  {
    id: 'south_africa',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    overview: 'Centered on the Great Karoo (Graaff-Reinet region) and Limpopo. The Karoo is home to several well-known dryland distilleries, making this the most mature commercial ecosystem.',
    localRules: {
      labeling: 'Complies with Consumer Protection Act (CPA) and Labelling Regulations R146. Detailed food declarations must identify GMO content and allergen panels.',
      importRules: 'Requires permits from DALRRD (Department of Agriculture, Land Reform and Rural Development) under agricultural biosecurity mandates.',
      cooperativeAct: 'Incorporated under Co-operatives Act No. 14 of 2005. Registries are logged through CIPC (Companies and Intellectual Property Commission).',
      originProtection: "Governed strictly by SA Liquor Products Act 60 of 1989. Forbids using the terms 'Mezcal' or 'Tequila' on locally bottled products, calling them exclusively 'Agave Spirit'."
    },
    buyerCategories: ['hotels', 'lodges', 'health shops', 'craft buyers', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 1.4,
      establishmentDailyLitresPerPlant: 3.2,
      evaporationRisk: 'high'
    },
    provenanceLogContext: 'DALRRD phytosanitary records and SADC regional registry tracking.'
  },
  {
    id: 'namibia',
    name: 'Namibia',
    flag: '🇳🇦',
    currency: 'NAD',
    overview: 'Concentrated in Hardap and Oshikoto region trials. The extreme arid environments here require advanced soil-moisture preservation and strict water budgeting.',
    localRules: {
      labeling: 'Regulated under Namibia Standards Institution (NSI). Explicit trade metrics and country of origin markers must be stamped clearly.',
      importRules: 'Importation certificates from the Ministry of Agriculture, Water and Land Reform (MAWLR). Requires thermal sterilization and root inspect stamps.',
      cooperativeAct: 'Cooperatives are registered and administered under Namibia’s Co-operative Act 23 of 1996, with annual audited operational logs.',
      originProtection: "In line with NAMRA customs and local laws, spirits must use the designation 'Namibian Agave Spirits' to avoid international protected origin conflict."
    },
    buyerCategories: ['hotels', 'lodges', 'craft buyers', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 1.6,
      establishmentDailyLitresPerPlant: 3.8,
      evaporationRisk: 'high'
    },
    provenanceLogContext: 'Permits handled by MAWLR. Hardap research farm serves as key regional trial station.'
  },
  {
    id: 'botswana',
    name: 'Botswana',
    flag: '🇧🇼',
    currency: 'BWP',
    overview: 'Trials centered around Kgalagadi sands and Central district fields. High solar radiation and sandy soils require drought-hardy root selection.',
    localRules: {
      labeling: 'Food items must be marked according to Botswana Bureau of Standards (BOBS) guidelines, indicating manufacturer contact details and batch stamps.',
      importRules: 'Approved bio-safety import certificate administered under the Ministry of Agricultural Development and Food Security.',
      cooperativeAct: 'Drafted in alignment with Botswana Co-operative Societies Act (Cap 42:04) centering on local dryland farming syndicates.',
      originProtection: "Local regulations restrict labels to 'Agave Spirits' or 'Kgalagadi Agave liquors' under trade protection agreements."
    },
    buyerCategories: ['hotels', 'lodges', 'craft buyers', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 2.0,
      establishmentDailyLitresPerPlant: 4.0,
      evaporationRisk: 'high'
    },
    provenanceLogContext: 'Landed offsets must be cleared by Botswana Customs and Ministry of Ag.'
  },
  {
    id: 'zambia',
    name: 'Zambia',
    flag: '🇿🇲',
    currency: 'ZMW',
    overview: 'Focused on Southern Province dry valleys (Choma, Gwembe area). Offers a resilient replacement crop for maize-reliant rural communities during El Niño eras.',
    localRules: {
      labeling: 'Complies with Zambia Bureau of Standards (ZABS) ZS 190. Package claims must state net weight, distributor networks, and clear best-before timelines.',
      importRules: 'Import permits are verified by Mount Makulu Central Research Station. Quarantine isolates must register zero fungal stem rots pre-planting.',
      cooperativeAct: 'Administered under Zambia Co-operative Societies Act of 1998, requiring localized management bylaws.',
      originProtection: "Compliance guidelines dictate clear isolation of product categories. Rejects Mexican branding and permits only local 'Zambian Agave Distillate'."
    },
    buyerCategories: ['hotels', 'lodges', 'health shops', 'craft buyers', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 1.5,
      establishmentDailyLitresPerPlant: 3.2,
      evaporationRisk: 'medium'
    },
    provenanceLogContext: 'Sourced log coordinates checked against Mt Makulu quarantine permissions.'
  },
  {
    id: 'mozambique',
    name: 'Mozambique',
    flag: '🇲🇿',
    currency: 'MZN',
    overview: 'Targeting sub-arid margins in Gaza and Tete provinces. Warm sandy soils are perfect for agave roots, but heavy rainfall seasons must be bypassed.',
    localRules: {
      labeling: 'Supervised by INAE (National Inspectorate of Economic Activities). Requirements specify Portuguese details of sugar weight and production dates.',
      importRules: 'Clearance from MADER (Ministry of Agriculture and Rural Development), with complete fumigation and health declarations upon entry.',
      cooperativeAct: 'Cooperatives are formed and run under Decree 46/2014, facilitating shared processing mills and collective sales rights.',
      originProtection: "Complies with commercial guidelines limiting protected designations to certified imports. Local products are described as 'Bebida de Agave'."
    },
    buyerCategories: ['hotels', 'lodges', 'craft buyers', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 1.7,
      establishmentDailyLitresPerPlant: 3.6,
      evaporationRisk: 'medium'
    },
    provenanceLogContext: 'MADER phytosanitary stamp confirmation and Maputo border log entries.'
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    flag: '🇹🇿',
    currency: 'TZS',
    overview: 'Exploratory fields in Dodoma drylands and Tanga region coastal boundaries. Captures historical knowledge from Tanzania’s legendary sisal production centers.',
    localRules: {
      labeling: 'Governed by TBS (Tanzania Bureau of Standards) codes. Standard food labels must detail ingredients in Swahili or English with explicit manufacturing batches.',
      importRules: 'Requires permits from the Ministry of Agriculture and TPRI (Tropical Pesticides Research Institute) to confirm absence of fungal rots.',
      cooperativeAct: 'Legally organized as Agricultural Marketing Co-operative Societies (AMCOS) under the Cooperative Societies Act, No. 6 of 2013.',
      originProtection: "Labels must adhere strictly to local designations. Avoids using tequila-derived brands and implements 'Tanzanian Agave Spirit' styling."
    },
    buyerCategories: ['hotels', 'lodges', 'health shops', 'craft buyers', 'distributors'],
    waterPlanningAssumptions: {
      nurseryDailyLitresPerPlant: 1.3,
      establishmentDailyLitresPerPlant: 3.0,
      evaporationRisk: 'low'
    },
    provenanceLogContext: 'Managed via AMCOS structures in Tanga or Dodoma with TPRI pest audit stamps.'
  }
];

export const DEFAULT_COUNTRY = COUNTRIES[0];
