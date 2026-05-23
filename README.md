# 🌲 BROTHER (Quiet Late-Night Sanctuary)

BROTHER is an emotionally intelligent, mobile-first, and highly immersive late-night digital sanctuary. It is designed specifically to help young men face loneliness, emotional suppression, stress, dopamine-seeking behaviors, and midnight urges. Rather than fighting impulses with rigid quotas, BROTHER utilizes somatic grounding, atmospheric audio landscapes, cognitive defusion, and direct, peer-level elder brother guidance to slow down the nervous system and help the user ride the waves of tension.

---

## 🌟 Core Features

- 🛋️ **Quiet Cabin Hearth (AI Brother Chat):** Dynamic, peer-level AI companion with mood-mirroring, highly adaptive pacing, and imperfect, comforting vernacular. Zero clinical jargon; 100% human-focused brotherly warmth.
- 🗄️ **Truth Log Worksheet (Somatic Writing):** Safe, client-side, and Firebase-synchronized secure journal cards with voice dictation simulations for writing down suppressed thoughts.
- 🍃 **Poetic Weather Reflection:** A custom neural summarizer that aggregates past journal cards into cinematic weather metaphors representing your inner psychological landscape.
- 🛡️ **Bilateral Somatic Shield:** Complete, fullscreen grounding mode featuring:
  - **Cold Shower Stopwatch:** Triggering the mammalian dive reflex to immediately reset physiological craving states under 180 seconds.
  - **Bilateral Metronome:** Synchronizing bilateral ocular and physical pacing steps to reduce anxiety and stress.
- 🌌 **Atmospheric Ambient Soundtrack:** Toggleable particle/audio generators (Midnight rain, howling thunderstorm, late-night transit ambient hum) built to secure your late-night workspace environment.
- 📱 **Mobile-First PWA Console:** Fluid bottom-navigation, responsive touch targets, smooth Framer Motion transitions, and a beautiful AMOLED/Dark/Day dynamic lighting layout.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Framer Motion (via `motion/react`), Lucide React.
- **Backend:** Express Full-Stack Server, Esbuild (Bundler compiling server payload to a single `dist/server.cjs` for cold-start performance).
- **Core AI Integration:** Modern `@google/genai` TypeScript SDK utilizing the ultra-responsive `gemini-3.5-flash` model.
- **Persistent Database & OAuth:** Firebase Firestore (Real-time snapshot streams syncing profiles and collections) & Firebase Authentication.

---

## 🚀 Quick Start & Installation

### 1. Clone & Extract Code
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended). Extract the ZIP package and change directory to the root:
```bash
cd brother-applet
```

### 2. Install Dependencies
Run npm package initialization:
```bash
npm install
```

### 3. Configure Your Secrets (`.env`)
Create a `.env` file in the project root (you can clone `.env.example` as a starting point):
```bash
cp .env.example .env
```
Fill out your specific runtime keys:
```env
# Google Gemini API Key
GEMINI_API_KEY="your-actual-gemini-key"

# Application Endpoint Address (Useful for deployment redirects)
APP_URL="http://localhost:3000"
```

### 4. Boot Dev Environment
Start the custom full-stack dev server (it runs Express proxy acting as Vite asset middleware on port 3000):
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Compile & Bundling (Production Setup)
To build the app code completely and bundle the Express server into `dist/server.cjs`:
```bash
npm run build
```
Start the production instance:
```bash
npm run start
```

---

## 🔒 Firebase Configuration (Auth & Firestore)

This workspace contains pre-configured blueprints and files targeting Firebase:
- `firebase-blueprint.json` (Database layout definitions)
- `firestore.rules` (Secure row-level security rules enforcing individual user IDs)

To configure your own remote Firebase project:
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Firebase Authentication** (Enable Email/Password sign-ins and Google Provider setups).
3. Retrieve your project configuration object and replace the web credentials inside of `./src/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "your-apiKey",
  authDomain: "your-authDomain",
  projectId: "your-projectId",
  storageBucket: "your-storageBucket",
  messagingSenderId: "your-messagingSenderId",
  appId: "your-appId"
};
```
4. Install the firebase CLI tools and deploy rules:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
# Copy the firestore.rules file into your firestore directory and push:
firebase deploy --only firestore:rules
```

---

## 📡 Google OAuth Setup

To enable true offline / browser secure Google Single Sign-on (SSO):
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services > Credentials** and configure an **OAuth Consent Screen** (User type: External).
3. Add scopes: `.../auth/userinfo.profile`, `.../auth/userinfo.email`, and `openid`.
4. Create an **OAuth Client ID** of type **Web Application**.
5. Set the Authorized Redirect URI to:
   - `http://localhost:3000/__/auth/handler` (or your remote Vercel/Cloud Run URL)
6. Add the retrieved Client Config parameters into your Firebase auth configuration in the Firebase Console under **Sign-In Method > Google > Edit Client Credentials**.

---

## 📲 Progressive Web App (PWA) Instructions

This app is tailored to feel native on iOS Safari and Android Chrome panels:
- Configured dynamic viewport sizes preventing high-contrast layout jumping.
- AMOLED black layouts fitting modern OLED screens.
- **Save to Homescreen:**
  - **On iOS:** Open the URL inside Safari, tap the **Share** utility icon, and click **Add to Home Screen**.
  - **On Android:** Open the URL inside Chrome, tap the **More Settings (triple dots)** icon, and select **Install App** or **Add to Homescreen**.

---

## 🎨 Visual Identity Guidelines

We have curated a premium layout utilizing high aesthetic pairing:
- **AMOLED Slate Palette:** Using `#030305` and custom subtle white/5 semi-translucent glass panels.
- **Deep Font Weights:** High-contrast layout lines incorporating **Space Grotesk** and **Inter** sans UI paired with **JetBrains Mono** font arrays representing statistics and logs.
- **Grounding Animations:** Staggered visual components, typewriter-delayed character responses, and realistic breathing motion graphics.
