export interface TranslationKeys {
  common: {
    appTitle: string;
    appSubtitle: string;
    pilotNetwork: string;
    guestMode: string;
    resetProfile: string;
    cancel: string;
    yesReset: string;
    logout: string;
    registeredAs: string;
    smallholder: string;
    resetDesc: string;
    loadingText: string;
    madeWith: string;
    forSmallholders: string;
    copyrightText: string;
    customizedFor: string;
  };
  tabs: {
    manual: string;
    sop: string;
    probe: string;
    planner: string;
    provenance: string;
    pest: string;
    costing: string;
    constitution: string;
    compliance: string;
    telemetry: string;
  };
  landing: {
    title: string;
    subtitle: string;
    description: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
    gatedTitle: string;
    gatedDesc: string;
    infoSopTitle: string;
    infoSopDesc: string;
    infoCrmTitle: string;
    infoCrmDesc: string;
    infoWaterTitle: string;
    infoWaterDesc: string;
    infoTraceTitle: string;
    infoTraceDesc: string;
  };
  signup: {
    title: string;
    description: string;
    firstName: string;
    lastName: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    district: string;
    districtPlaceholder: string;
    roleOrInterest: string;
    rolePlaceholder: string;
    agree: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    logsTitle: string;
    activeRelays: string;
    firestoreSync: string;
    emailDispatch: string;
    sheetsBackup: string;
    connected: string;
    emailed: string;
    logged: string;
    failed: string;
    skipped: string;
    unlockResources: string;
    configKeysHint: string;
    errFirstName: string;
    errLastName: string;
    errEmail: string;
    errEmailValid: string;
    errDistrict: string;
    errRole: string;
    errTerms: string;
    errSubmit: string;
    roleFarmer: string;
    roleProcessor: string;
    roleAgronomist: string;
    roleDistributor: string;
  };
  manual: {
    libraryTitle: string;
    libraryDesc: string;
    searchPlaceholder: string;
    categoryFilter: string;
    allCategories: string;
    readTime: string;
    downloadCta: string;
    noResults: string;
    agronomyCategory: string;
    regulatoryCategory: string;
    processingCategory: string;
    cooperativeCategory: string;
  };
  sop: {
    standardProcedures: string;
    sopSub: string;
    searchPlaceholder: string;
    category: string;
    timeline: string;
    complianceBody: string;
    steps: string;
    notes: string;
    warningTitle: string;
    biosecurity: string;
    scaleup: string;
    extraction: string;
    sisal: string;
    trade: string;
  };
  probe: {
    marketProbeTitle: string;
    marketProbeDesc: string;
    searchAndLog: string;
    searchPlaceholder: string;
    statusFilter: string;
    allStatuses: string;
    testLogBtn: string;
    addBuyerBtn: string;
    buyerNameLabel: string;
    buyerTypeLabel: string;
    locationLabel: string;
    contactPersonLabel: string;
    phoneLabel: string;
    emailLabel: string;
    productInterestLabel: string;
    notesLabel: string;
    cancelBtn: string;
    saveBtn: string;
    tableHeaderName: string;
    tableHeaderType: string;
    tableHeaderLocation: string;
    tableHeaderStatus: string;
    tableHeaderContact: string;
    noBuyers: string;
    prospect: string;
    contacted: string;
    meeting_set: string;
    sample_sent: string;
    active_buyer: string;
    inactive: string;
    hotels: string;
    lodges: string;
    health_shops: string;
    craft_buyers: string;
    distributors: string;
  };
  planner: {
    waterPlannerTitle: string;
    waterPlannerDesc: string;
    waterSourceLabel: string;
    dailyLitresLabel: string;
    plantCountLabel: string;
    nurseryPeriodLabel: string;
    establishmentPeriodLabel: string;
    runCalculations: string;
    dailyWaterHeading: string;
    dailyWaterNeed: string;
    totalNurseryNeed: string;
    totalEstablishmentNeed: string;
    feasibilityVerdict: string;
    feasibleTitle: string;
    infeasibleTitle: string;
    riskRating: string;
    lowRisk: string;
    moderateRisk: string;
    highRisk: string;
    criticalRisk: string;
    borehole: string;
    rainwater: string;
    river_pump: string;
    municipal: string;
    deep_well: string;
  };
  provenance: {
    provenanceTitle: string;
    provenanceDesc: string;
    logBatchBtn: string;
    batchNo: string;
    supplier: string;
    motherPlant: string;
    phytoBeenChecked: string;
    importPermit: string;
    batchNotes: string;
    cancelBtn: string;
    submitProductBtn: string;
    pending: string;
    verified: string;
    rejected: string;
    tableBatch: string;
    tableSupplier: string;
    tableOrigin: string;
    tableVariety: string;
    tableQty: string;
    tableDate: string;
    tablePhyto: string;
    tableStatus: string;
    noLogs: string;
  };
  pest: {
    diagnosticTitle: string;
    diagnosticDesc: string;
    identifyPests: string;
    selectSymptom: string;
    severityLabel: string;
    remedyAction: string;
    followUpAction: string;
    isolatingRequired: string;
    yesIsolate: string;
    yesRemove: string;
    noActionRequired: string;
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
  costing: {
    pricingCalculator: string;
    pricingDesc: string;
    areaHectares: string;
    targetDensity: string;
    seedlingCost: string;
    laborCost: string;
    estimatedBudget: string;
    costHectare: string;
    densityHelp: string;
    totalPlants: string;
    seedlingTotal: string;
    laborTotal: string;
    maintenanceTotal: string;
    infrastructureTotal: string;
    totalOpCost: string;
    exportCta: string;
    currencyUSD: string;
  };
  calculator: {
    calcTitle: string;
    calcDesc: string;
    modelParams: string;
    plantSize: string;
    costPerBulbil: string;
    hourlyLabor: string;
    processingCapLabel: string;
    totalStartup: string;
    roiYield: string;
    farmShare: string;
    nurseryShare: string;
    processingShare: string;
  };
  constitution: {
    constitutionTitle: string;
    constitutionDesc: string;
    generateDraft: string;
    memberRights: string;
    coopBylaws: string;
    coopName: string;
    coopNamePlaceholder: string;
    shareValue: string;
    boardMembers: string;
    downloadDraft: string;
    previewTitle: string;
  };
  coop: {
    coopTitle: string;
    coopDesc: string;
    editorTab: string;
    previewTab: string;
    compileConstitution: string;
    copied: string;
    copyBtn: string;
    downloadBtn: string;
  };
  compliance: {
    checklistTitle: string;
    checklistDesc: string;
    regionalExport: string;
    standardSadc: string;
    statusCompleted: string;
    statusPending: string;
    localRulesTitle: string;
    labelingLaw: string;
    quarantineLaw: string;
    coopLaw: string;
    complianceTitle: string;
    complianceDesc: string;
    allMilestones: string;
    mandatoryOnly: string;
    verifiedCompliant: string;
    inspectionCheckText: string;
    progressLabel: string;
    metLabel: string;
    mandatoryBadge: string;
    phase1: string;
    phase2: string;
    phase3: string;
  };
  telemetry: {
    fieldSoilTelemetry: string;
    dynamicBrixReadings: string;
    simulatedBrix: string;
    fieldSoilMoisture: string;
    liveHeader: string;
    boreholePressure: string;
    ambientTemp: string;
    soilPh: string;
    sensorLive: string;
    simulatedControls: string;
    increaseHeat: string;
    wateringPulse: string;
    fertilizerDrip: string;
    telemetryTitle: string;
    telemetryDesc: string;
    pullLateFeeds: string;
    leafSugarContent: string;
    sugarBrixNotice: string;
    avgSoilMoisture: string;
    soilMoistureNotice: string;
    avgHeight: string;
    stemCore: string;
    heightNotice: string;
    twelveMonthCurve: string;
    curveTooltip: string;
    selectedMonth: string;
  };
}

export const translations: Record<'en' | 'sn' | 'nd', TranslationKeys> = {
  en: {
    common: {
      appTitle: "Mellow Minis Hub",
      appSubtitle: "ZIMBABWE'S FIRST AGAVE INITIATIVE",
      pilotNetwork: "Zimbabwe Pilot Network",
      guestMode: "Guest Preview Mode",
      resetProfile: "Reset Local Profile?",
      cancel: "No, Keep",
      yesReset: "Yes, Reset",
      logout: "Reset",
      registeredAs: "Registered Grow-Group",
      smallholder: "Smallholder",
      resetDesc: "Are you sure you want to reset your local registration credentials and return to Guest Preview Mode?",
      loadingText: "Configuring Agave Syllabus...",
      madeWith: "Made with",
      forSmallholders: "for smallholder agriculturalists.",
      copyrightText: "Agave Pan-African Sustainable Development Syndicate. Mapped for:",
      customizedFor: "Customized for district",
    },
    tabs: {
      manual: "Agave Manual",
      sop: "SOP Handbooks",
      probe: "Market Probe",
      planner: "Water Planner",
      provenance: "Provenance Log",
      pest: "Pest Diagnostics",
      costing: "Costing Simulator",
      constitution: "Coop Constitution",
      compliance: "Compliance Roadmap",
      telemetry: "Yield Telemetry",
    },
    landing: {
      title: "Mellow Minis Agave Hub",
      subtitle: "Zimbabwe Pilot Network",
      description: "Welcome to the specialized member hub for Mellow Minis. This custom pilot space is engineered for smallholder growers, local operators, and agro-processors cultivating drought-resilient agave in arid sectors of Zimbabwe.",
      pillar1Title: "Regulatory Framework",
      pillar1Desc: "Standard operating manuals are aligned with Zimbabwe raw food packaging SI 265 of 2002 and cooperative structures registered under the national Co-operative Societies Act.",
      pillar2Title: "Market Distribution",
      pillar2Desc: "Interactive routing directories mapping hotels, lodges, health specialty shops, craft guilds, and beverage distributors expressing product interests.",
      pillar3Title: "Hydrology & Climate",
      pillar3Desc: "Site planning specifically calibrated for Matabeleland South. Features a water demand calculator assessing solar borehole logs and local evaporation limits.",
      pillar4Title: "Operator Database",
      pillar4Desc: "Complete diagnostic trees, costing sims, and import logs. High-security profiles maintain trace credentials for smallholder farming collectives.",
      gatedTitle: "Premium Portals & Interactive Utilities:",
      gatedDesc: "Registration provides secure Access to manual chapters, SOPs, costing, compliance, water planning, provenance, pest response, and market probes tailored for regional operators.",
      infoSopTitle: "Authorized SOP Checklists",
      infoSopDesc: "Verified manuals covering plant imports, water cycles, syrup pressing, and regional sea corridor trade.",
      infoCrmTitle: "Market CRM Logger",
      infoCrmDesc: "Identify and manage potential commercial buyers mapped across boutique lodging and grocery distributors.",
      infoWaterTitle: "Multiphase Hydrology Calculator",
      infoWaterDesc: "Input borehole pump logs and calculate total seasonal litres required for nursery vs field establishment.",
      infoTraceTitle: "Traceability Pedigree Log",
      infoTraceDesc: "Record phytosanitary credentials and mother plant coordinates for agricultural audits.",
    },
    signup: {
      title: "Registration Portal",
      description: "Fill in your profile details to register your agave enterprise and unlock technical portals instantly.",
      firstName: "First Name",
      lastName: "Last Name",
      firstNamePlaceholder: "e.g. Gerdy",
      lastNamePlaceholder: "e.g. Abelard",
      email: "Email Address",
      emailPlaceholder: "e.g. hello@mellominis.com",
      district: "Local District / Enterprise Name",
      districtPlaceholder: "e.g. Gwanda, Matabeleland South",
      roleOrInterest: "Grower Classification",
      rolePlaceholder: "Select your grower classification Group...",
      agree: "I agree to log my regional trial parameters to the secure Mellow Minis pan-African cooperative ledger.",
      submitBtn: "Join the Zimbabwe Agave Syndicate",
      submitting: "Submitting Profile...",
      successTitle: "Registration Complete!",
      successDesc: "Welcome to the hub. Preparing your localized Standard Operating Procedures, Interactive costing models, and constitution builders...",
      logsTitle: "Integration Logs",
      activeRelays: "Active proxy relays",
      firestoreSync: "Firestore Sync",
      emailDispatch: "Resend Welcome Dispatch",
      sheetsBackup: "Google Sheets Backup",
      connected: "Connected",
      emailed: "Emailed",
      logged: "Logged",
      failed: "Failed",
      skipped: "Skipped (Default)",
      unlockResources: "Unlocking Resources Workspace...",
      configKeysHint: "To configure active live pipelines, populate your keys securely in the AI Studio platform Secrets dashboard.",
      errFirstName: "First name is required",
      errLastName: "Last name is required",
      errEmail: "Email address is required",
      errEmailValid: "Please provide a valid email",
      errDistrict: "Please specify your district or province",
      errRole: "Please select your role or interest",
      errTerms: "You must agree to the data usage terms to unlock resources",
      errSubmit: "A communication error occurred. Please try again.",
      roleFarmer: "Smallholder Farmer / Outgrower",
      roleProcessor: "Commercial Juicer / Mill Processor",
      roleAgronomist: "Agriculture Extension Officer",
      roleDistributor: "Craft Spirit Guild / Distributor",
    },
    manual: {
      libraryTitle: "Agave Agronomy & Operations Manual",
      libraryDesc: "Comprehensive guides to cultivating blue Weber and sisal-grade agave in challenging sub-arid microclimates.",
      searchPlaceholder: "Search educational chapters, harvesting parameters...",
      categoryFilter: "Operational Category",
      allCategories: "All Library Sectors",
      readTime: "Read duration",
      downloadCta: "Export Chapter SOP",
      noResults: "No manual chapters match your search query.",
      agronomyCategory: "Agronomy",
      regulatoryCategory: "Regulatory",
      processingCategory: "Industrial Processing",
      cooperativeCategory: "Community Cooperatives",
    },
    sop: {
      standardProcedures: "Standard Operating Procedures (SOP)",
      sopSub: "Official protocols detailing legal, agronomic, and culinary parameters.",
      searchPlaceholder: "Search protocols (e.g. import, syrup, fiber)...",
      category: "Agricultural Category",
      timeline: "Execution Buffer",
      complianceBody: "Compliance Governing Body",
      steps: "Step-by-Step Technical Protocol",
      notes: "SOP Safety Cautions",
      warningTitle: "Mandatory Regulatory Compliance Warning:",
      biosecurity: "Agricultural Biosecurity",
      scaleup: "Agronomic Scale-up",
      extraction: "Syrup Extraction",
      sisal: "Sisal-Grade Fiber",
      trade: "Trade & Logistics",
    },
    probe: {
      marketProbeTitle: "Market Router & Commercial CRM",
      marketProbeDesc: "Track and log procurement expressions of interest across southern Africa's specialized hospitality and organic retail hubs.",
      searchAndLog: "Procurement Log & Client Lead Manager",
      searchPlaceholder: "Filter buyers by name, type, or regional location...",
      statusFilter: "Lead Status",
      allStatuses: "All Status Groups",
      testLogBtn: "Load Demo Commercial Buyers",
      addBuyerBtn: "Register Custom Buyer Lead",
      buyerNameLabel: "Buyer Enterprise Name",
      buyerTypeLabel: "Commercial Classification",
      locationLabel: "Physical City/Country",
      contactPersonLabel: "Procurement Manager",
      phoneLabel: "Phone Contact",
      emailLabel: "Corporate Email",
      productInterestLabel: "Agave Product Interest",
      notesLabel: "Initial Contact Log",
      cancelBtn: "Discard",
      saveBtn: "Save Lead Entry",
      tableHeaderName: "Buyer Enterprise / Contact",
      tableHeaderType: "Classification",
      tableHeaderLocation: "Location",
      tableHeaderStatus: "Negotiation State",
      tableHeaderContact: "Core Details / Products",
      noBuyers: "No buyer leads mapped matching current criteria.",
      prospect: "Prospecting Lead",
      contacted: "Contact Established",
      meeting_set: "Direct Dialogue Set",
      sample_sent: "Batch Sample Dispatched",
      active_buyer: "Active Purchase Agreement",
      inactive: "Dormant / Archive",
      hotels: "Boutique Hotels",
      lodges: "Eco Safaris & Lodges",
      health_shops: "Specialty Wellness Retail",
      craft_buyers: "Artisan Guilds",
      distributors: "Beverage Brokers",
    },
    planner: {
      waterPlannerTitle: "Multiphase Hydrology Calculator",
      waterPlannerDesc: "Calculate total seasonal water requirements based on physical plant count, district dry heat vectors, and local solar borehole outputs.",
      waterSourceLabel: "Primary Hydrology Infrastructure",
      dailyLitresLabel: "Solar Borehole Safe Yield (Litres / Day)",
      plantCountLabel: "Active Plant Offcuts (Density / Nursery Size)",
      nurseryPeriodLabel: "Nursery Hardening Span (Months)",
      establishmentPeriodLabel: "Deep Field Establishment Phase (Months)",
      runCalculations: "Simulate Hydrological Sufficiency",
      dailyWaterHeading: "Hydrological Calculations Summary",
      dailyWaterNeed: "Combined Daily Hydrology Need",
      totalNurseryNeed: "Cumulative Nursery Phase Supply",
      totalEstablishmentNeed: "Cumulative Field Establishment Supply",
      feasibilityVerdict: "Enterprise Hydrologic Feasibility",
      feasibleTitle: "Hydrologically Sustainable Model",
      infeasibleTitle: "Hydrological Stress Warning",
      riskRating: "Site Evaporation Risk Level",
      lowRisk: "Low Evaporation Hazard",
      moderateRisk: "Moderate Evaporation Hazard",
      highRisk: "Extreme Evaporation Threat",
      criticalRisk: "Critical Hydrological Failure Risk",
      borehole: "Deep Solar Borehole Utility",
      rainwater: "Seasonal Sand Dam & Catchment",
      river_pump: "Riverine Gravity Drip Intake",
      municipal: "Municipal Piped Borehole Layout",
      deep_well: "Manual Open Hand-pump Well",
    },
    provenance: {
      provenanceTitle: "Plant Provenance Log",
      provenanceDesc: "Maintain chronological record of bulbil imports to prevent disease and guarantee regional origin authenticity.",
      logBatchBtn: "Log Import Batch Provenance",
      batchNo: "Import Batch Serial Number",
      supplier: "Consignor / Tissue Lab name",
      motherPlant: "Mother Plant Coordinates",
      phytoBeenChecked: "Phytosanitary stamp verified",
      importPermit: "PQS Import Permit Stamp",
      batchNotes: "Quarantine / Health notes",
      cancelBtn: "Discard",
      submitProductBtn: "Commit Log to Ledger",
      pending: "In Quarantine",
      verified: "Cleared for Transplant",
      rejected: "Held (Sanitary Failure)",
      tableBatch: "Batch Serial",
      tableSupplier: "Consignor Laboratory",
      tableOrigin: "Quarantine Origin",
      tableVariety: "Variety",
      tableQty: "Quantity",
      tableDate: "Import Date",
      tablePhyto: "Biosecurity Permits",
      tableStatus: "Verification Status",
      noLogs: "No importation provenance batches logged yet.",
    },
    pest: {
      diagnosticTitle: "Pest & Disease Response Tree",
      diagnosticDesc: "Identify agricultural threats and deploy localized organic remedies immediately.",
      identifyPests: "Select Symptom Indicators For Diagnosis",
      selectSymptom: "Choose physical plant symptom...",
      severityLabel: "Risk Severity Level",
      remedyAction: "Immediate Local Remedial Action",
      followUpAction: "National Food Safety Action Protocol",
      isolatingRequired: "Quarantine Segregation Threshold",
      yesIsolate: "Immediate Shaded Segregation Required",
      yesRemove: "Immediate Extraction & Incineration Required",
      noActionRequired: "Standard Organic Application Permitted",
      low: "Low Risk",
      medium: "Moderate Damage",
      high: "Severe Outbreak Threat",
      critical: "Rapid Bio-Contraband Threat",
    },
    costing: {
      pricingCalculator: "Smallholder Capital & Costing Simulator",
      pricingDesc: "Calculate custom capital investment requirements and operating costs from 1 to 50 hectares tailored for local currencies.",
      areaHectares: "Total Cultivation Field Size (Hectares)",
      targetDensity: "Agave Plant Spacing (Plants / Hectare)",
      seedlingCost: "Agave Bulbil Cost ($ / Unit)",
      laborCost: "Daily Agri-Labor Cost ($ / Worker)",
      estimatedBudget: "Estimated Agave Development Budget",
      costHectare: "per hectare model cost",
      densityHelp: "Recommended density is 2,500 to 3,500 plants/hectare (Blue Weber or Sisal-grade).",
      totalPlants: "Total Seedlings Needed",
      seedlingTotal: "Bulbils Procured Cost",
      laborTotal: "Clearing & Planting Labor Cost",
      maintenanceTotal: "Irrigation & Weed Maintenance (Year 1)",
      infrastructureTotal: "Quarantine Nursery Fencing",
      totalOpCost: "Minimum Capital Required",
      exportCta: "Export Budget Sheet",
      currencyUSD: "USD / ZWG equivalent",
    },
    calculator: {
      calcTitle: "Interactive Costing & Scale-up Simulator",
      calcDesc: "Model budgets across farming, localized nursery, and initial syrup agro-processing lines.",
      modelParams: "Model Parameters",
      plantSize: "Plantation Size",
      costPerBulbil: "Cost per Bulbil (Seedling)",
      hourlyLabor: "Hourly Labor Rate (USD Equivalent)",
      processingCapLabel: "Processing Cap (Piñas/Day)",
      totalStartup: "Total Estimated Startup",
      roiYield: "Yield starts at year 5. Projected gross revenue per hectare sits around $12,500 - $18,000 annually in syrup and fiber, producing high ROI post year 6.",
      farmShare: "Farming",
      nurseryShare: "Nursery",
      processingShare: "Agro-processing",
    },
    constitution: {
      constitutionTitle: "Community Cooperative Constitution Builder",
      constitutionDesc: "Generate localized legal frameworks aligned with national trade acts and cooperative standards.",
      generateDraft: "Synthesize Cooperative Articles",
      memberRights: "Grower Member Rights",
      coopBylaws: "Operational Bylaws",
      coopName: "Proposed Cooperative Entity Name",
      coopNamePlaceholder: "e.g. Gwanda Agave Growers Co-operative Society",
      shareValue: "Initial Capital share value ($)",
      boardMembers: "Minimum Oversight Committee Size",
      downloadDraft: "Export PDF Draft Constitution",
      previewTitle: "Constitution Preview Model Draft",
    },
    coop: {
      coopTitle: "Cooperative Constitution Generator",
      coopDesc: "Draft a governing framework legally aligned with the co-operative legal acts of",
      editorTab: "Parameter Editor",
      previewTab: "Review Bylaws",
      compileConstitution: "Compile Legal Constitution",
      copied: "Copied!",
      copyBtn: "Copy Draft",
      downloadBtn: "Download Draft",
    },
    compliance: {
      checklistTitle: "Export Compliance & SADC Certification Guide",
      checklistDesc: "Follow precise steps to clear biosecurity borders and secure tariff-free exports through regional corridors.",
      regionalExport: "SADC Surtax-Free Border Roadmap",
      standardSadc: "Regional Preferential Trade Rules",
      statusCompleted: "Approved",
      statusPending: "Required",
      localRulesTitle: "National Border & Regulatory Directives",
      labelingLaw: "Food Ingredients & Labeling Compliance",
      quarantineLaw: "Sorghum & Succulent Quarantine Code",
      coopLaw: "EAC/SADC Inter-cooperative Trade Acts",
      complianceTitle: "Regulatory Compliance roadmap",
      complianceDesc: "Review and check off regulatory permits required to maintain legal standing for local farming and international exports in",
      allMilestones: "All Milestones",
      mandatoryOnly: "Mandatory Only",
      verifiedCompliant: "Verified compliant",
      inspectionCheckText: "Check off actions as they undergo certified local board inspections.",
      progressLabel: "Progress:",
      metLabel: "of",
      mandatoryBadge: "Mandatory",
      phase1: "Phase 1: Seed Propagation & Quarantine (Pre-cultivation)",
      phase2: "Phase 2: Local Production & Food Quality (Scale-up)",
      phase3: "Phase 3: Spirit Distillation & Export Trade (Market Launch)",
    },
    telemetry: {
      fieldSoilTelemetry: "Zimbabwe Pilot Telemetry Log",
      dynamicBrixReadings: "Nursery Brix Sugar Content (%)",
      simulatedBrix: "Simulated Brix Value",
      fieldSoilMoisture: "Field Soil Moisture Index (%)",
      liveHeader: "Live Telemetry Feed - Matabeleland South Research Grid",
      boreholePressure: "Borehole Flow safe yield",
      ambientTemp: "Nursery Ambient Heat Index",
      soilPh: "Volcanic Sandy Soil pH",
      sensorLive: "Sensor Grid Active",
      simulatedControls: "Environmental Stress Variables",
      increaseHeat: "Induce Solar Drought Stress",
      wateringPulse: "Activate Micro Drip Cycle",
      fertilizerDrip: "Inject Organic Liquid Compost Potash",
      telemetryTitle: "Chipinge Pilot Farm Telemetry & Yield Data",
      telemetryDesc: "Field logging reports on sugar levels (Brix %), moisture sensors, and plant growth curves.",
      pullLateFeeds: "Pull Late Feeds",
      leafSugarContent: "Leaf Sugar content",
      sugarBrixNotice: "Sugar content is highest in late dry cycles (Sep-Oct). Harvesting at 24%+ Brix guarantees supreme spirit distillates.",
      avgSoilMoisture: "Average Soil Moisture",
      soilMoistureNotice: "Agave thrives at 5% - 20% soil water saturation. Rain season levels above 30% are carefully channeled off.",
      avgHeight: "Average Height",
      stemCore: "Stem Core",
      heightNotice: "Steady development curve proves strong resilience of the Americana strain under low-latitude, semi-arid conditions.",
      twelveMonthCurve: "12-Month Sugar Accumulation Curve (Brix %)",
      curveTooltip: "Click points along the seasonal yield curve to inspect monthly environmental conditions.",
      selectedMonth: "Selected:",
    },
  },
  sn: {
    common: {
      appTitle: "Mellow Minis Hub",
      appSubtitle: "CHIRONGWA CHEKUTANGA CHEAGAVE MUZIMBABWE",
      pilotNetwork: "Chirongwa chekuZimbabwe",
      guestMode: "Maitiro aMueni",
      resetProfile: "Kudzima Nhoroondo yeChirongwa?",
      cancel: "Kwete, Chengetedza",
      yesReset: "Hongu, Dzima",
      logout: "Kugadzirisa",
      registeredAs: "Boka reVarimi Rakanyoreswa",
      smallholder: "Murimi Mudiki",
      resetDesc: "Une chokwadi chekuti unoda kudzima nhoroondo yako yekunyoresa uye kudzokera kune Maitiro eMueni?",
      loadingText: "Kupfananidza Dzidzo yeAgave...",
      madeWith: "Iine rudo kubva",
      forSmallholders: "kune varimi vashoma vanotambura.",
      copyrightText: "Mubatanidzwa weAgave wePan-African Sustainable Development. Inovakirwa mu:",
      customizedFor: "Yakagadzirirwa dunhu re",
    },
    tabs: {
      manual: "Bhuku reAgave",
      sop: "Bhuku reSOP",
      probe: "Kutsvaga Musika",
      planner: "Urongwa weMvura",
      provenance: "Mavambo eChirimwa",
      pest: "Zvirwere zveMbeu",
      costing: "Mutengo weKurima",
      constitution: "Bumbiro reKwayedza",
      compliance: "Mitemo neZvifambiso",
      telemetry: "Kuyera Goho",
    },
    landing: {
      title: "Mellow Minis Agave Hub",
      subtitle: "Chirongwa ChekuZimbabwe Chakaumbwa",
      description: "Tikugashirei kunzvimbo yakatsaurirwa nhengo dzeMellow Minis. Ino nzvimbo yakagadzirirwa varimi vadiki, vanogadzira, uye nevashandisi vanorima agave muvhu rinoomeswa muZimbabwe.",
      pillar1Title: "Maitiro eMutemo",
      pillar1Desc: "Mabhuku ezvekurima akajairika anoenderana nezvinodiwa mukurongedza chikafu cheZimbabwe SI 265 yegore ra 2002 uye nemititemo yemubatanidzwa yakanyoreswa muCo-operative Societies Act.",
      pillar2Title: "Kugovewa kweMusika",
      pillar2Desc: "Mepe inofambidzana inoratidza mahotera, nzvimbo dzekugara dzevakashanyira, zvitoro zveutano, uye vatengesi vezvinwiwa varikuda zvinobuda muagave.",
      pillar3Title: "Kushandiswa kweMvura",
      pillar3Desc: "Kugadzirira nzvimbo kwakagadzirirwa Matabeleland South. Kune muchina wekuyera mvura inodiwa kureva madhairekitori ezvibhorani nematsime.",
      pillar4Title: "Hura yemushandisi",
      pillar4Desc: "Miti yose yezvirwere, kuverenga mutengo, uye magwaro ekupinza mbeu. Nhoroondo dzakachengeteka zvakanyanya dzinotsigira varimi vadiki.",
      gatedTitle: "Mikana Yakasarudzika & Zvishandiso:",
      gatedDesc: "Kunyoresa kunopa kudzivirirwa uye kupinda mumachaputa ezvinyorwa, SOPs, mutengo, kutevedza mitemo, kuronga mvura, uye kuongorora musika.",
      infoSopTitle: "Magwaro eSOP Akabvumidzwa",
      infoSopDesc: "Mabhuku akasimbiswa ezvekupinza mbeu munyika, madenderedzwa emvura, kumanikidza muto, uye kutengeserana munyika dzekunze.",
      infoCrmTitle: "Nhoroondo yeMusika yeCRM",
      infoCrmDesc: "Ziva uye gadzirisa vatengi vekutengeserana vakarongeka muenzaniso wemahotera nezvitoro.",
      infoWaterTitle: "Chishandiso cheKuyera Mvura",
      infoWaterDesc: "Pinza ruzivo rwekuwanikwa kwemvura muchibhorani uye uverenge marita anodiwa mubindu nemuminda.",
      infoTraceTitle: "Nhoroondo Inoratidza Mavambo eMbeu",
      infoTraceDesc: "Nyoresa matsamba ezveutano hwezvirimwa nenzvimbo dzekupihwa mbeu dzevabereki.",
    },
    signup: {
      title: "Nzvimbo Yekunyoresa",
      description: "Zadza ruzivo rwako kuti unyore bhizinesi rako re agave uye uvhure nzvimbo dzehunyanzvi izvozvi.",
      firstName: "Zita rekutanga",
      lastName: "Zita remhuri",
      firstNamePlaceholder: "senge Gerdy",
      lastNamePlaceholder: "senge Abelard",
      email: "Kero yeEmail",
      emailPlaceholder: "senge hello@mellominis.com",
      district: "Dunhu rawakabva / Zita reBhizinesi",
      districtPlaceholder: "senge Gwanda, Matabeleland South",
      roleOrInterest: "Kupatsanurwa Kwevarimi",
      rolePlaceholder: "Sarudza chikamu chebasa rako rekurima...",
      agree: "Ndinobvuma kunyoresa paramita dzangu dzebasa kurunyorwa rwakachengeteka rwemubatanidzwa weMellow Minis.",
      submitBtn: "Joinha Sangano reAgave muZimbabwe",
      submitting: "Kutumira ruzivo...",
      successTitle: "Kunyoresa Kwapera!",
      successDesc: "Tikugashirei panzvimbo yedu. Kukurumidza kuronga nzira dzako, simulator yemitengo, uye magwaro ebumbiro...",
      logsTitle: "Nhoroondo dzeKugadzira",
      activeRelays: "Masevha ari kushanda",
      firestoreSync: "Kufambidzana neFirestore",
      emailDispatch: "Kutumira Email yeKugashira naResend",
      sheetsBackup: "Kuchengetedza muGoogle Sheets",
      connected: "Yakabatanidzwa",
      emailed: "Email Yatumirwa",
      logged: "Yanyorwa",
      failed: "Kukundikana",
      skipped: "Kupfuura (Nezvikonzero)",
      unlockResources: "Kuvhura Nzvimbo yeMbeu neZvishandiso...",
      configKeysHint: "Kuti uvhure mapamhande eizvi, isa kiyi dzako muAI Studio platform Secrets dashboard.",
      errFirstName: "Zita rekutanga rinodikanwa",
      errLastName: "Zita remhuri rinodikanwa",
      errEmail: "Kero yeemail inodikanwa",
      errEmailValid: "Ndokumbira upe email inoshanda",
      errDistrict: "Ndokumbira utsanangure dunhu rako kana dhipatimendi",
      errRole: "Ndokumbira usarudze basa rako",
      errTerms: "Unofanira kubvuma mitemo yekushandiswa kwedata kuti uvhure zvishandiso",
      errSubmit: "Kukanganisa kukurukurirana kwaitika. Ndokumbira uedze zvakare.",
      roleFarmer: "Murimi Mudiki ezvirimwa",
      roleProcessor: "Mugadziri wemuto neSero remiti",
      roleAgronomist: "Mupfananidzi wezveKurima munharaunda",
      roleDistributor: "Mugadziri wezvinwiwa neMutengesi",
    },
    manual: {
      libraryTitle: "Bhuku Rokusimudzira Agave",
      libraryDesc: "Matanho akazara ekurima agave weMubatanidzwa muvhu rakaoma rine mhepo inopisa.",
      searchPlaceholder: "Tsvaga zvitsauko, nzira dzekukohwa...",
      categoryFilter: "Chikamu cheKushanda",
      allCategories: "Zvikamu Zvose zveMabhuku",
      readTime: "Nguva yekuverenga",
      downloadCta: "Kopa chitsauko cheSOP",
      noResults: "Hapana zvitsauko zvebhuku zvinoenderana nekutsvaga kwako.",
      agronomyCategory: "Kurima neAgronomy",
      regulatoryCategory: "Zvemitemo",
      processingCategory: "Industrial Processing",
      cooperativeCategory: "Kushanda kweMubatanidzwa",
    },
    sop: {
      standardProcedures: "Nzira dzakajairika dzekuita (SOP)",
      sopSub: "Maitiro anotsanangura mutemo, zvirimwa, uye nezvekubika.",
      searchPlaceholder: "Tsvaga nzira (semuenzaniso: kupinza mbeu, manyuchi, bio-fiber)...",
      category: "Chikamu chezvirimwa",
      timeline: "Nguva inodiwa",
      complianceBody: "Sangano Rinodzora Mitemo",
      steps: "Matanho ehunyanzvi ekutevera",
      notes: "Chenjedzo dzeSOP",
      warningTitle: "Yambiro Inomanikidzirwa Kutevera Mutemo:",
      biosecurity: "Dziviriro yeZvirimwa",
      scaleup: "Kukudza Agronomy",
      extraction: "Kugadzira Manyuchi",
      sisal: "Sisal-Grade Bio-Fiber",
      trade: "Kutengeserana neKutakura",
    },
    probe: {
      marketProbeTitle: "Nzira dzeMusika neCRM",
      marketProbeDesc: "Tevera kuratidzwa kwekufarira kwekutenga mbeu neagave muAfrica yose munzvimbo dzehotera nevatengesi vezvitoro.",
      searchAndLog: "Nhoroondo dzeVatengi veKutengesa",
      searchPlaceholder: "Sefa vatengi nezita, dhipatimendi, kana dunhu...",
      statusFilter: "Mamiriro emusika",
      allStatuses: "Mamiriro Ose",
      testLogBtn: "Rodha Varimi Vemuedzo Vanotenga",
      addBuyerBtn: "Nyoresa Mutengi Mutsva",
      buyerNameLabel: "Zita reKambani yeMutengi",
      buyerTypeLabel: "Chikamu chekutengeserana",
      locationLabel: "Guta kana Nyika",
      contactPersonLabel: "Maneja wekutenga",
      phoneLabel: "Nhamba yeRunhare",
      emailLabel: "Email yeKambani",
      productInterestLabel: "Chigadzirwa Chaanofarira cheAgave",
      notesLabel: "Nhoroondo dzekutaurirana",
      cancelBtn: "Kudzima",
      saveBtn: "Chengetedza Mutengi Mutsva",
      tableHeaderName: "Kambani yeMutengi / Ruzivo",
      tableHeaderType: "Chikamu chezvokutengeserana",
      tableHeaderLocation: "Nzvimbo neGuta",
      tableHeaderStatus: "Chikamu cheKutaurirana",
      tableHeaderContact: "Ruzivo rwekuonana",
      noBuyers: "Hapana vatengi vanoenderana nemamiriro anotaurwa pasi apa.",
      prospect: "Mutori wenhau wekupihwa",
      contacted: "Kukurukurirana Kwaitwa",
      meeting_set: "Musangano Wakarongwa",
      sample_sent: "Muedzo Chirimwa Chatumirwa",
      active_buyer: "Mutengi Ari Kushanda Anotenga",
      inactive: "Hachiri kushanda / Kuchengetedzwa",
      hotels: "Mahotera akasarudzika",
      lodges: "Nzvimbo dzemusango dzevakashanyira",
      health_shops: "Zvitoro zvezveutano",
      craft_buyers: "Zvikwata zvevashandi vemaoko",
      distributors: "Vamiriri vezvinwiwa zvakadhakwa",
    },
    planner: {
      waterPlannerTitle: "Muchina wekuronga Mvura",
      waterPlannerDesc: "Unerenga zvakazara mvura inodikanwa pamwaka zvichibva pahuwandu hwezvirimwa, kupisa kwepunha muZimbabwe, uye ruzivo rwakachengeteka rwe borehole.",
      waterSourceLabel: "Mavimbidziro eMvura Makuru",
      dailyLitresLabel: "Mvura eBorehole Inowanikwa Pazuva (Marita)",
      plantCountLabel: "Huwandu hweZvirimwa Mudunhu",
      nurseryPeriodLabel: "Nguva yekuchengeta mubindu (Mwedzi)",
      establishmentPeriodLabel: "Nguva yekudyara mumunda mukuru (Mwedzi)",
      runCalculations: "Verenga Kugona kweHydrological muvhu",
      dailyWaterHeading: "Zvinobuda muKuyera Mvura",
      dailyWaterNeed: "Mvura Inodiwa Pazuva Yose",
      totalNurseryNeed: "Kuunganidzwa kweMvura Mubindu",
      totalEstablishmentNeed: "Mvura inodiwa Mukuisa Mumunda Mukuru",
      feasibilityVerdict: "Mhedzisiro yekurarama nekuwana Mvura",
      feasibleTitle: "Mvura Yakaringana uye Inogoneka",
      infeasibleTitle: "Yambiro yeKupera kweMvura",
      riskRating: "Ngozi Yekupihwa Kwezuva neKurasika kweMvura",
      lowRisk: "Ngozi duku yekurasika mvura",
      moderateRisk: "Mvura inogona kurasika zviri pakati",
      highRisk: "Ngozi huru kwazvo yetembiricha ine mweya yakaoma",
      criticalRisk: "Kusingagoneki kurarama nekuda kwekushaya mvura",
      borehole: "Chibhorani Chemagetsi ezuva",
      rainwater: "Kugadzira Mvura muDhamu neKunyungudika kwevhu",
      river_pump: "Kupomba mvura murwizi nemadonhwe",
      municipal: "Mvura yekanzuru yakabatanidzwa pombi",
      deep_well: "Tsime rekuvhurwa nemaoko",
    },
    provenance: {
      provenanceTitle: "Mavambo eChirimwa neTsananguro",
      provenanceDesc: "Chengetedza nhoroondo dzekupinzwa kwembeu munyika kudzivirira kupararira kwezvirwere uye kuve nechokwadi cherunyararo rwemavambo emiti.",
      logBatchBtn: "Nyoresa Mavambo eMbeu Idzva",
      batchNo: "Nhamba yeChirimwa / Batch ID",
      supplier: "Kambani inotumira mbeu",
      motherPlant: "Mavindo eMiti weVabereki",
      phytoBeenChecked: "Phytosanitary record yasimbiswa",
      importPermit: "PQS Import Permit Stamp yasimbiswa",
      batchNotes: "Tsananguro dzekudzivirira hutano",
      cancelBtn: "Kudzima",
      submitProductBtn: "Commit Log kune Ledger",
      pending: "Mukuongororwa (Quarantine)",
      verified: "Inotenderwa Kudyara",
      rejected: "Yakarambwa (Yakarwara)",
      tableBatch: "ID yeBatch",
      tableSupplier: "Kambani Inogadzira",
      tableOrigin: "Mavimbo Quarantine",
      tableVariety: "Mhando",
      tableQty: "Huwandu",
      tableDate: "Zuva rekudyara",
      tablePhyto: "Gwaro reBiosecurity",
      tableStatus: "Mamiriro eKuongorora",
      noLogs: "Hapana manyorero emavambo eChirimwa mune ino ledger zvakare.",
    },
    pest: {
      diagnosticTitle: "Zvirwere zveMbeu neMuchina unopa pfungwa dzekubvunza",
      diagnosticDesc: "Ziva kukuvara kuitika nezvipembenene uye deploy remedies zvemubatanidzwa kuti mbeu isapera kufa.",
      identifyPests: "Sarudza mucherechedzo uratidza hurwere pazvirimwa",
      selectSymptom: "Sarudza chiratidzo chinosarudzwa...",
      severityLabel: "Mamiriro engozi yeChirwere",
      remedyAction: "Matanho ekutanga Ekudzivirira Chirwere",
      followUpAction: "Maitiro anomanikidzirwa muNyika yeZimbabwe",
      isolatingRequired: "Kubvisa mbeu mukuongororwa kwekudzivirirwa",
      yesIsolate: "Bvisa izvozvi mubindu kuitira dziviriro",
      yesRemove: "Chotsa zvachose uye upise mudota kuitira kuchengeta mamwe mbeu",
      noActionRequired: "Maitiro ezvekurima anobvumidzwa kushanda",
      low: "Ngozi duku",
      medium: "Kukuvara pamwero wepakati",
      high: "Kutyisa kwekupararira zvakanyanya",
      critical: "Ngozi huru inoda kudhiraivha nemhepo kudzivirira nyika",
    },
    costing: {
      pricingCalculator: "Simulator yeMutengo weKurima Agave",      pricingDesc: "Verenga mari inodikanwa nemutengo wekuita basa kubva pahekita imwe kusvika pamahekita makumi mashanu yakagadzirirwa mari dzeZimbabwe.",
      areaHectares: "Kukura Kwakazara KweMunda (Hekita)",
      targetDensity: "Kudyara Miti muHekita imwe",
      seedlingCost: "Mutengo weChirimwa Chimwe ($)",
      laborCost: "Mutengo weMubhadharo Wemushandi pazuva ($)",
      estimatedBudget: "Mutengo Wekufananidza Unodiwa",
      costHectare: "mutengo wehekita imwe",
      densityHelp: "Huwandu hwevarimi huri kukurudzirwa is 2,500 kusvika ku 3,500 miti pahekita chimwechete.",
      totalPlants: "Huwandu hweZvirimwa zvinodiwa",
      seedlingTotal: "Mari Yekutenga Mbeu",
      laborTotal: "Mari Yekubvisa Sora nekudyara",
      maintenanceTotal: "Kudiridza nekuchengeta Miti munzvimbo muedzo (Gore 1)",
      infrastructureTotal: "Kusimbisa bindu kudzivirira kupindwa nemhuka",
      totalOpCost: "Capital Inodikanwa Yatanga kushanda",
      exportCta: "Kopa Gwaro reBhajeti",
      currencyUSD: "USD / ZWG zvinoera",
    },
    calculator: {
      calcTitle: "Chishandiso chekuverenga Mutengo weKukura",
      calcDesc: "Verenga mabhajeti ekurima, magariro mune mubindu mbeu, nemichina yekuburitsa sirapu muchiratidzo chimwechete.",
      modelParams: "Parameters reMuchina weMutengo",
      plantSize: "Kukura munda unodyarwa",
      costPerBulbil: "Mutengo wembeu imwe (Seedling)",
      hourlyLabor: "Mutengo webasa paawa (USD Equivalent)",
      processingCapLabel: "Capacity yemurairo wekugadzira wezuva (kg)",
      totalStartup: "Mutengo uchange Wakazara Kuti Chirongwa Chitange",
      roiYield: "Huwandu hwakarongwa hwembeu hunotanga kupa mutengo mugore rechi 5. Projected gross revenue per hekita isingasvike $12,500 - $18,000 pagore, ichipa high ROI mushure megore 6.",
      farmShare: "Kurima",
      nurseryShare: "Mubindu",
      processingShare: "Agro-processing",
    },
    constitution: {
      constitutionTitle: "Bumbiro reMubatanidzwa neZvinyorwa zvakarongeka",
      constitutionDesc: "Gadzira bumbiro rekurima rinoenderana neCo-operative Societies Act yeZimbabwe.",
      generateDraft: "Gadzira Draft reBumbiro nemashoko matsva",
      memberRights: "Kodzero dzeNhengo Yekurima",
      coopBylaws: "Mitemo yesangano yekutevera",
      coopName: "Zita remubatanidzwa ririkuda kupiwa",
      coopNamePlaceholder: "senge Gwanda Agave Growers Co-operative Society",
      shareValue: "Mutengo wekutanga wekupihwa zvikamu ($)",
      boardMembers: "Huwandu hweVatungamiri weKomisheni yesangano",
      downloadDraft: "Kopa Bumbiro reCooperative muchinyorwa chipenyu",
      previewTitle: "Draft Bumbiro Remuenzaniso",
    },
    coop: {
      coopTitle: "Mubumbiro weCooperative Generator",
      coopDesc: "Gadzira mutemo wesangano wakanyoreswa rinoenderana neCooperative Societies Act yemudunhu ra",
      editorTab: "Gadziririsa zvaunoda Mubumbiro",
      previewTab: "Wana Draft reBumbiro",
      compileConstitution: "Gadzira Bumbiro Chairo reMubatanidzwa",
      copied: "Yateedzerwa mutsigiro!",
      copyBtn: "Kopa Draft reBumbiro",
      downloadBtn: "Dhawunirodha Draft",
    },
    compliance: {
      checklistTitle: "Gwara reKutevedza neZvitupa zveSADC",
      checklistDesc: "Tevera magwaro anodiwa pakutakura mbeu kuburikidza needu masayiti ekuZimbabwe, SADC, neZimra.",
      regionalExport: "Roadmap reSADC yekutengesa isina mitero yeSurtax",
      standardSadc: "Mitemo yeTrade muSADC neNyika dzekunze",
      statusCompleted: "Yasimbiswa uye Yabvumudzwa",
      statusPending: "Inodikanwa kutevera",
      localRulesTitle: "Mitemo neZvirevo zvePamuganhu weNyika",
      labelingLaw: "Mitemo inorayira kurongedza chikafu nekurongeka",
      quarantineLaw: "Mitemo yemiti nemavambo quarantine codes",
      coopLaw: "EAC/SADC Mitemo yekushanda kwematanho emubatanidzwa",
      complianceTitle: "Regulatory Compliance roadmap",
      complianceDesc: "Tevera magwaro anodiwa pakutakura mbeu kuburikidza needu masayiti ekuZimbabwe, SADC, neZimra mu",
      allMilestones: "All Milestones (Zvose)",
      mandatoryOnly: "Zvinomanikidzirwa Chete",
      verifiedCompliant: "Kutevedza mberi kwakavandudzwa",
      inspectionCheckText: "Check off actions sezvavanofambisirwa mamberse mudunhu nekuongororwa kwebhuku.",
      progressLabel: "Kufambira mberi:",
      metLabel: "pane",
      mandatoryBadge: "Inomanikidzirwa",
      phase1: "Phase 1: Seed Propagation & Quarantine (Pre-cultivation)",
      phase2: "Phase 2: Local Production & Food Quality (Scale-up)",
      phase3: "Phase 3: Spirit Distillation & Export Trade (Market Launch)",
    },
    telemetry: {
      fieldSoilTelemetry: "Zimbabwe Pilot Telemetry Log",
      dynamicBrixReadings: "Brix Sugar Content mubindu (%)",
      simulatedBrix: "Simulated Brix Value",
      fieldSoilMoisture: "Moisture Content yevhu (%)",
      liveHeader: "Live Telemetry Feed - Matabeleland South Research Grid",
      boreholePressure: "Kuyerera kwemvura muBorehole",
      ambientTemp: "Kupisa mumhepo mubindu",
      soilPh: "Volcanic Sandy Soil pH",
      sensorLive: "Sensor Grid Active",
      simulatedControls: "Kushandura mamiriro ekunze mune wekuyedza",
      increaseHeat: "Induce Solar Drought Stress",
      wateringPulse: "Activate Micro Drip Cycle",
      fertilizerDrip: "Inject Organic Liquid Compost Potash",
      telemetryTitle: "Chipinge Pilot Farm Telemetry & Yield Data",
      telemetryDesc: "Mishumo yekurekodha pamusoro peshuga uye unyoro mune wekuyedza nekuchema kwekrimwa.",
      pullLateFeeds: "Pull Late Feeds",
      leafSugarContent: "Leaf Sugar content",
      sugarBrixNotice: "Kuyera kwehuga riri pamusoro muSep-Oct. Kukohwa pa 24%+ Brix kunopa mhedzisiro yepamusoro.",
      avgSoilMoisture: "Average Soil Moisture",
      soilMoistureNotice: "Agave inokura zvakanaka pa 5% - 20% soil water saturation. Muenzaniso pamusoro pe 30% unodzivirirwa.",
      avgHeight: "Average Height",
      stemCore: "Stem Core",
      heightNotice: "Kukura kwakarongeka kunoratidza kusimba kwakasimba kwembeu mune semi-arid matunhu.",
      twelveMonthCurve: "Kuyerwa kwehuga mukati megore rose yeAgave (Brix %)",
      curveTooltip: "Dzvanya pamafundo emuchina kuti uone ruzivo rwemwedzi wega wega wemhepo nekuvhenekwa kwezuva.",
      selectedMonth: "Selected:",
    },
  },
  nd: {
    common: {
      appTitle: "Mellow Minis Hub",
      appSubtitle: "UHLELO LOKUQALA LWEAGAVE EZIMBABWE",
      pilotNetwork: "Inhlangano Yokuhlola eyeZimbabwe",
      guestMode: "Isimo soMvakashi",
      resetProfile: "Ukucitha uMlando weMisebenzi?",
      cancel: "Ayikhone, Gcina",
      yesReset: "Yebo, Citha",
      logout: "Ukulungisa",
      registeredAs: "Iqembu labalimi elibhalisiweyo",
      smallholder: "Umlimi oMncane",
      resetDesc: "Uqinisekile ukuthi ufuna ukucitha imininingwane yakho yokubhalisa ubuyele esimeni soMvakashi?",
      loadingText: "Ukulungiselela iSyllabus yeAgave...",
      madeWith: "Sikwenze ngoluthando kusuka ku",
      forSmallholders: "kwabalimi abancane abazabalazayo.",
      copyrightText: "Mubatanidzwa weAgave wePan-African Sustainable Development. Inovakirwa mu:",
      customizedFor: "Kuhlelwe kwesiqinti se",
    },
    tabs: {
      manual: "Ibhuku leAgave",
      sop: "Ibhuku leSOP",
      probe: "Mhloli-Makethe",
      planner: "Water Planner",
      provenance: "Provenance Log",
      pest: "Uhlolo lweZilwanyana",
      costing: "Izindleko zeLimo",
      constitution: "Bumbiro Mfelandawonye",
      compliance: "Izikhokhelo",
      telemetry: "Ukukala iGoho",
    },
    landing: {
      title: "Mellow Minis Agave Hub",
      subtitle: "Uxhumano Lokuhlola LweZimbabwe",
      description: "Siyakwamukela endaweni ekhethekileyo yamalunga e-Mellow Minis. Lendawo yokuhlola yakhelwe abalimi abancane, abalungisa ukuhlanganiswa kwe-agave eyomileyo e-Zimbabwe.",
      pillar1Title: "Izikhokhelo zeMithetho",
      pillar1Desc: "Amabhuku okusebenza ajwayelekileyo ahambisana nezidingo zokupakisha ukudla kwe-Zimbabwe SI 265 yango-2002 kanye nezinhlangano ezibhaliswe ngaphansi kwe-Co-operative Societies Act.",
      pillar2Title: "Ukusatshalaliswa KweMakethe",
      pillar2Desc: "Amamephu asebenzisanayo akhombisa amahotela, izindawo zokungcebeleka, izitolo zezempilo, nabasabalalisi beziphuzo abafuna imikhiqizo ye-agave.",
      pillar3Title: "Amanzi kanye neMozulu",
      pillar3Desc: "Ukuvuselelwa kwenziwe ngokukhethekileyo siqinti se-Matabeleland South. Kule-calculator ekhombisa amanzi adingekayo ezibholaneni.",
      pillar4Title: "Hura lomsebenzisi",
      pillar4Desc: "Zonke izilwanyana zezilimo, ukubalwa kwezindleko, kanye nemibhalo yokuthutha izitshalo. Amaphrofayili alondeke ngokupheleleyo asekelayo abalimi abancane.",
      gatedTitle: "Izikhala Ezikhethekileyo leZixhobo:",
      gatedDesc: "Ukubhalisa kunika ukuvikeleka kanye nokungena emihlahlandleleni, SOPs, imodeli yezindleko, izikhokhelo zokuhambisana emithethweni, kanye nokuhlola imakethe.",
      infoSopTitle: "Amabhuku e-SOP Agunyaziweyo",
      infoSopDesc: "Imikhombandlela eqiniselweyo ehlanganisa ukungena kwezitshalo elizweni, imijikelezo yamanzi, ukucindezela isiraphu, kanye nokuhweba phesheya.",
      infoCrmTitle: "Uhlu lweMakethe lweCRM",
      infoCrmDesc: "Thola uphinde ulawule abathengi bomshado abahlelwe kukhulunyiswana labo phesheya.",
      infoWaterTitle: "Umshini weKukala Amanzi",
      infoWaterDesc: "Faka imininingwane ye-borehole yakho uphinde ubale amalitha adingekayo elizweni.",
      infoTraceTitle: "Ulandelo lwezeMvelaphi yeZitshalo",
      infoTraceDesc: "Gcina amaphepha ezempilo yezitshalo kanye nemvelaphi yembewu yomzali.",
    },
    signup: {
      title: "Isango lokuBhalisa",
      description: "Gcwalisa imininingwane yakho ukuze ubhalise ibhizinisi lakho le-agave uphinde uvule isikhala semisebenzi yezandla khonamanje.",
      firstName: "Ighama lokuqala",
      lastName: "Isibongo senhlangano",
      firstNamePlaceholder: "senge Gerdy",
      lastNamePlaceholder: "senge Abelard",
      email: "I-imeyili yeNhlangano",
      emailPlaceholder: "senge hello@mellominis.com",
      district: "Isiqinti sakho / Ibhizinisi Lakho",
      districtPlaceholder: "senge Gwanda, Matabeleland South",
      roleOrInterest: "Izigaba zabalimi",
      rolePlaceholder: "Khetha umsebenzi wakho emisebenzini yelimo...",
      agree: "Ngiyavuma ukubhala yonke imininingwane yemisebenzi yelimo kulencwadi evikelekileyo ye-Mellow Minis pan-African cooperative ledger.",
      submitBtn: "Joyina Umanyano we-Agave leZimbabwe",
      submitting: "Kuthunyelwa imininingwane...",
      successTitle: "Ukubhalisa Kuphelile!",
      successDesc: "Siyakwamukela kuleyinhlangano. Silungiselela inqubo zakho zomsebenzi, simulator yezindleko, kanye nekhomishana yesisekelo...",
      logsTitle: "Ngezokulungisa emsebenzini",
      activeRelays: "Maseva asebenzayo",
      firestoreSync: "Kuhlanganiswa Firestore",
      emailDispatch: "Kuthunyelwa imi-yelo Yokwamukela Resend",
      sheetsBackup: "Log kuGoogle Sheets Backup",
      connected: "Kuhlanganisiwe",
      emailed: "I-imeyili Ithunyelwe",
      logged: "Kubhaliwe",
      failed: "Kunqotshiwe",
      skipped: "Kwedlulisiwe (Ngezizathu)",
      unlockResources: "Kuvulwa Amagunya lemikhombandlela...",
      configKeysHint: "Ukuze usebenzise isango lezi, faka amakiyi akho dashboard yeAI Studio Secrets.",
      errFirstName: "Ighama lokuqala liyadingeka",
      errLastName: "Isibongo senhlangano siyadingeka",
      errEmail: "I-imeyili enhle iyadingeka",
      errEmailValid: "Faka i-imeyili esebenzayo",
      errDistrict: "Sicela ucacise isiqinti sakho noma intambo yelimo",
      errRole: "Sicela ukhethe umsebenzi wakho",
      errTerms: "Kumele uvume izidingo zomsebenzi ukuze uvule izikhokhelo",
      errSubmit: "Iphutha lokuxhumana lenzekile. Sicela uzame futhi.",
      roleFarmer: "Umlimi oMncane weZitshalo",
      roleProcessor: "Olufeza ijusi le-Agave lemishini",
      roleAgronomist: "Isisebenzi sezolimo esiqintini",
      roleDistributor: "Umsabalalisi Weziphuzo",
    },
    manual: {
      libraryTitle: "Ibhuku Lokuthuthukisa Agave",
      libraryDesc: "Imikhombandlela epheleleyo ekuthuthukiseni i-agave emhlabathini owomileyo lohlabathi phesheya.",
      searchPlaceholder: "Hlola izahluko, ukukha i-agave...",
      categoryFilter: "Isigaba sokusebenza",
      allCategories: "Izigaba Zonke",
      readTime: "Sikhathi sekuHlola",
      downloadCta: "Landa uhlu lweSOP",
      noResults: "Hhayi imibhalo efana lokuhlola kwakho.",
      agronomyCategory: "Agronomy leLimo",
      regulatoryCategory: "Zemithetho",
      processingCategory: "Industrial Processing",
      cooperativeCategory: "Kusebenza koMfelandawonye",
    },
    sop: {
      standardProcedures: "Izikhokhelo Zomsebenzi (SOP)",
      sopSub: "Inqubo zomthetho, ezolimo, kanye lokulungiswa kokudla.",
      searchPlaceholder: "Funa iminyakazo (njenge: quarantine, syrup, fiber)...",
      category: "Agricultural Category",
      timeline: "Execution Buffer",
      complianceBody: "Compliance Governing Body",
      steps: "Step-by-Step Technical Protocol",
      notes: "SOP Safety Cautions",
      warningTitle: "Isexwayiso Semithetho Kumele Silandelwe:",
      biosecurity: "Ezempilo yezilimo",
      scaleup: "Agronomic Scale-up",
      extraction: "Extraction yeSyrup",
      sisal: "Sisal-Grade Fiber",
      trade: "Trade leLogistics",
    },
    probe: {
      marketProbeTitle: "Mhloli-Makethe le CRM",
      marketProbeDesc: "Gcina amarekhodi amaphrojekthi wama-oda abathengi ku-Afrika epheleleyo emabhizinisini amahotela nezitolo.",
      searchAndLog: "Amaphrofayili Abathengi",
      searchPlaceholder: "Funa abathengi ngeghama, isigaba, noma isiqinti...",
      statusFilter: "Lead Status",
      allStatuses: "Izigaba Zonke",
      testLogBtn: "Layisha demo abathengi abajwayelekileyo",
      addBuyerBtn: "Bhalisa custom buyer lead",
      buyerNameLabel: "Buyer Enterprise Name",
      buyerTypeLabel: "Commercial Classification",
      locationLabel: "Physical City/Country",
      contactPersonLabel: "Procurement Manager",
      phoneLabel: "Phone Contact",
      emailLabel: "Corporate Email",
      productInterestLabel: "Agave Product Interest",
      notesLabel: "Initial Contact Log",
      cancelBtn: "Discard",
      saveBtn: "Save Lead",
      tableHeaderName: "Buyer Enterprise / Contact",
      tableHeaderType: "Classification",
      tableHeaderLocation: "Location",
      tableHeaderStatus: "Negotiation State",
      tableHeaderContact: "Core Details / Products",
      noBuyers: "Akulamarekhodi abathengi ahambisana lezi zidingo.",
      prospect: "Prospecting Lead",
      contacted: "Contact Established",
      meeting_set: "Direct Dialogue Set",
      sample_sent: "Batch Sample Dispatched",
      active_buyer: "Active Purchase Agreement",
      inactive: "Dormant / Archive",
      hotels: "Boutique Hotels",
      lodges: "Eco Safaris & Lodges",
      health_shops: "Specialty Wellness Retail",
      craft_buyers: "Artisan Guilds",
      distributors: "Beverage Brokers",
    },
    planner: {
      waterPlannerTitle: "Water Planner loMshini wokubala",
      waterPlannerDesc: "Bala amanzi adingekayo emsebenzini wezikhathi zomsebenzi kuye ngenani lemishini, ilanga lase-Zimbabwe, kanye nezibholane.",
      waterSourceLabel: "Mavela kuphi Amanzi",
      dailyLitresLabel: "Litha zamanzi ezibholaneni phezulu ngosuku (Safe Yield)",
      plantCountLabel: "Inani leZitshalo Eziqintini",
      nurseryPeriodLabel: "Sikhathi egumbini lezitshalo (Months)",
      establishmentPeriodLabel: "Isikhathi elizweni (Months)",
      runCalculations: "Simulate Hydrological Sufficiency",
      dailyWaterHeading: "Zikhombiso Zendaba Zamanzi",
      dailyWaterNeed: "Amanzi anyikwa nsuku zonke",
      totalNurseryNeed: "Supply Egumbini leZitshalo",
      totalEstablishmentNeed: "Supply Elizweni Lonke",
      feasibilityVerdict: "Ukugomeka komsebenzi ngezanzo zamanzi",
      feasibleTitle: "Kuyagomeka futhi kunemvuselelo",
      infeasibleTitle: "Isexwayiso: Ukushoda Kwamanzi",
      riskRating: "Site Evaporation Risk Level",
      lowRisk: "Low Evaporation Hazard",
      moderateRisk: "Moderate Evaporation Hazard",
      highRisk: "Extreme Evaporation Threat",
      criticalRisk: "Critical Hydrological Failure Risk",
      borehole: "Deep Solar Borehole Utility",
      rainwater: "Seasonal Sand Dam & Catchment",
      river_pump: "Riverine Gravity Drip Intake",
      municipal: "Municipal Piped Borehole Layout",
      deep_well: "Manual Open Hand-pump Well",
    },
    provenance: {
      provenanceTitle: "Ulandelo lwemvelaphi yeZitshalo",
      provenanceDesc: "Gcina chronological ulandelo lwebulbil imports ukuze kuvinjwe ukugula kwembewu nokuqinisekisa imvelaphi.",
      logBatchBtn: "Faka I-Provenance yeZitshalo",
      batchNo: "Inombolo Yembewu / Batch Serial",
      supplier: "Lab ehambisa imbewu",
      motherPlant: "Mvelaphi yomzali coordinates",
      phytoBeenChecked: "Phytosanitary stamp verified",
      importPermit: "PQS Import Permit Stamp verified",
      batchNotes: "Quarantine / Health notes",
      cancelBtn: "Discard",
      submitProductBtn: "Ledger commit",
      pending: "In Quarantine",
      verified: "Cleared for Transplant",
      rejected: "Held (Sanitary Failure)",
      tableBatch: "Batch Serial",
      tableSupplier: "Consignor Laboratory",
      tableOrigin: "Quarantine Origin",
      tableVariety: "Variety",
      tableQty: "Quantity",
      tableDate: "Import Date",
      tablePhyto: "Biosecurity Permits",
      tableStatus: "Verification Status",
      noLogs: "Akula zitshalo esezifakwe kuleyo lundelo.",
    },
    pest: {
      diagnosticTitle: "Uhlolo lweZilwanyana leZifo zeSucculents",
      diagnosticDesc: "Thola izilwanyana ezonakalisa izitshalo uphinde usebenzise remedies zesiqinti masinyane.",
      identifyPests: "Khetha uphawu lomonakalo ezitshalweni",
      selectSymptom: "Symptom indicator select...",
      severityLabel: "Ubungozi beSihawu",
      remedyAction: "Immediate Local Remedial Action",
      followUpAction: "National Food Safety Action Protocol",
      isolatingRequired: "Quarantine Segregation threshold",
      yesIsolate: "Immediate Shaded Segregation Required",
      yesRemove: "Immediate Extraction & Incineration Required",
      noActionRequired: "Standard Organic Application Permitted",
      low: "Low Risk",
      medium: "Moderate Damage",
      high: "Severe Outbreak Threat",
      critical: "Rapid Bio-Contraband Threat",
    },
    costing: {
      pricingCalculator: "Calculator yeZindleko zeLimo leCapital",
      pricingDesc: "Bala i-capital edingekayo emisebenzini kusukela kuHectare 1 kuye ku 50 elizweni lase-Zimbabwe.",
      areaHectares: "Cultivation field size total (Hectares)",
      targetDensity: "Plan spacing (Plants / Hectare)",
      seedlingCost: "Bulbil cost ($)",
      laborCost: "Labor cost safe yield ($ / Day)",
      estimatedBudget: "Estimated Agave Development Budget",
      costHectare: "per hectare model cost",
      densityHelp: "density spacing 2500 kuya ku 3500 standard plants/hectare recommended.",
      totalPlants: "Total Seedlings Needed",
      seedlingTotal: "Bulbils Procured Cost",
      laborTotal: "Clearing & Planting Labor Cost",
      maintenanceTotal: "Irrigation & Weed Maintenance (Year 1)",
      infrastructureTotal: "Quarantine Nursery Fencing",
      totalOpCost: "Minimum Capital Required",
      exportCta: "Kopa Ibhajeti",
      currencyUSD: "USD / ZWG equivalent",
    },
    calculator: {
      calcTitle: "Interactive Costing & Scale-up Simulator",
      calcDesc: "Model budgets across farming, localized nursery, and initial syrup agro-processing lines.",
      modelParams: "Model Parameters (Izinketho)",
      plantSize: "Plantation Size (Kukura kwebhande)",
      costPerBulbil: "Cost per Bulbil (Seedling)",
      hourlyLabor: "Hourly Labor Rate (USD Equivalent)",
      processingCapLabel: "Processing Cap (Piñas/Day)",
      totalStartup: "Total Estimated Startup (Izindleko)",
      roiYield: "Yield starts at year 5. Projected gross revenue per hectare sits around $12,500 - $18,000 annually in syrup and fiber, producing high ROI post year 6.",
      farmShare: "Farming",
      nurseryShare: "Nursery",
      processingShare: "Agro-processing",
    },
    constitution: {
      constitutionTitle: "Bumbiro loMfelandawonye leMithetho",
      constitutionDesc: "Inqubo zomthetho wecooperative ebhalisiwe ngokuhweba act yeZimbabwe.",
      generateDraft: "Dweba isisekelo somhlahlandlela ngezikhokhelo",
      memberRights: "Inkululeko leAmagunya Elunga",
      coopBylaws: "Bylaws zemisebenzi jikelele",
      coopName: "Proposed Cooperative Entity Name",
      coopNamePlaceholder: "e.g. Gwanda Agave Growers Co-operative Society",
      shareValue: "Initial Capital share value ($)",
      boardMembers: "Minimum Oversight Committee Size",
      downloadDraft: "Export PDF Draft Constitution",
      previewTitle: "Constitution Preview Model Draft",
    },
    coop: {
      coopTitle: "Cooperative Constitution Generator",
      coopDesc: "Draft a governing framework legally aligned with the co-operative legal acts of",
      editorTab: "Parameter Editor",
      previewTab: "Review Bylaws",
      compileConstitution: "Compile Legal Constitution",
      copied: "Copied!",
      copyBtn: "Copy Draft",
      downloadBtn: "Download Draft",
    },
    compliance: {
      checklistTitle: "SADC Export Compliance Checklist",
      checklistDesc: "Landela imithetho emithethweni yaseZimra customs ukuhambisa phesheya.",
      regionalExport: "SADC Surtax-Free Border Roadmap",
      standardSadc: "Regional Preferential Trade Rules",
      statusCompleted: "Approved",
      statusPending: "Required",
      localRulesTitle: "National Border & Regulatory Directives",
      labelingLaw: "Food Ingredients & Labeling Compliance",
      quarantineLaw: "Sorghum & Succulent Quarantine Code",
      coopLaw: "EAC/SADC Inter-cooperative Trade Acts",
      complianceTitle: "Regulatory Compliance roadmap",
      complianceDesc: "Review and check off regulatory permits required to maintain legal standing for local farming and international exports in",
      allMilestones: "All Milestones (Konke)",
      mandatoryOnly: "Mandatory Only",
      verifiedCompliant: "Verified compliant",
      inspectionCheckText: "Check off actions as they undergo certified local board inspections.",
      progressLabel: "Progress:",
      metLabel: "of",
      mandatoryBadge: "Mandatory",
      phase1: "Phase 1: Seed Propagation & Quarantine (Pre-cultivation)",
      phase2: "Phase 2: Local Production & Food Quality (Scale-up)",
      phase3: "Phase 3: Spirit Distillation & Export Trade (Market Launch)",
    },
    telemetry: {
      fieldSoilTelemetry: "Zimbabwe Pilot Telemetry Log",
      dynamicBrixReadings: "Brix Sugar Content egumbini (%)",
      simulatedBrix: "Simulated Brix Value",
      fieldSoilMoisture: "Field Soil Moisture Index (%)",
      liveHeader: "Live Telemetry Feed - Matabeleland South Research Grid",
      boreholePressure: "Borehole Flow safe yield",
      ambientTemp: "Nursery Ambient Heat Index",
      soilPh: "Volcanic Sandy Soil pH",
      sensorLive: "Sensor Grid Active",
      simulatedControls: "Simulated environmental Controls",
      increaseHeat: "Induce Solar Drought Stress",
      wateringPulse: "Activate Micro Drip Cycle",
      fertilizerDrip: "Inject Organic Liquid Compost Potash",
      telemetryTitle: "Chipinge Pilot Farm Telemetry & Yield Data",
      telemetryDesc: "Field logging reports on sugar levels (Brix %), moisture sensors, and plant growth curves.",
      pullLateFeeds: "Pull Late Feeds",
      leafSugarContent: "Leaf Sugar content",
      sugarBrixNotice: "Sugar content is highest in late dry cycles (Sep-Oct). Harvesting at 24%+ Brix guarantees supreme spirit distillates.",
      avgSoilMoisture: "Average Soil Moisture",
      soilMoistureNotice: "Agave thrives at 5% - 20% soil water saturation. Rain season levels above 30% are carefully channeled off.",
      avgHeight: "Average Height",
      stemCore: "Stem Core",
      heightNotice: "Steady development curve proves strong resilience of the Americana strain under low-latitude, semi-arid conditions.",
      twelveMonthCurve: "12-Month Sugar Accumulation Curve (Brix %)",
      curveTooltip: "Click points along the seasonal yield curve to inspect monthly environmental conditions.",
      selectedMonth: "Selected:",
    },
  }
};
