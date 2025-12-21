import { Gem, Shield, Smartphone, Globe, Terminal, ExternalLink, Github, Download, FileText } from 'lucide-react'
import { assetUrl } from '../utils/assetUrl'

export const projects = [
  {
    id: 'vaultique',
    title: 'Vaultique',
    subtitle: 'E-Commerce Platform',
    description: 'Full-stack luxury watch e-commerce platform with payment integration, 3D configurator, CI/CD pipelines, and comprehensive analytics dashboard.',
    icon: Gem,
    color: 'from-amber-500 to-yellow-500',
    tech: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'Three.js', 'Twilio', 'CI/CD'],
    features: [
      'Stripe payment integration',
      '3D watch configurator with Three.js',
      'Internal admin dashboards',
      'Real-time analytics',
      'SMS notifications via Twilio',
    ],
    links: {
      demo: 'https://vaultique.live',
      github: 'https://github.com/ahmedmo-27/Vaultique',
    },
    ctas: [
      { label: 'View Website', icon: ExternalLink, href: 'https://vaultique.live' },
      { label: 'View Source Code', icon: Github, href: 'https://github.com/ahmedmo-27/Vaultique' },
    ],
    award: 'Best Web Project of MIU 2025',
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
    subtitle: 'Honeypot Platform (Digitopia 2025 Semifinalist)',
    description: 'Automated SSH honeypot system capturing 500K+ attack logs with OSINT enrichment and API exposure. Built for cybersecurity research and threat intelligence.',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    tech: ['Python', 'Cowrie', 'PostgreSQL', 'Node.js', 'DigitalOcean', 'OSINT APIs'],
    features: [
      'Cowrie SSH honeypot on DigitalOcean',
      '500K+ SSH attack logs captured',
      '300+ unique attackers identified',
      'OSINT API integration for threat intel',
      '3 REST APIs for data exposure'
    ],
    links: {
      github: 'https://github.com/CyberTopians/Cybertopia'
    },
    ctas: [
      { label: 'View Source Code', icon: 'Github', href: 'https://github.com/CyberTopians/Cybertopia' }
    ],
    award: 'DIGITOPIA 2025 Semifinalist',
    isHighlighted: true,
    media: {
      screenshots: [],
      video: null,
      presentation: [
        assetUrl('/Projects/Cowrie_Json_Sessions.csv'),
        assetUrl('/Projects/OSINT Report.csv'),
        assetUrl('/Projects/Summary.csv')]
    },
  },
  {
    id: 'cinemeteor',
    title: 'Cinemeteor',
    subtitle: 'Android App (DEPI Capstone)',
    description: 'Jetpack Compose movie explorer application with TMDB API integration, featuring caching, reviews, similar movies, and smooth loading UX.',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    tech: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Retrofit', 'Room', 'MVVM'],
    features: [
      'TMDB API integration',
      'Offline caching with Room',
      'Firebase Auth & Firestore',
      'Material Design 3 UI',
      'Movie reviews & similar movies',
    ],
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
      screenshots: ['/Projects/Cinemeteor.png'],
      video: assetUrl('/Projects/Cinemeteor Demo Video.mp4'),
      presentation: null,
    },
  },
  {
    id: 'msp-miu',
    title: 'MSP-MIU Website',
    subtitle: 'Student Organization Portal',
    description: 'Official website for Microsoft Student Partners at MIU. Includes an Android WebView app version, and serves static assets from Cloudflare R2. Built with Node.js backend and MySQL database, deployed on DigitalOcean and Heroku.',
    icon: Globe,
    color: 'from-violet-500 to-purple-500',
    tech: ['Node.js', 'Express', 'MySQL', 'DigitalOcean', 'Heroku', 'Git', 'Cloudflare R2', 'Android WebView'],
    features: [
      'Full-stack web application',
      'Android WebView app version (APK)',
      'MySQL database on DigitalOcean',
      'Heroku deployment',
      'Git workflow with test/production branches',
      'Responsive design',
      'Static assets served from Cloudflare R2',
    ],
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
    id: 'devops-tooling',
    title: 'NBE DevOps Scripts',
    subtitle: 'Automation Toolkit',
    description: 'Comprehensive automation toolkit for DevOps operations including disk automation, clean-up scripts, backup utilities, and Azure deployment pipelines.',
    icon: Terminal,
    color: 'from-blue-500 to-cyan-500',
    tech: ['Bash', 'PowerShell', 'Azure DevOps', 'CI/CD', 'Linux'],
    features: [
      'Disk automation scripts',
      'System clean-up utilities',
      'Automated backup solutions',
      'Azure DevOps pipelines',
      'Production deployment automation',
    ],
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
]

