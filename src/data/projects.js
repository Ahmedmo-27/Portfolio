import { Gem, Shield, Smartphone, Globe, Terminal, ExternalLink, Github, Download, FileText, Mic, ClipboardList, Brain, Newspaper } from '../components/icons'
import { assetUrl } from '../utils/assetUrl'

export const projects = [
  {
    id: 'vaultique',
    title: 'Vaultique',
    subtitle: 'Award-Winning E-Commerce Platform 🏆',
    description: 'Built a production-ready luxury watch marketplace that transforms browsers into buyers through seamless payment flows and interactive 3D product visualization.',
    category: 'Full-Stack',
    icon: Gem,
    color: 'from-amber-500 to-yellow-500',
    tech: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'Three.js', 'Twilio', 'CI/CD'],
    features: [
      '**Integrated Stripe** for secure payment processing with full transaction lifecycle',
      '**Built 3D watch configurator** using Three.js WebGL for interactive product visualization',
      '**Created admin analytics dashboard** tracking sales, inventory, and user behavior',
      '**Automated deployment pipeline** with CI/CD reducing deploy time to under 5 minutes',
      '**Implemented real-time SMS notifications** via Twilio for order confirmations',
    ],
    impact: 'Awarded **Best Web Project of MIU 2025** • Serving real users in production',
    role: 'Full-Stack Developer - Built end-to-end architecture, payment integration, and 3D visualization',
    links: {
      demo: 'https://vaultique.live',
      github: 'https://github.com/Ahmedmo-27/Vaultique-MIU',
    },
    ctas: [
      { label: 'View Website', icon: ExternalLink, href: 'https://vaultique.live' },
      { label: 'View Source Code', icon: Github, href: 'https://github.com/Ahmedmo-27/Vaultique-MIU' },
    ],
    isHighlighted: true,
    media: {
      screenshots: [
        '/Projects/Vaultique (1).png',
        '/Projects/Vaultique (2).png',
        '/Projects/Vaultique (3).png',
        '/Projects/Vaultique (4).png',
        '/Projects/Vaultique (5).png'
      ],
      video: null,
      presentation: null,
    },
  },
  {
    id: 'cybertopia',
    title: 'Cybertopia',
    subtitle: 'Cybersecurity Honeypot Platform (DIGITOPIA 2025 Semifinalist)',
    description: 'Deployed an automated SSH honeypot capturing real-world cyberattacks to build threat intelligence for security research.',
    category: 'Security',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    tech: ['Python', 'Cowrie', 'PostgreSQL', 'Node.js', 'DigitalOcean', 'OSINT APIs'],
    features: [
      '**Deployed Cowrie honeypot** on DigitalOcean capturing live SSH attack attempts 24/7',
      '**Captured 500K+ attack logs** from real-world threat actors over 3 months',
      '**Identified 300+ unique attackers** with geolocation and behavior analysis',
      '**Enriched data with OSINT APIs** for IP reputation, ASN, and threat classification',
      '**Built 3 REST APIs** exposing attack data for research and visualization'
    ],
    impact: '**DIGITOPIA 2025 Semifinalist** • Generated largest SSH honeypot dataset in university research',
    role: 'Security Engineer - Designed infrastructure, automated data collection, and built analysis APIs',
    links: {
      github: 'https://github.com/CyberTopians/Cybertopia'
    },
    ctas: [
      { label: 'View Source Code', icon: Github, href: 'https://github.com/CyberTopians/Cybertopia' }
    ],
    isHighlighted: true,
    media: {
      screenshots: [
        assetUrl('/Projects/CyberTopia.png'),
      ],
      video: null,
      presentation: [
        assetUrl('/Projects/Cowrie_Json_Sessions.csv'),
        assetUrl('/Projects/OSINT Report.csv'),
        assetUrl('/Projects/Summary.csv')]
    },
  },
  {
    id: 'msp-miu',
    title: 'MSP-MIU Website',
    subtitle: 'Student Organization Portal',
    description: 'Built the official digital hub for Microsoft Student Partners at MIU, serving 100+ active members with event management and community features.',
    category: 'Full-Stack',
    icon: Globe,
    color: 'from-violet-500 to-purple-500',
    tech: ['Node.js', 'Express', 'MySQL', 'DigitalOcean', 'Heroku', 'Git', 'Cloudflare R2', 'Android WebView'],
    features: [
      '**Built full-stack web application** with Node.js backend and MySQL database',
      '**Created Android WebView app** for mobile-first experience (APK distribution)',
      '**Optimized asset delivery** using Cloudflare R2 for fast global content distribution',
      '**Implemented Git workflow** with separate test/production branches for safe deployments',
      '**Deployed dual infrastructure** on DigitalOcean (database) and Heroku (application)',
    ],
    impact: 'Used by **100+ MSP members** for event registration and community engagement',
    role: 'Lead Developer - Architected infrastructure, built features, and managed deployments',
    links: {
      demo: 'https://msp-miu.tech',
      github: 'https://github.com/MSP-Tech-Club-MIU/MSP-MIU-Website',
    },
    ctas: [
      { label: 'View Website', icon: Globe, href: 'https://msp-miu.tech' },
      { label: 'Download APK', icon: Download, href: assetUrl('/Projects/MSP-MIU.apk') },
      { label: 'View Source Code', icon: Github, href: 'https://github.com/MSP-Tech-Club-MIU/MSP-MIU-Website' },
    ],
    isHighlighted: true,
    media: {
      screenshots: ['/Projects/MSP - MIU (1).png',
         '/Projects/MSP - MIU (2).png', 
         '/Projects/MSP - MIU (3).png', 
         '/Projects/MSP - MIU (4).png'],
      video: null,
      presentation: null,
    },
  },
    {
    id: 'cinemeteor',
    title: 'Cinemeteor',
    subtitle: 'Android Movie Discovery App (DEPI Capstone)',
    description: 'Developed a modern Android app for movie discovery with offline-first architecture and seamless user experience.',
    category: 'Android',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    tech: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Retrofit', 'Room', 'MVVM'],
    features: [
      '**Integrated TMDB API** with Retrofit for real-time movie data and search functionality',
      '**Implemented offline caching** using Room database for seamless offline experience',
      '**Built authentication system** with Firebase Auth and user data persistence in Firestore',
      '**Designed modern UI** with Jetpack Compose and Material Design 3 components',
      '**Added smart features** including movie reviews, similar recommendations, and watchlists',
    ],
    impact: 'Completed as **DEPI capstone project** demonstrating production Android development skills',
    role: 'Android Developer - Built UI, API integration, and offline data synchronization',
    links: {
      demo: assetUrl('/Projects/Cinemeteor.apk'),
      github: 'https://github.com/DEPI-3-Android/Cinemeteor',
    },
    ctas: [
      { label: 'Download APK', icon: Download, href: assetUrl('/Projects/Cinemeteor.apk') },
      { label: 'View Source Code', icon: Github, href: 'https://github.com/DEPI-3-Android/Cinemeteor' },
    ],
    isHighlighted: true,
    media: {
      screenshots: [assetUrl('/Projects/Cinemeteor.png')],
      video: assetUrl('/Projects/Cinemeteor Demo Video.mp4'),
      presentation: null,
    },
  },
  {
    id: 'devops-tooling',
    title: 'NBE DevOps Scripts',
    subtitle: 'Banking System Automation Toolkit',
    description: 'Built automation scripts for National Bank of Egypt\'s core banking systems, improving deployment reliability and reducing manual operations.',
    category: 'DevOps',
    icon: Terminal,
    color: 'from-blue-500 to-cyan-500',
    tech: ['Bash', 'PowerShell', 'Azure DevOps', 'CI/CD', 'Linux'],
    features: [
      '**Created disk automation scripts** for storage management and monitoring alerts',
      '**Built system clean-up utilities** automating log rotation and temp file management',
      '**Developed automated backup solutions** for critical banking data with verification',
      '**Designed Azure DevOps pipelines** for core banking system deployments',
      '**Automated production deployments** reducing deploy time and human error',
    ],
    impact: 'Scripts **adopted by NBE DevOps team** for production banking systems operations',
    role: 'DevOps Intern - Created automation toolkit used in live banking environment',
    links: {
      github: 'https://github.com/NBE-DevOps-Internship-2025/Deployment-Automation-for-Banking-Systems'
    },
    ctas: [
      { label: 'View Scripts', icon: Github, href: 'https://github.com/NBE-DevOps-Internship-2025/Deployment-Automation-for-Banking-Systems' },
      { label: 'Documentation', icon: FileText, href: assetUrl('/Projects/DevOps.pdf') },
    ],
    isHighlighted: true,
    media: {
      screenshots: [],
      video: null,
      presentation: assetUrl('/Projects/DevOps.pdf'),
    },
  },
  {
    id: 'voicescript',
    title: 'VoiceScript',
    subtitle: 'Voice Transcription & Note-Taking App',
    description: 'A modern full-stack voice transcription and note-taking application that converts speech to text in real-time. Supports both live recording and audio file uploads with advanced note organization features.',
    category: 'Full-Stack',
    icon: Mic,
    color: 'from-purple-500 to-pink-500',
    tech: ['React', 'Node.js', 'Express', 'MySQL', 'Python', 'Flask', 'SpeechRecognition'],
    features: [
      'Real-time voice transcription',
      'Audio file upload (WAV, MP3, MP4, M4A, FLAC, OGG, WebM)',
      'Note management with rich text support',
      'Categories & color-coded tags',
      'Full-text search functionality',
      'User authentication & admin dashboard',
      'Multi-language transcription support',
      'Dark/light theme toggle',
      'Pin important notes',
    ],
    links: {
      github: 'https://github.com/ahmedmo-27/VoiceScript'
    },
    ctas: [
      { label: 'View Source Code', icon: Github, href: 'https://github.com/ahmedmo-27/VoiceScript' },
    ],
    isHighlighted: false,
    media: {
      screenshots:[],
      video: [assetUrl('/Projects/VoiceScript – Voice to Text Notes App - Project Details.mp4'), assetUrl('/Projects/VoiceScript – Voice to Text Notes App - Project Details_2.mp4'), assetUrl('/Projects/VoiceScript – Voice to Text Notes App - Project Details_3.mp4'), assetUrl('/Projects/VoiceScript – Voice to Text Notes App - Project Details_4.mp4'), assetUrl('/Projects/VoiceScript – Voice to Text Notes App - Project Details_5.mp4'), assetUrl('/Projects/VoiceScript – Voice to Text Notes App - Project Details_6.mp4'), assetUrl('/Projects/VoiceScript – Voice to Text Notes App - Project Details_7.mp4'), assetUrl('/Projects/VoiceScript – Voice to Text Notes App - Project Details_8.mp4')],
      presentation: null,
    },
  },
  {
    id: 'tickly',
    title: 'Tickly',
    subtitle: 'Task Management Application',
    description: 'A modern, full-stack task management application built with Angular and PHP. Features comprehensive task organization, reminders, user authentication, and an administrative dashboard with analytics.',
    category: 'Full-Stack',
    icon: ClipboardList,
    color: 'from-blue-500 to-indigo-500',
    tech: ['Angular', 'PHP', 'TypeScript', 'MySQL', 'Tailwind CSS', 'Flowbite', 'Chart.js'],
    features: [
      'User authentication & session management',
      'Task CRUD with categories and priorities',
      'Reminder system with email notifications',
      'Admin dashboard with user statistics',
      'Activity logs and system metrics',
      'Responsive design with Tailwind CSS',
      'RESTful API architecture',
      'Password reset via OTP',
      'Task status tracking and deadlines',
    ],
    links: {
      github: 'https://github.com/tickly-miu/tickly',
      demo: 'https://tickly-miu.netlify.app'
    },
    ctas: [
      { label: 'View Source Code', icon: Github, href: 'https://github.com/tickly-miu/tickly' },
      { label: 'View Website', icon: Globe, href: 'https://tickly-miu.netlify.app' },
    ],
    isHighlighted: false,
    media: {
      screenshots: [assetUrl('/Projects/Tickly.png'),assetUrl('/Projects/login.png'), assetUrl('/Projects/homePage.png'), assetUrl('/Projects/createTask.png'),assetUrl('/Projects/category.png'), assetUrl('/Projects/admin.png')],
      video: null,
      presentation: null,
    },
  },
  {
    id: 'credit-card-fraud-detection',
    title: 'Credit Card Fraud Detection',
    subtitle: 'Machine Learning Project',
    description: 'A comprehensive machine learning project implementing and comparing 6 different algorithms (Logistic Regression, Random Forest, XGBoost, SVM, Decision Tree, KNN) for detecting fraudulent credit card transactions. Evaluated on two distinct datasets with comprehensive preprocessing and visualization.',
    category: 'Backend',
    icon: Brain,
    color: 'from-rose-500 to-red-500',
    tech: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    features: [
      '6 ML models implemented and compared',
      'Two distinct fraud detection datasets',
      'Comprehensive preprocessing pipelines',
      'Class imbalance handling techniques',
      'Performance metrics (accuracy, precision, recall, F1, ROC-AUC)',
      'Extensive visualizations and model comparisons',
      'Feature engineering and data analysis',
      'Reproducible evaluation pipelines',
    ],
    links: {
      github: 'https://github.com/Ahmedmo-27/credit-card-fraud-detection-using-ML-models'
    },
    ctas: [
      { label: 'View Source Code', icon: Github, href: 'https://github.com/Ahmedmo-27/credit-card-fraud-detection-using-ML-models' },
    ],
    isHighlighted: false,
    media: {
      screenshots: [
        assetUrl('/Projects/Credit Card Fraud Detection.png'),
        assetUrl('/Projects/Average F1-Score per Model.png'),
        assetUrl('/Projects/Dataset1_Preprocessing.png'),
        assetUrl('/Projects/daily_fraud_count.png'),
        assetUrl('/Projects/figure5_objectives.png'),
      ],
      video: null,
      presentation: null,
    },
  },
  {
    id: 'whatnow',
    title: 'WhatNow',
    subtitle: 'News App (Android)',
    description: 'A modern Android news application built with Kotlin and Firebase. Features real-time news from multiple categories and regions, user authentication, favorites system, dark/light theme, and multilingual support (English & Arabic).',
    category: 'Android',
    icon: Newspaper,
    color: 'from-indigo-500 to-blue-500',
    tech: ['Kotlin', 'Android', 'Firebase', 'Retrofit', 'MVVM', 'Material Design', 'XML'],
    features: [
      'Firebase Authentication (Email/Password & Google Sign-In)',
      'Multiple news categories and regional support',
      'Real-time news fetching via GNews API',
      'Favorites system with Firebase Firestore',
      'Dark/Light theme with system default support',
      'Multilingual support (English & Arabic)',
      'Article sharing and web view',
      'Material Design 3 UI with smooth animations',
    ],
    links: {
      github: 'https://github.com/DEPI-3-Android/WhatNow'
    },
    ctas: [
      { label: 'View Source Code', icon: Github, href: 'https://github.com/DEPI-3-Android/WhatNow' },
    ],
    isHighlighted: false,
    media: {
      screenshots: [assetUrl('/Projects/WhatNow Thumbnail.png')],
      video: assetUrl('/Projects/WhatNow Demo Video.mp4'),
      presentation: null,
    },
  },
  {
    id: 'java-ecommerce',
    title: 'Java E-Commerce System',
    subtitle: 'JavaFX Desktop E‑Commerce Platform',
    description: 'JavaFX-based e-commerce app with multi-role users, inventory, order processing, and file-based persistence.',
    category: 'Full-Stack',
    icon: Globe,
    color: 'from-indigo-500 to-blue-500',
    tech: ['Java', 'JavaFX', 'ExecutorService', 'FXML', 'File I/O', 'Logger'],
    features: [
      '**Multi-role auth** (Admin, Seller, Customer)',
      '**Shopping cart & order processing** with receipts',
      '**Inventory & supplier management** and search',
      '**Concurrent background tasks** using ExecutorService',
      '**File-based persistence** with backup/recovery'
    ],
    impact: 'Demonstrates desktop app architecture, concurrency, and production-ready workflows',
    role: 'Lead Developer — UI, persistence, and service layers',
    links: {
      github: 'https://github.com/Ahmedmo-27/E-Commerce-Application'
    },
    ctas: [
      { label: 'View Source Code', icon: Github, href: 'https://github.com/Ahmedmo-27/E-Commerce-Application' },
    ],
    isHighlighted: false,
    media: {
      /* screenshots: [assetUrl('/Projects/JavaEcom1.png')],
         video: null,
         presentation: null, */
    },
  },
  {
    id: 'stock-trading-algo',
    title: 'Stock Trading Algorithms Comparison',
    subtitle: 'C++ Algorithms + Web Visualization',
    description: 'Comparison of algorithmic trading approaches with C++ implementations and interactive web visualization (Chart.js).',
    category: 'Backend',
    icon: Brain,
    color: 'from-rose-500 to-red-500',
    tech: ['C++', 'JavaScript', 'Chart.js', 'HTML', 'CSS'],
    features: [
      '**Dual implementation**: C++ (core algorithms) and web UI',
      '**Dynamic Programming & Greedy** algorithm comparisons',
      '**Interactive visualization** with Chart.js',
      '**Transaction limits & fee handling**',
      '**Performance & step-by-step execution metrics**'
    ],
    impact: 'Demonstrates algorithm design, performance analysis, and cross-language tooling',
    role: 'Implemented algorithms, C++ demos, and web visualization',
    links: { github: 'https://github.com/ahmedmo-27/stock-trading-algorithms-comparison',
      demo: 'https://stock-trading-algorithms-comparison.vercel.app/'
     },
    ctas: [
      { label : 'View Website', icon: Globe, href: 'https://stock-trading-algorithms-comparison.vercel.app/' },
      { label: 'View Source Code', icon: Github, href: 'https://github.com/ahmedmo-27/stock-trading-algorithms-comparison' },
    ],
    isHighlighted: false,
    media: {
      /* screenshots: [assetUrl('/Projects/StockTrading1.png')],
         video: null,
         presentation: null */
    },
  },
]

