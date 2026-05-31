import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "es" | "fr";

export interface LocalizationContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Full app-wide translation dictionary
export const translations: Record<string, Record<Language, string>> = {
  // Navigation Tabs (strictly requested dictionary)
  "nav.chat": {
    en: "Chat",
    es: "Chat",
    fr: "Chat",
  },
  "nav.dashboard": {
    en: "Dashboard",
    es: "Panel",
    fr: "Tableau",
  },
  "nav.workouts": {
    en: "Workouts",
    es: "Entrenamientos",
    fr: "Entraînements",
  },
  "nav.nutrition": {
    en: "Nutrition",
    es: "Nutrición",
    fr: "Nutrition",
  },
  "nav.journal": {
    en: "Journal",
    es: "Diario",
    fr: "Journal",
  },

  // Dashboard Header (strictly requested dictionary)
  "dashboard.header": {
    en: "TASTING & WELLNESS DASHBOARD",
    es: "PANEL DE DEGUSTACIÓN Y BIENESTAR",
    fr: "TABLEAU DE BORD DÉGUSTATION & BIEN-ÊTRE",
  },

  // Chat/Gerdy Tab Translations
  "chat.welcome": {
    en: "Welcome to Overhaultrain.",
    es: "Bienvenido a Overhaultrain.",
    fr: "Bienvenue sur Overhaultrain.",
  },
  "chat.sub": {
    en: "your voice-coach concierge. Tap the map, teleport, or type questions of gyms, running trails or healthy restaurants nearby!",
    es: "tu conserje de voz. ¡Toca el mapa, transpórtate o escribe preguntas sobre gimnasios, senderos o restaurantes saludables cercanos!",
    fr: "votre coach vocal. Touchez la carte, téléportez-vous ou posez des questions sur les salles de sport, les sentiers ou les restaurants sains à proximité!",
  },
  "chat.placeholder": {
    en: "Ask Gerdy to search nearby gyms, healthy food...",
    es: "Pregúntale a Gerdy para buscar gimnasios, comida saludable...",
    fr: "Demandez à Gerdy pour chercher des gymnases, nourriture saine...",
  },
  "chat.voice_button": {
    en: "HOLD TO SPEAK RADAR VIA COGNITIVE AI",
    es: "MANTÉN PULSADO PARA HABLAR POR RADAR DE IA",
    fr: "MAINTENEZ POUR PARLER PAR RADAR IA",
  },
  "chat.voice_sub": {
    en: "Mic transmits only while held active. Fully hands-free optimized feedback loop.",
    es: "El micrófono transmite solo mientras está activo. Bucle de retroalimentación de manos libres.",
    fr: "Le micro transmet uniquement s'il est actif. Boucle de retour mains libres.",
  },

  // Dashboard Tab Translations
  "dashboard.training_streak": {
    en: "Training Streak",
    es: "Racha de Entrenamiento",
    fr: "Série d'Entraînement",
  },
  "dashboard.days": {
    en: "days",
    es: "días",
    fr: "jours",
  },
  "dashboard.longest": {
    en: "Longest",
    es: "Más larga",
    fr: "Plus longue",
  },
  "dashboard.calories_today": {
    en: "Calories Today",
    es: "Calorías de Hoy",
    fr: "Calories Aujourd'hui",
  },
  "dashboard.target": {
    en: "Target",
    es: "Meta",
    fr: "Cible",
  },
  "dashboard.wearable_sync": {
    en: "Wearable Sync",
    es: "Sincronización de Dispositivos",
    fr: "Synchronisation des Appareils",
  },
  "dashboard.weekly_graph": {
    en: "Weekly Health & Mood Graph",
    es: "Gráfico Semanal de Salud y Ánimo",
    fr: "Graphique Hebdomadaire de Santé et d'Humeur",
  },

  // Workout Hub Tab Translations
  "workouts.header": {
    en: "Select Guided Fitness Session",
    es: "Seleccionar Sesión de Fitness Guiada",
    fr: "Sélectionner une Séance de Fitness Guidée",
  },
  "workouts.sub": {
    en: "Select an elite training program. Your AI Coach will establish voice coaching directives and guide you step-by-step through execution!",
    es: "Selecciona un programa de entrenamiento élite. ¡Tu Entrenador de IA establecerá instrucciones de voz y te guiará paso a paso!",
    fr: "Sélectionnez un programme d'entraînement d'élite. Votre coach IA établira des instructions vocales et vous guidera étape par étape!",
  },
  "workouts.run": {
    en: "Run Session",
    es: "Iniciar Sesión",
    fr: "Lancer la Séance",
  },
  "workouts.custom_planner": {
    en: "Custom Planner & Grounding Generator",
    es: "Planificador Personalizado y Generador de Ubicaciones",
    fr: "Planificateur Personnalisé et Générateur d'Emplacements",
  },
  "workouts.target_muscle": {
    en: "Target Muscle Core",
    es: "Grupo Muscular Objetivo",
    fr: "Groupe Musculaire Ciblé",
  },
  "workouts.duration": {
    en: "Duration",
    es: "Duración",
    fr: "Durée",
  },
  "workouts.generate": {
    en: "GENERATE DRILL PATHS & PIN NEAREST SPORTS REGION",
    es: "GENERAR RUTAS DE ENTRENAMIENTO Y MARCAR DEPORTES",
    fr: "GÉNÉRER DES PARCOURS ET ÉPINGLER LE SPORT",
  },

  // Nutrition Tab Translations
  "nutrition.header": {
    en: "Daily Macronutrient Target Index",
    es: "Índice de Macronutrientes Diario",
    fr: "Indice Journalier des Macronutriments",
  },
  "nutrition.sub": {
    en: "Analyze your daily macronutrients and log food to align with your energy indexes.",
    es: "Analiza tus macronutrientes diarios y registra alimentos para alinearte con tus índices de energía.",
    fr: "Analysez vos macronutriments quotidiens et enregistrez vos aliments pour vous aligner sur vos indices énergétiques.",
  },
  "nutrition.calories_limit": {
    en: "CALORIES LIMIT GAUGE",
    es: "INDICADOR DE LÍMITE DE CALORÍAS",
    fr: "JAUGE DE LIMITE DE CALORIES",
  },
  "nutrition.add_food": {
    en: "Log New Meal Option & Nutrition",
    es: "Registrar Nueva Comida y Nutrición",
    fr: "Enregistrer un Nouveau Repas et sa Nutrition",
  },

  // Tasting Journal Tab Translations
  "journal.header": {
    en: "Tasting & Wellness Journal",
    es: "Diario de Degustación y Bienestar",
    fr: "Journal de Dégustation et de Bien-être",
  },
  "journal.sub": {
    en: "Log flavor tags and sensory ratings here to discover culinary combinations that meet your target fitness fuel metrics perfectly.",
    es: "Registra etiquetas de sabor y calificaciones sensoriales aquí para descubrir combinaciones culinarias que cumplan con tus métricas de acondicionamiento físico.",
    fr: "Enregistrez ici les étiquettes de saveur et les évaluations sensorielles pour découvrir des combinaisons culinaires qui répondent parfaitement à vos objectifs de fitness.",
  },
  "journal.recent_history": {
    en: "Recent Culinary Tasting History",
    es: "Historial de Degustación Culinaria Reciente",
    fr: "Historique Récent des Dégustations Culinaires",
  },
  "journal.add_entry": {
    en: "Add New Entry",
    es: "Añadir Nueva Entrada",
    fr: "Ajouter une Entrée",
  },
  "journal.why_track": {
    en: "Why track recovery status?",
    es: "¿Por qué registrar el estado de recuperación?",
    fr: "Pourquoi suivre l'état de récupération?",
  }
};

const LocalizationContext = createContext<LocalizationContextProps | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Persistence setup
    const savedLang = localStorage.getItem("overhaultrain_language") as Language;
    if (savedLang === "en" || savedLang === "es" || savedLang === "fr") {
      return savedLang;
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("overhaultrain_language", lang);
  };

  const t = (key: string): string => {
    const translationSet = translations[key];
    if (!translationSet) {
      return key;
    }
    return translationSet[language] || translationSet["en"] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
};
