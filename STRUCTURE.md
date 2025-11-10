# Surmedania Dance School - Project Structure

## 📁 Root Directory

```
Surmedania/
├── public/              # Static assets served as-is
│   └── founder.jpeg     # Founder photo (2.6MB)
├── src/                 # React application source code
├── server/              # Express backend server
├── scripts/             # Build and utility scripts
├── dist/                # Production build output (generated)
├── node_modules/        # Frontend dependencies (generated)
└── Configuration files
```

## 📂 Frontend Structure (`/src`)

```
src/
├── assets/              # Images, fonts, and static resources
│   ├── founder.jpeg     # Founder image
│   ├── founder.webp     # Founder image (WebP format)
│   ├── hero-placeholder.svg
│   ├── logo.svg
│   └── phulkari-pattern.svg
│
├── components/          # Reusable React components
│   ├── ClassCard.jsx    # Individual class display card
│   ├── Footer.jsx       # Site footer with contact info
│   ├── Header.jsx       # Navigation header with mobile drawer
│   ├── Hero.jsx         # Landing page hero section
│   └── ScrollToTop.jsx  # Smart scroll behavior manager
│
├── pages/               # Route-level page components
│   ├── About.jsx        # About/founder story page
│   ├── Classes.jsx      # Class schedule & location
│   ├── FAQPage.jsx      # Frequently asked questions
│   ├── FeedbackPage.jsx # User feedback submission
│   ├── GalleryPage.jsx  # Photo gallery
│   ├── Home.jsx         # Landing page
│   ├── NewsPage.jsx     # News/updates
│   ├── NotFound.jsx     # 404 error page
│   ├── Performances.jsx # Performance listings
│   ├── RegistrationConfirm.jsx # Post-registration confirmation
│   └── RegistrationPage.jsx    # Membership registration form
│
├── context/             # React Context providers
│   └── LanguageContext.jsx # Bilingual (EN/NO) state management
│
├── providers/           # Higher-order providers
│   └── MotionProvider.jsx  # Framer Motion with reduced motion support
│
├── i18n/                # Internationalization
│   └── translations.json   # English & Norwegian translations
│
├── styles/              # Global styles
│   └── index.css        # Tailwind + custom CSS
│
├── data/                # Static data files
├── __tests__/           # Jest/Vitest test files
├── App.jsx              # Root component with routing
└── main.jsx             # React app entry point
```

## 🖥️ Backend Structure (`/server`)

```
server/
├── index.js             # Express server entry point
├── emailService.js      # Email notification system
├── googleSheets.js      # Google Sheets integration
├── vippsPayment.js      # Vipps payment handling
├── registrations.csv    # Registration data storage
├── scripts/             # Server utility scripts
├── node_modules/        # Backend dependencies (separate from frontend)
├── package.json         # Backend dependencies
├── .env                 # Server environment variables
└── Documentation:
    ├── README.md
    ├── EMAIL_SETUP.md
    └── VIPPS_SETUP.md
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies, scripts |
| `vite.config.js` | Vite bundler configuration |
| `tailwind.config.cjs` | Tailwind CSS theming & utilities |
| `postcss.config.cjs` | PostCSS plugins (Tailwind) |
| `vitest.config.js` | Test runner configuration |
| `index.html` | HTML entry point |
| `.env` | Frontend environment variables |
| `.env.example` | Environment template |
| `.gitignore` | Git exclusions |

## 🚀 Key Scripts

```bash
# Frontend
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build (port 4173)
npm test             # Run tests

# Backend
cd server
node index.js        # Start Express server (port 4000)
```

## 🎨 Design System

- **Colors**: Gold gradient (#C9A74A → #B8902F), Off-white (#F8F5F0)
- **Fonts**: Playfair Display (headings), Poppins (body)
- **Components**: `.lux-card` for premium card styling
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

## 🌐 Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Home | Landing page |
| `/about` | About | Founder story |
| `/classes` | Classes | Schedule & location |
| `/classes#location` | Classes | Smooth scroll to map |
| `/gallery` | GalleryPage | Photo gallery |
| `/performances` | Performances | Events |
| `/news` | NewsPage | Updates |
| `/registration` | RegistrationPage | Sign up form |
| `/registration?type=supported` | RegistrationPage | Supporter sign-up |
| `/registration?class=Thursday` | RegistrationPage | Pre-selected class |
| `/confirm` | RegistrationConfirm | Payment instructions |
| `/feedback` | FeedbackPage | User feedback |
| `/faq` | FAQPage | Questions |
| `*` | NotFound | 404 page |

## 🔌 API Endpoints (Backend)

- `POST /api/register` - Submit registration
- `POST /api/feedback` - Submit feedback
- `GET /api/health` - Server health check

## 📦 Production Deployment

1. **Frontend**: `npm run build` → Deploy `dist/` folder
2. **Backend**: Deploy `server/` with Node.js environment
3. **Environment**: Set up `.env` variables for both
4. **Assets**: Ensure `public/` files are copied to `dist/`

## 🧹 Maintenance

- **Clean build**: `rm -rf dist node_modules && npm install && npm run build`
- **Clean server**: `cd server && rm -rf node_modules && npm install`
- **Remove logs**: `find . -name "*.log" -delete`
- **Remove backups**: `rm -f server/registrations.csv.backup*`

---

**Last Updated**: November 8, 2025
