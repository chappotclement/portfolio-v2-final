import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
    TrendingUp, 
    Target, 
    BarChart3, 
    Megaphone, 
    Database, 
    Calculator, 
    ArrowUpRight, 
    CheckCircle2, 
    Calendar, 
    Mail, 
    Linkedin, 
    Rocket, 
    Code, 
    Network, 
    Palette, 
    LineChart, 
    MessageSquare,
    Activity, 
    Zap, 
    Layers, 
    Settings, 
    Sliders,
    Globe // Added Globe icon for language switch
} from 'lucide-react';

// --- 1. TRANSLATION DATA OBJECT ---
const translations = {
    en: {
        header: {
            about: "About",
            services: "Services",
            caseStudies: "Case Studies",
            contactButton: "Get in Touch",
        },
        hero: {
            badge: "Performance Marketing Expert",
            titleLine1: "I Scale Brands",
            titleLine2: "Profitably.",
            subtitle: "Performance marketing expertise. Bulletproof tracking infrastructure. Strict KPI discipline. Statistical decision-making to maximize results and profitability.",
            cta1: "Book a Strategy Call",
            cta2: "Request Performance Audit",
            stat1: "From Strategy to Activation",
            stat2: "Managed €15M+ in Ads",
            stat3: "Scaled Brands Across Europe",
        },
        about: {
            subtitle: "ABOUT CLÉMENT",
            title: "Driving Digital Growth for 8+ Years: From Concept to Scale.",
            p1: "Eight years mastering the full spectrum of digital growth, from specialized campaign execution to global ecosystem architecture. My expertise spans advanced performance marketing, robust tracking infrastructure, and seamless CRM lifecycle integration.",
            p2: "My philosophy is simple: rigorous analysis meets hands-on execution. I build strategies designed for sustainable, profitable scale where every euro is tracked and every decision is data-backed.",
            p3: "Proven track record scaling campaigns across Meta, Google, and Native platforms throughout Europe, consistently exceeding targets while maintaining strict cost efficiency.",
            stat1Title: "+180%",
            stat1Desc: "YoY Revenue Growth",
            stat2Title: "€15M+",
            stat2Desc: "Ad Spend Managed\nacross platforms",
            stat3Title: "-42%",
            stat3Desc: "CPA Reduction\navg. improvement",
            stat4Title: "+65%",
            stat4Desc: "LTV Increase\nthrough optimization",
        },
        services: {
            subtitle: "SERVICES",
            title: "Delivered Personally, Every Time",
            description: "I ensure direct, hands-on involvement from the initial strategy session to final optimization.",
            service1: {
                title: "Performance Marketing Management",
                desc: "End-to-end campaign management across Meta, Google, and Native platforms, optimized through battle-tested frameworks perfected over €15M+ in ad spend.",
                list: [
                    "Campaign strategy & setup",
                    "Creative testing",
                    "Audience optimization",
                    "Budget management",
                    "Performance Rules Implementation",
                ],
            },
            service2: {
                title: "Advanced Tracking Setup",
                desc: "Build bulletproof tracking infrastructure with GTM, GA4, and server-side tracking for accurate attribution.",
                list: [
                    "GTM implementation",
                    "GA4 configuration",
                    "Conversion tracking",
                    "Server-side setup",
                ],
            },
            service3: {
                title: "Automation & Customer Life Time Value",
                desc: "Implement personalized marketing automation and lead nurturing sequences designed to optimize every stage of the customer lifecycle and maximize LTV.",
                list: [
                    "Workflow automation",
                    "Lead scoring",
                    "Customer Segmentation & Personalization",
                    "Churn Analysis & Prevention",
                    "Email sequences",
                    "CRM integration",
                ],
            },
            service4: {
                title: "Creative Strategy, Production & Optimization",
                desc: "High-performing ad copy, custom landing pages, and precise video briefs, all rooted in current winning trends and data-backed creative frameworks",
                list: [
                    "Trend-Led Video Strategy",
                    "Brand-Aligned Ad Copy Creation",
                    "LP Creation & Optimization",
                    "Systematic testing frameworks",
                ],
            },
            service5: {
                title: "Funnel & Data Analysis",
                desc: "Deep-dive analysis into your conversion funnel to identify bottlenecks and unlock growth opportunities.",
                list: [
                    "Funnel mapping",
                    "Drop-off analysis",
                    "Cohort analysis",
                    "Custom dashboards",
                ],
            },
            service6: {
                title: "Growth Consulting Sessions",
                desc: "Strategic advisory sessions to align your marketing efforts with business goals and identify quick wins.",
                list: [
                    "Strategy sessions",
                    "Performance audits",
                    "Roadmap planning",
                    "Team training",
                ],
            },
            cta: "Discuss Your Project",
        },
        caseStudies: {
            subtitle: "CASE STUDIES",
            title: "Real Results, Real Impact",
            description: "A selection of projects where my hands-on approach delivered measurable business outcomes.",
            case1: {
                tag: "Luxury Watchmaking",
                client: "CODE41",
                challengeTitle: "The Challenge",
                challengeDesc: "Scale paid and organic acquisition profitably while entering new European markets with a premium price point product.",
                approachTitle: "My Approach",
                approachDesc: "Drove scalable and profitable acquisition by leveraging a robust optimization methodology, implementing rigorous creative testing, and developing high-converting funnels.",
                executedTitle: "What I Executed",
                executedList: [
                    "Deployed custom tracking solutions to ensure data accuracy for optimized campaign performance.",
                    "Managed €1,3M+ annual ad spend across Meta, Google, Outbrain and Taboola",
                    "Created 200+ creative variations with systematic testing",
                    "Implemented HubSpot automation to optimize Lead Nurturing and Customer Retention funnels.",
                ],
                resultsTitle: "Results",
                result1Metric: "ROAS",
                result1Value: "4.8x",
                result1Delta: "+128%",
                result2Metric: "Leads Generation",
                result2Value: "450k",
                result3Metric: "CPA",
                result3Value: "€350",
                result4Metric: "Markets",
                result4Value: "6",
            },
            case2: {
                tag: "E-commerce",
                client: "Cell'innov",
                challengeTitle: "The Challenge",
                challengeDesc: "To scale a high-growth D2C business in the competitive senior health supplement market from €1M to €50M+ in revenue within 3 years, while maintaining hyper-profitable acquisition metrics",
                approachTitle: "My Approach",
                approachDesc: "Leveraged robust server-side data and high-converting lead generation/nurturing funnels to achieve scale and profitability significantly beyond initial targets.",
                executedTitle: "What I Executed",
                executedList: [
                    "Managed and deployed full-funnel media campaigns across Google, Facebook, Criteo and Native Ad platforms for acquisition.",
                    "Oversaw and implemented email automation workflows",
                    "Established daily and monthly reporting protocols, including detailed cohort analysis for Customer Lifetime Value (LTV) evolution.",
                    "Handled end-to-end tag and micro-conversion implementation",
                ],
                resultsTitle: "Results",
                result1Metric: "ROAS",
                result1Value: "5x",
                result1Delta: "+30%",
                result2Metric: "Turn Over",
                result2Value: "+5000%",
                result2Delta: "over 3 years",
                result3Metric: "CPL",
                result3Value: "€7",
                result4Metric: "CPA",
                result4Value: "€100",
            },
            case3: {
                tag: "Marketing Agency",
                client: "Amplify",
                challengeTitle: "The Challenge",
                challengeDesc: "The primary objective was to establish a foundation for scalable, data-driven acquisition by addressing key methodological and technical gaps in the existing media strategy.",
                approachTitle: "My Approach",
                approachDesc: "Implemented a rapid performance stabilization methodology, focusing on structural clean-up and data integrity to quickly reduce wasted spend and unlock profitable acquisition scale.",
                executedTitle: "What I Executed",
                executedList: [
                    "Structural optimization of campaign accounts to reduce friction and improve clarity.",
                    "Restructured ad groups and targeting strategies for better budget allocation efficiency.",
                    "Implemented enhanced conversion tracking and server-side tagging for increased data accuracy.",
                    "Provided ongoing consulting and team training on advanced media buying tactics.",
                ],
                resultsTitle: "Results",
                result1Metric: "CPL Reduction",
                result1Value: "-10%",
                result1Delta: "",
                result2Metric: "Activations",
                result2Value: "+132%",
                result2Delta: "in one month",
                result3Metric: "Signup",
                result3Value: "+112%",
                result4Metric: "CPA",
                result4Value: "-18%",
                result4Delta: "in one month",
            },
        },
        contact: {
            subtitle: "GET IN TOUCH",
            title: "Ready to scale with data-driven performance?",
            description: "Let's discuss your growth challenges. Whether you need full campaign management or a one-time audit, I'm here to help you make better decisions with your marketing budget.",
            formName: "Your Name",
            formEmail: "Your Professional Email",
            formProject: "Tell me about your project and goals.",
            formButton: "Send Message",
            contactInfo: "Contact Information",
            calendlyCta: "Schedule a Discovery Call (30 min)",
        },
        footer: {
            copyright: "2025 Clément. All rights reserved.",
            nav: {
                about: "About",
                services: "Services",
                caseStudies: "Case Studies",
            },
        }
    },
    fr: {
        header: {
            about: "À Propos",
            services: "Services",
            caseStudies: "Études de Cas",
            contactButton: "Me Contacter",
        },
        hero: {
            badge: "Expert en Marketing de Performance",
            titleLine1: "Je fais Scaler les Marques.",
            titleLine2: "Avec Profit.",
            subtitle: "Expertise en marketing de performance. Tracking irréprochable. Discipline stricte des KPI. Prise de décision statistique pour maximiser les résultats et la rentabilité.",
            cta1: "Réserver un Appel Stratégique",
            cta2: "Demander un Audit de Performance",
            stat1: "De la stratégie à la mise en œuvre",
            stat2: "Plus de 15M€ de Budgets Publicitaires Gérés",
            stat3: "Expansion de Marques en Europe",
        },
        about: {
            subtitle: "À PROPOS DE CLÉMENT",
            title: "Accélérateur de croissance digitale depuis 8+ ans : De la stratégie au scale.",
            p1: "Huit années à maîtriser l'ensemble du spectre de la croissance digitale, de l'exécution de campagnes spécialisées à l'architecture d'écosystèmes globaux. Mon expertise couvre le performance marketing management, une infrastructure de tracking solide et l'intégration CRM fluide.",
            p2: "Ma philosophie est simple : analyse rigoureuse et exécution terrain. Je construis des stratégies pensées pour un scale durable et rentable, où chaque euro est tracké et chaque décision est data-driven.",
            p3: "Track record prouvé en scaling de campagnes sur Meta, Google et les plateformes Native à travers l'Europe, dépassant constamment les objectifs tout en maintenant une efficacité budgétaire stricte.",
            stat1Title: "+180%",
            stat1Desc: "Croissance des Revenus Annuels",
            stat2Title: "15M€+",
            stat2Desc: "Dépenses Publicitaires Gérées\nsur toutes les plateformes",
            stat3Title: "-42%",
            stat3Desc: "Réduction du CPA\nmoy. d'amélioration",
            stat4Title: "+65%",
            stat4Desc: "Augmentation de la LTV\npar l'optimisation",
        },
        services: {
            subtitle: "SERVICES",
            title: "Une Livraison Personnalisée, à Chaque Fois",
            description: "Je m'implique directement et concrètement, dès la première session stratégique et jusqu'à la phase d'optimisation finale.",
            service1: {
                title: "Performance Marketing Management",
                desc: "Gestion de campagnes end-to-end sur Meta, Google et les plateformes Native, optimisées via des frameworks éprouvés sur plus de 15M€ de budgets publicitaires.",
                list: [
                    "Stratégie & setup de campagnes",
                    "Tests créatifs",
                    "Optimisation d'audiences",
                    "Gestion budgétaire",
                    "Implémentation des Performance Rules",
                ],
            },
            service2: {
                title: "Advanced Tracking Setup",
                desc: "Construisez une infrastructure de tracking bulletproof avec GTM, GA4 et le server-side tracking pour une attribution précise.",
                list: [
                    "Implémentation GTM",
                    "Configuration GA4",
                    "Conversion tracking",
                    "Server-side setup",
                ],
            },
            service3: {
                title: "Automatisation & Valeur Vie Client",
                desc: "Déployez une automation marketing personnalisée et des processus de nurturing conçus pour optimiser chaque étape du cycle client et maximiser la LTV.",
                list: [
                    "Automatisation des workflows",
                    "Scoring de leads",
                    "Segmentation & Personnalisation Client",
                    "Analyse et Prévention du Churn",
                    "Séquence email",
                    "Intégration CRM",
                ],
            },
            service4: {
                title: "Stratégie créative, production et optimisation",
                desc: "Ads copy performantes, landing pages sur-mesure et briefs vidéo précis, le tout ancré dans les tendances gagnantes actuelles et des frameworks créatifs data-driven.",
                list: [
                    "Stratégie vidéo axée sur les tendances",
                    "Création d'ads alignées sur la marque",
                    "Création et optimisation de landing pages",
                    "Tests méthodiques",
                ],
            },
            service5: {
                title: "Analyse d'Entonnoir & de Données",
                desc: "Analyses approfondies de votre funnel de conversion pour identifier les blocages et débloquer des opportunités de croissance.",
                list: [
                    "Funnel mapping",
                    "Analyse des abandons",
                    "Analyse de cohorte",
                    "Dashboards personnalisés",
                ],
            },
            service6: {
                title: "Sessions de Conseil en Croissance",
                desc: "Sessions de conseil stratégique pour aligner vos efforts marketing avec vos objectifs business et identifier des quick wins.",
                list: [
                    "Sessions de stratégie",
                    "Audits de performance",
                    "Planification de la Roadmap",
                    "Formation d'équipe",
                ],
            },
            cta: "Discuter de Votre Projet",
        },
        caseStudies: {
            subtitle: "ÉTUDES DE CAS",
            title: "Résultats Réels, Impact Réel",
            description: "Une sélection de projets où mon approche pratique a généré des résultats commerciaux mesurables.",
            case1: {
                tag: "Horlogerie de Luxe",
                client: "CODE41",
                challengeTitle: "Le Défi",
                challengeDesc: "Augmenter l'acquisition payante et organique de manière rentable tout en pénétrant de nouveaux marchés européens avec un produit haut de gamme.",
                approachTitle: "Mon Approche",
                approachDesc: "Accélération de l'acquisition évolutive et rentable en tirant parti d'une méthodologie d'optimisation robuste, de tests créatifs rigoureux et du développement d'entonnoirs à forte conversion.",
                executedTitle: "Ce que J'ai Exécuté",
                executedList: [
                    "Déploiement de solutions de suivi personnalisées pour garantir l'exactitude des données pour des performances de campagne optimisées.",
                    "Gestion de plus de 1,3M€ de dépenses publicitaires annuelles sur Meta, Google, Outbrain et Taboola",
                    "Création de plus de 200 variations créatives avec des tests systématiques",
                    "Mise en œuvre de l'automatisation HubSpot pour optimiser les entonnoirs de Lead Nurturing et de Rétention Client.",
                ],
                resultsTitle: "Résultats",
                result1Metric: "ROAS",
                result1Value: "4.8x",
                result1Delta: "+128%",
                result2Metric: "Génération de Leads",
                result2Value: "450k",
                result3Metric: "CPA",
                result3Value: "€350",
                result4Metric: "Marchés",
                result4Value: "6",
            },
            case2: {
                tag: "E-commerce",
                client: "Cell'innov",
                challengeTitle: "Le Défi",
                challengeDesc: "Faire passer une entreprise D2C à forte croissance sur le marché concurrentiel des compléments alimentaires pour seniors de 1M€ à plus de 50M€ de revenus en 3 ans, tout en maintenant des métriques d'acquisition hyper-rentables.",
                approachTitle: "Mon Approche",
                approachDesc: "Utilisation de données côté serveur robustes et d'entonnoirs de génération/nurturing de leads à forte conversion pour atteindre une échelle et une rentabilité sans précédent.",
                executedTitle: "Ce que J'ai Exécuté",
                executedList: [
                    "Gestion et déploiement de campagnes médias 'full-funnel' sur Google, Facebook, Criteo et plateformes Native Ad pour l'acquisition.",
                    "Supervision et mise en œuvre des workflows d'automatisation des e-mails",
                    "Établissement de protocoles de reporting quotidiens et mensuels, y compris une analyse de cohorte détaillée pour l'évolution de la Valeur Vie Client (LTV).",
                    "Gestion de l'implémentation de tags et de micro-conversions de bout en bout",
                ],
                resultsTitle: "Résultats",
                result1Metric: "ROAS",
                result1Value: "5x",
                result1Delta: "+30%",
                result2Metric: "Chiffre d'Affaires",
                result2Value: "+5000%",
                result2Delta: "sur 3 ans",
                result3Metric: "CPL",
                result3Value: "€7",
                result4Metric: "CPA",
                result4Value: "€100",
            },
            case3: {
                tag: "Agence Marketing",
                client: "Amplify",
                challengeTitle: "Le Défi",
                challengeDesc: "L'objectif principal était d'établir une base pour une acquisition évolutive et axée sur les données en comblant les lacunes méthodologiques et techniques clés dans la stratégie média existante.",
                approachTitle: "Mon Approche",
                approachDesc: "Mise en œuvre d'une méthodologie de stabilisation rapide des performances, axée sur le nettoyage structurel et l'intégrité des données pour réduire rapidement les dépenses inutiles et débloquer une échelle d'acquisition rentable.",
                executedTitle: "Ce que J'ai Exécuté",
                executedList: [
                    "Optimisation structurelle des comptes de campagne pour réduire la friction et améliorer la clarté.",
                    "Restructuration des groupes d'annonces et des stratégies de ciblage pour une meilleure efficacité d'allocation budgétaire.",
                    "Mise en œuvre d'un suivi des conversions et d'un balisage côté serveur améliorés pour une précision accrue des données.",
                    "Fourniture de conseils et de formations d'équipe continus sur les tactiques d'achat média avancées.",
                ],
                resultsTitle: "Results",
                result1Metric: "Réduction du CPL",
                result1Value: "-10%",
                result1Delta: "",
                result2Metric: "Activations",
                result2Value: "+132%",
                result2Delta: "en un mois",
                result3Metric: "Inscriptions",
                result3Value: "+112%",
                result4Metric: "CPA",
                result4Value: "-18%",
                result4Delta: "en un mois",
            },
        },
        contact: {
            subtitle: "CONTACTEZ-MOI",
            title: "Prêt à scaler avec une performance axée sur les données?",
            description: "Discutons ensemble de vos défis en matière de croissance. Que vous ayez besoin d'une gestion complète de votre campagne ou d'un audit ponctuel, je suis là pour vous aider à prendre de meilleures décisions concernant votre budget marketing.",
            formName: "Votre Nom",
            formEmail: "Votre E-mail Professionnel",
            formProject: "Parlez-moi de votre projet et de vos objectifs.",
            formButton: "Envoyer le Message",
            contactInfo: "Coordonnées",
            calendlyCta: "Planifier un Appel Découverte (30 min)",
        },
        footer: {
            copyright: "2025 Clément. Tous droits réservés.",
            nav: {
                about: "À Propos",
                services: "Services",
                caseStudies: "Études de Cas",
            },
        }
    }
};

// --- 2. LANGUAGE CONTEXT SETUP ---
const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    // Initialize language from localStorage or default to 'fr' (since the user is French-speaking)
    const storedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    const [language, setLanguage] = useState(storedLang || 'en');

    useEffect(() => {
        // Save language to localStorage whenever it changes
        localStorage.setItem('lang', language);
    }, [language]);

    // Function to get the correct translation object
    const t = translations[language] || translations.fr;

    // Function to switch language
    const toggleLanguage = () => {
        setLanguage(prevLang => (prevLang === 'fr' ? 'en' : 'fr'));
    };

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook for easier use
const useLanguage = () => useContext(LanguageContext);

// --- 3. LANGUAGE SWITCHER COMPONENT ---
const LanguageSwitcher = () => {
    const { language, toggleLanguage } = useLanguage();
    const isFrench = language === 'fr';

    return (
        <button
            onClick={toggleLanguage}
            aria-label={`Switch language to ${isFrench ? 'English' : 'Français'}`}
            className="flex items-center space-x-2 p-2 rounded-full border border-gray-700 hover:bg-slate-800 transition duration-300"
        >
            <Globe size={18} className="text-yellow-500" />
            <span className="text-sm font-semibold text-white">
                {isFrench ? 'EN' : 'FR'}
            </span>
        </button>
    );
};

// --- Helper component for Services List ---
const ServiceItem = ({ icon: Icon, title, description, list }) => {
    const { t } = useLanguage();
    const arrow = t.services.service1.list[0].includes("→") ? "→" : "▸"; // Use original list style or derived one

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="bg-gray-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-100 transition-colors">
                <Icon className="text-gray-600 group-hover:text-yellow-600 transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
                {title}
            </h3>
            <p className="text-gray-600 text-sm mb-6">
                {description}
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
                {list.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold mt-1">
                            {arrow}
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- Helper component for Case Study Result Box ---
const ResultBox = ({ metric, value, delta }) => {
    const color = delta && delta.trim().startsWith('-') ? 'text-red-600' : 'text-green-600';
    return (
        <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-xs text-gray-500 mb-1">{metric}</div>
            <div className="text-3xl font-extrabold text-slate-900">{value}</div>
            {delta ? <div className={`text-xs ${color} font-semibold`}>{delta}</div> : null}
        </div>
    );
};

// --- Helper component for Case Study Card ---
const CaseStudyCard = ({ caseData, tagBg, tagText, bgColor }) => {
    const { t } = useLanguage();
    return (
        <div className="grid md:grid-cols-12 gap-8 bg-white rounded-3xl overflow-hidden shadow-lg">
            
            {/* Left: Project Info */}
            <div className={`md:col-span-5 ${bgColor} text-white p-10`}>
                <div className={`inline-block ${tagBg} ${tagText} text-xs px-3 py-1 rounded-full mb-6`}>
                    {caseData.tag}
                </div>
                
                <h3 className="text-4xl font-extrabold mb-6">{caseData.client}</h3>
                
                <div className="mb-6">
                    <h4 className={`text-sm font-semibold ${tagText.replace('text-', 'text-')} mb-2`}>{caseData.challengeTitle}</h4>
                    <p className={`text-sm leading-relaxed ${tagText.replace('text-', 'text-').replace('100', '50').replace('200', '50')}`}>
                        {caseData.challengeDesc}
                    </p>
                </div>
                
                <div>
                    <h4 className={`text-sm font-semibold ${tagText.replace('text-', 'text-')} mb-2`}>{caseData.approachTitle}</h4>
                    <p className={`text-sm leading-relaxed ${tagText.replace('text-', 'text-').replace('100', '50').replace('200', '50')}`}>
                        {caseData.approachDesc}
                    </p>
                </div>
            </div>

            {/* Right: Execution & Results */}
            <div className="md:col-span-7 p-10">
                <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* What I Executed */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <span className="text-yellow-600">⚡</span>
                            </div>
                            <h4 className="font-bold text-slate-900">{caseData.executedTitle}</h4>
                        </div>
                        
                        <ul className="space-y-3 text-sm text-gray-700">
                            {caseData.executedList.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-yellow-600 mt-1">→</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Results */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <TrendingUp className="text-green-600" size={16} />
                            </div>
                            <h4 className="font-bold text-slate-900">{caseData.resultsTitle}</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <ResultBox 
                                metric={caseData.result1Metric} 
                                value={caseData.result1Value} 
                                delta={caseData.result1Delta} 
                            />
                            <ResultBox 
                                metric={caseData.result2Metric} 
                                value={caseData.result2Value} 
                                delta={caseData.result2Delta} 
                            />
                            <ResultBox 
                                metric={caseData.result3Metric} 
                                value={caseData.result3Value} 
                                delta={caseData.result3Delta} 
                            />
                            <ResultBox 
                                metric={caseData.result4Metric} 
                                value={caseData.result4Value} 
                                delta={caseData.result4Delta} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- 4. MAIN APP COMPONENT ---
function AppContent() {
    const { t } = useLanguage();
    
    // Helper function for About section stats desc (handles newline in translation file)
    const renderStatDescription = (desc) => {
        return desc.split('\n').map((line, index) => (
            <span key={index} className="block">{line}</span>
        ));
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header/Navigation */}
            <header className="sticky top-0 w-full bg-slate-900 text-white z-50 border-b border-slate-800 backdrop-blur-sm bg-opacity-90 transition-all duration-300">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-2xl font-bold">CC.</div>
                    <div className="hidden md:flex space-x-8 text-gray-400">
                        <a href="#about" className="hover:text-white transition">{t.header.about}</a>
                        <a href="#services" className="hover:text-white transition">{t.header.services}</a>
                        <a href="#case-studies" className="hover:text-white transition">{t.header.caseStudies}</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        <a href="#contact" className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition">
                            {t.header.contactButton}
                        </a>
                    </div>
                </nav>
            </header>

{/* Hero Section */}
<section className="pt-32 pb-20 px-6">
    <div className="container mx-auto text-center">
        
        {/* Badge */}
        <div className="inline-block mb-8">
            <span className="border border-yellow-600 text-yellow-500 px-6 py-2 rounded-full text-sm font-medium">
                {t.hero.badge}
            </span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
            {t.hero.titleLine1}
        </h1>
        <h1 className="text-6xl md:text-7xl font-bold text-yellow-500 mb-8">
            {t.hero.titleLine2}
        </h1>

        {/* Subtitle Area with Profile Picture & Socials (MISE À JOUR) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto mb-12">
            
            {/* Photo de profil */}
            <div className="shrink-0 relative">
                <img 
                    src="https://i.ibb.co/fbC4qVF/clement-photo-de-profil.png" 
                    alt="Profile" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-yellow-500 object-cover shadow-lg"
                />
            </div>

            {/* Texte et Liens Sociaux */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
                <p className="text-gray-400 text-lg md:text-xl mb-4">
                    {t.hero.subtitle}
                </p>

                {/* NOUVEAUX LIENS SOCIAUX */}
                <div className="flex space-x-4">
                    {/* Lien LinkedIn */}
                    <a 
                        href="https://www.linkedin.com/in/clementchappot/"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                        aria-label="Profil LinkedIn"
                    >
                        {/* Assurez-vous d'avoir importé { Linkedin } en haut du fichier */}
                        <Linkedin size={28} />
                    </a>
                    
                    {/* Lien WhatsApp (wa.me/CodePaysNumero) */}
                    <a 
                        href="https://wa.me/41798102112"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                        aria-label="Contacter sur WhatsApp"
                    >
                        {/* Assurez-vous d'avoir importé { MessageSquare } en haut du fichier */}
                        <MessageSquare size={28} /> 
                    </a>
                </div>
            </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a 
                href="#contact"
                className="bg-yellow-500 text-black px-8 py-4 rounded-full font-semibold hover:bg-yellow-400 transition flex items-center justify-center">
                {t.hero.cta1}
                <span className="ml-2">→</span>
            </a>
            <a 
                href="#contact" 
                className="bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition">
                {t.hero.cta2}
            </a>
        </div>

        {/* Stats/Credentials */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-gray-400">
            <div className="flex items-center gap-3 bg-slate-800 px-6 py-3 rounded-lg">
                <TrendingUp className="text-yellow-500" size={24} />
                <span>{t.hero.stat1}</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800 px-6 py-3 rounded-lg">
                <Target className="text-yellow-500" size={24} />
                <span>{t.hero.stat2}</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-800 px-6 py-3 rounded-lg">
                <BarChart3 className="text-yellow-500" size={24} />
                <span>{t.hero.stat3}</span>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-20">
            <div className="inline-flex flex-col items-center">
                <div className="w-6 h-10 border-2 border-yellow-500 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    </div>
</section>
            
            {/* About Section */}
            <section id="about" className="py-20 px-6 bg-white text-slate-900">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        
                        {/* Left Column: Text */}
                        <div>
                            <span className="text-yellow-600 uppercase tracking-widest text-sm font-semibold mb-3 block">
                                {t.about.subtitle}
                            </span>
                            <h2 className="text-5xl font-extrabold mb-8 leading-tight">
                                {t.about.title}
                            </h2>
                            
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {t.about.p1}
                            </p>
                            <p
                                className="text-gray-600 mb-8 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: t.about.p2 }}
                            />
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {t.about.p3}
                            </p>
                        </div>

                        {/* Right Column: Stats Grid 2x2 */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Card 1: +180% */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:bg-yellow-500 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                                <TrendingUp className="text-yellow-600 group-hover:text-black mb-4 transition-colors" size={32} />
                                <h3 className="text-4xl font-extrabold text-slate-900 group-hover:text-black mb-2 transition-colors">{t.about.stat1Title}</h3>
                                <p className="text-gray-600 group-hover:text-black text-sm transition-colors">{renderStatDescription(t.about.stat1Desc)}</p>
                            </div>

                            {/* Card 2: €15M+ */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:bg-yellow-500 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                                <span className="text-4xl font-extrabold text-yellow-600 group-hover:text-black block mb-4 transition-colors">€</span>
                                <h3 className="text-4xl font-extrabold text-slate-900 group-hover:text-black mb-2 transition-colors">{t.about.stat2Title}</h3>
                                <p className="text-gray-600 group-hover:text-black text-sm transition-colors">{renderStatDescription(t.about.stat2Desc)}</p>
                            </div>

                            {/* Card 3: -42% */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:bg-yellow-500 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                                <Target className="text-yellow-600 group-hover:text-black mb-4 transition-colors" size={32} />
                                <h3 className="text-4xl font-extrabold text-slate-900 group-hover:text-black mb-2 transition-colors">{t.about.stat3Title}</h3>
                                <p className="text-gray-600 group-hover:text-black text-sm transition-colors">{renderStatDescription(t.about.stat3Desc)}</p>
                            </div>

                            {/* Card 4: +65% */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:bg-yellow-500 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                                <BarChart3 className="text-yellow-600 group-hover:text-black mb-4 transition-colors" size={32} />
                                <h3 className="text-4xl font-extrabold text-slate-900 group-hover:text-black mb-2 transition-colors">{t.about.stat4Title}</h3>
                                <p className="text-gray-600 group-hover:text-black text-sm transition-colors">{renderStatDescription(t.about.stat4Desc)}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section> 
            
            {/* Services Section */}
            <section id="services" className="py-20 px-6 bg-gray-50">
                <div className="container mx-auto max-w-7xl">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="text-yellow-600 uppercase tracking-widest text-sm font-semibold mb-3 block">
                            {t.services.subtitle}
                        </span>
                        <h2 className="text-5xl font-extrabold mb-4 text-slate-900">
                            {t.services.title}
                        </h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            {t.services.description}
                        </p>
                    </div>

                    {/* Services Grid - 3 columns, 2 rows */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        
                        <ServiceItem 
                            icon={Rocket} 
                            title={t.services.service1.title} 
                            description={t.services.service1.desc} 
                            list={t.services.service1.list}
                        />

                        <ServiceItem 
                            icon={Code} 
                            title={t.services.service2.title} 
                            description={t.services.service2.desc} 
                            list={t.services.service2.list}
                        />

                        <ServiceItem 
                            icon={Network} 
                            title={t.services.service3.title} 
                            description={t.services.service3.desc} 
                            list={t.services.service3.list}
                        />

                        <ServiceItem 
                            icon={Palette} 
                            title={t.services.service4.title} 
                            description={t.services.service4.desc} 
                            list={t.services.service4.list}
                        />

                        <ServiceItem 
                            icon={LineChart} 
                            title={t.services.service5.title} 
                            description={t.services.service5.desc} 
                            list={t.services.service5.list}
                        />

                        <ServiceItem 
                            icon={MessageSquare} 
                            title={t.services.service6.title} 
                            description={t.services.service6.desc} 
                            list={t.services.service6.list}
                        />

                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                        <a 
                            href="#contact" 
                            className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-800 transition duration-300 inline-flex items-center gap-2"
                        >
                            {t.services.cta}
                            <span>→</span>
                        </a>
                    </div>

                </div>
            </section>

            {/* Case Studies Section */}
            <section id="case-studies" className="py-20 px-6 bg-white text-slate-900">
                <div className="container mx-auto max-w-7xl">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="text-yellow-600 uppercase tracking-widest text-sm font-semibold mb-3 block">
                            {t.caseStudies.subtitle}
                        </span>
                        <h2 className="text-5xl font-extrabold mb-4 text-slate-900">
                            {t.caseStudies.title}
                        </h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            {t.caseStudies.description}
                        </p>
                    </div>

                    {/* Case Study Cards */}
                    <div className="space-y-8">
                        
                        {/* Case Study 1: CODE41 - Navy Blue */}
                        <CaseStudyCard 
                            caseData={t.caseStudies.case1}
                            bgColor="bg-slate-900"
                            tagBg="bg-slate-800"
                            tagText="text-gray-400"
                        />

                        {/* Case Study 2: E-commerce Client - Orange */}
                        <CaseStudyCard 
                            caseData={t.caseStudies.case2}
                            bgColor="bg-orange-600"
                            tagBg="bg-orange-700"
                            tagText="text-orange-200"
                        />
                        
                        {/* Case Study 3: Marketing Agency - Blue */}
                        <CaseStudyCard 
                            caseData={t.caseStudies.case3}
                            bgColor="bg-blue-600"
                            tagBg="bg-blue-700"
                            tagText="text-blue-200"
                        />

                    </div>
                </div>
            </section>
            
            {/* Contact Section */}
            <section id="contact" className="py-20 px-6 bg-slate-900 text-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        
                        {/* Left: Text & Contact Info */}
                        <div>
                            <span className="text-yellow-600 uppercase tracking-widest text-sm font-semibold mb-3 block">
                                {t.contact.subtitle}
                            </span>
                            <h2 className="text-5xl font-extrabold mb-6">
                                {t.contact.title}
                            </h2>
                            <p className="text-gray-400 text-lg mb-10">
                                {t.contact.description}
                            </p>
                            <ul className="space-y-3 text-gray-400">
                                <li className="mt-8">
                                    <a 
                                        href="#" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-yellow-400 transition"
                                    >
                                        <Calendar size={20}/>
                                        {t.contact.calendlyCta}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Right: Contact Form (Static Placeholder) */}
                        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl">
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">{t.contact.formName}</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        className="w-full p-3 rounded-lg bg-slate-700 border border-slate-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white" 
                                        placeholder={t.contact.formName}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">{t.contact.formEmail}</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="w-full p-3 rounded-lg bg-slate-700 border border-slate-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white" 
                                        placeholder={t.contact.formEmail}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-2">{t.contact.formProject}</label>
                                    <textarea 
                                        id="project" 
                                        rows="4" 
                                        className="w-full p-3 rounded-lg bg-slate-700 border border-slate-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white" 
                                        placeholder={t.contact.formProject}
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
                                >
                                    {t.contact.formButton}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6 text-gray-400">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm">
                    <div className="mb-4 md:mb-0">
                        {t.footer.copyright}
                    </div>
                    <div className="flex space-x-6">
                        <a href="#about" className="hover:text-white transition">{t.footer.nav.about}</a>
                        <a href="#services" className="hover:text-white transition">{t.footer.nav.services}</a>
                        <a href="#case-studies" className="hover:text-white transition">{t.footer.nav.caseStudies}</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Wrap AppContent in LanguageProvider
export default function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}