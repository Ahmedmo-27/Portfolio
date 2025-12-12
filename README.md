# Ahmed Mostafa - Portfolio Website

A modern, professional portfolio website built with React, TypeScript, Vite, and TailwindCSS. Features a premium dark/light theme system with smooth transitions.

## 🚀 Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with CSS Variables
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme:** Dark/Light mode with localStorage persistence

## ✨ Features

- 🌙 **Dark/Light Mode** - Smooth theme toggle with system preference detection
- 🎨 **Premium Design** - Corporate, dev-focused aesthetic with glassmorphism
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ⚡ **Fast Loading** - Vite-powered development and builds
- 🎯 **SEO Optimized** - Meta tags and semantic HTML
- 📧 **Contact Form** - Ready for email service integration
- 🖼️ **Media Placeholders** - Clear slots for project screenshots, videos, and presentations

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Navigation with theme toggle
│   ├── ThemeToggle.tsx     # Dark/light mode switcher
│   ├── ProfileCard.tsx     # Hero section profile card
│   ├── Hero.tsx            # Hero section with profile
│   ├── About.tsx           # About section
│   ├── Skills.tsx          # Technical skills grid
│   ├── Experience.tsx      # Work experience timeline
│   ├── Projects.tsx        # Projects with media placeholders
│   ├── Achievements.tsx    # Awards & recognition
│   ├── Contact.tsx         # Contact form & info
│   ├── Footer.tsx          # Site footer
│   └── MediaPlaceholder.tsx # Reusable media placeholder
├── context/
│   └── ThemeContext.tsx    # Theme provider & hook
├── utils/
│   └── animations.ts       # Framer Motion variants
├── App.tsx                 # Main app with ThemeProvider
├── main.tsx                # Entry point
└── index.css               # Global styles & theme variables
```

## 🎨 Theme System

The portfolio uses CSS custom properties for seamless theme switching:

### Dark Mode (Default)
- Deep slate backgrounds
- High contrast text
- Subtle gradient overlays

### Light Mode
- Clean white/gray backgrounds  
- Darker text for readability
- Softer gradient accents

### Theme Variables
```css
--color-background    /* Page background */
--color-foreground    /* Primary text */
--color-card          /* Card backgrounds */
--color-surface       /* Surface elements */
--color-border        /* Borders */
--color-muted         /* Secondary text */
```

## 📝 Customization

### Adding Your Profile Photo

In `ProfileCard.tsx`, uncomment and update:
```tsx
<img 
  src="/profile-photo.jpg" 
  alt="Ahmed Mostafa" 
  className="w-full h-full object-cover"
/>
```

### Adding Project Media

Each project has dedicated placeholders for:
- **Screenshots** - Product/app screenshots
- **Video Demo** - Walkthrough or demo videos
- **Presentation** - Architecture diagrams, slides, PDFs

Replace the placeholder components with actual media:
```tsx
<img src="/projects/vaultique-1.png" alt="Vaultique Dashboard" />
<video src="/projects/demo.mp4" controls />
```

### Contact Form Integration

Connect to EmailJS, Formspree, or your backend in `Contact.tsx`:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  // Add your email service integration here
  await emailjs.send(serviceId, templateId, formData)
}
```

### Updating Links

Update social and project links in:
- `Hero.tsx` - Social links
- `ProfileCard.tsx` - Profile info
- `Projects.tsx` - Demo/GitHub links
- `Contact.tsx` - Social links
- `Footer.tsx` - Navigation & social

## 🎭 Design Tokens

### Typography
- **Display:** Syne (headings)
- **Body:** Outfit (paragraphs)
- **Code:** JetBrains Mono (technical)

### Colors
- **Primary:** Sky blue (#0ea5e9)
- **Accent Cyan:** #06b6d4
- **Accent Emerald:** #10b981
- **Accent Violet:** #8b5cf6
- **Accent Amber:** #f59e0b

### Components
- `.glass` - Glassmorphism effect
- `.glass-card` - Card with glass styling
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.tech-tag` - Technology tags
- `.gradient-text` - Gradient text effect

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Ahmed Mostafa**
- Email: ahmedmostafa2004@hotmail.com
- GitHub: [@ahmedmo-27](https://github.com/ahmedmo-27)
- LinkedIn: [Ahmed Mostafa](https://linkedin.com/in/ahmedmostafa-swe)
