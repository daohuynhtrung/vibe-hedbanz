# ⚽ Hedbanz Football 🎮

An interactive **Hedbanz** game web app in the **Football domain**, built with **Next.js**, **React 19**, and **Tailwind CSS**.

In accordance with [`SPEC.md`](./SPEC.md), this is a 100% front-end only application using exclusively open-source and free resources with **zero external paid APIs, zero backend servers, and zero setup required**.

---

## 🎯 Gameplay & Features

1. **Hedbanz Headband & Mystery Card**:
   - A secret footballer is placed on the virtual headband card attached to your forehead.
   - The card stays face down during the game, showing only the mystery `?` card with a live question counter.
   - When you correctly guess the footballer or give up, the card performs a **3D flip animation** to reveal the player's full collectible card (ratings, nationality, position, clubs, trophies, footedness, and trivia).

2. **RefBot (Intelligent AI Referee)**:
   - Chat with RefBot by asking any **Yes/No questions** in natural language.
   - RefBot understands questions about:
     - **Active vs Retired status** (*"Is he active?", "Is he retired?"*)
     - **Positions** (*"Is he a striker?", "Does he play in midfield?", "Is he a goalkeeper?"*)
     - **Continents & Nationalities** (*"Is he European?", "Is he from Argentina?", "Is he Brazilian?"*)
     - **Clubs (Current & Historic)** (*"Does he play for Real Madrid?", "Has he ever played for Liverpool?"*)
     - **Leagues** (*"Does he play in the Premier League?", "Has he played in La Liga?"*)
     - **Trophies & Accolades** (*"Has he won the World Cup?", "Has he won the Champions League?", "Has he won the Ballon d'Or?"*)
     - **Age & Era** (*"Is he over 30?", "In his 20s?"*)
     - **Dominant Foot** (*"Is he left-footed?", "Does he use both feet?"*)
     - **Shirt Numbers** (*"Does he wear number 10?"*)
     - **Physical Attributes** (*"Is he tall?", "Under 175cm?"*)
     - **Iconic Moments & Traits** (*"Famous for a headbutt?", "Did he bite someone?", "Hand of God?", "Known for free kicks?"*)
   - RefBot responds with clear **YES! ✅**, **NO ❌**, or contextual feedback.

3. **Guessing Mechanism**:
   - Type your guess directly into the chat (e.g., `"Is it Messi?"`, `"Could it be Haaland?"`, or simply `"Zidane"`), or click the **"Make a Guess"** mode toggle.
   - Handles typos and aliases (e.g., `CR7`, `Leo Messi`, `R9`, `KDB`, `Vini Jr`, `Donatello`).
   - If correct: triggers victory fanfare, confetti burst, 3D card flip, and assigns a detective rank (*Ballon d'Or Detective*, *Premier Scout*, etc.).

4. **Give Up / Reveal**:
   - If you are stuck, click **"Give Up"** to reveal the player and inspect their statistics, facts, and trivia.

5. **Built-in Web Audio Sound FX**:
   - Synthesized live in the browser using the Web Audio API with zero external audio assets:
     - Rising chime for YES
     - Referee buzzer for NO
     - Fanfare for GOAL / Correct Guess
     - Swoosh sound for Card Flips
   - Sound can be toggled on/off at any time.

6. **Forehead Party Mode**:
   - Tap the smartphone icon to switch into **Party Mode** — hold the device against your forehead while friends in the room look at your card and answer your questions in person!

7. **Extensive Football Database**:
   - Curated dataset of global superstars (Messi, Ronaldo, Haaland, Mbappé, Bellingham, Vinícius Jr, De Bruyne, Salah, Kane, Lewandowski, Modrić, Rodri, Kroos, Yamal, Palmer, etc.) and legendary icons (Pelé, Maradona, Zidane, Ronaldinho, Ronaldo R9, Henry, Iniesta, Maldini, Buffon, Beckham, Kaká, Drogba, etc.).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm start
```

### Code Quality & Verification
```bash
npm run lint
npm run typecheck
```

---

## 🌐 Deployment Process

This front-end application can be deployed for **free** across multiple hosting platforms:

### Option 1: GitHub Pages (Automated CI/CD)
The repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Push your code to your GitHub repository on `main` or `master`.
2. In your repository on GitHub, navigate to **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**.
4. Every push will automatically lint, type-check, build the static bundle (`npm run build:export`), and deploy to GitHub Pages!

### Option 2: Vercel (1-Click / Zero Config)
The repository includes a ready-to-use [`vercel.json`](./vercel.json):
1. Push the code to GitHub/GitLab/Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"** $\rightarrow$ select this repo.
3. Vercel automatically detects Next.js and deploys your application globally across edge networks.
*(Alternatively, run `npx vercel` from your terminal).*

### Option 3: Docker Container (Self-Hosting & Cloud)
Build and run the lightweight multi-stage Docker container (built on Node.js 22 alpine and served via high-performance Nginx with gzip compression):
```bash
# Using Docker Compose
docker compose up -d

# Or using plain Docker
docker build -t hedbanz-football .
docker run -d -p 3000:80 --name hedbanz-football hedbanz-football
```
The app will be accessible at [http://localhost:3000](http://localhost:3000).

### Option 4: Cloudflare Pages / Netlify / Static Host
- **Build command**: `npm run build:export`
- **Publish directory**: `out`

### Local Production Preview
Test the production static export bundle locally on your machine:
```bash
npm run build:export
npm run preview
```
Open [http://localhost:3000](http://localhost:3000) to test the exact exported bundle.

