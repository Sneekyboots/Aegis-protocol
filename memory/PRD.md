# AEGIS - Execution Firewall for Agentic Web3

## Original Problem Statement
Build a Web3 infrastructure landing page + live dashboard demo for Aegis - an execution firewall for autonomous agents on Sui blockchain. The site needs to feel like cutting-edge Web3 infrastructure (Forta Network / DeepBook vibe), NOT a DeFi product. Originally requested with violet/black theme but user pivoted to "really good 3D theme not all violet and black like really cool".

## Architecture

### Tech Stack
- **Frontend**: React 19 + Tailwind CSS + Radix UI (shadcn) + Framer Motion + Recharts + Lucide icons
- **Backend**: FastAPI (Python) + Motor (async MongoDB) + Pydantic v2
- **Design System**: Deep Slate (#040914) + Electric Blue (#3B82F6) + Cyan (#06B6D4) + status colors. Outfit headings, IBM Plex Sans body, JetBrains Mono for data/code.

### Project Structure
```
/app/
├── backend/
│   └── server.py          # FastAPI app with intent/market/kill-switch APIs
├── frontend/
│   └── src/
│       ├── App.js
│       └── components/
│           ├── Dashboard.js
│           ├── Header.js
│           ├── HeroSection.js
│           ├── ProblemSection.js
│           ├── MarketBar.js
│           ├── IntentCard.js
│           ├── IntentDetailModal.js
│           ├── CodeSection.js
│           ├── FeaturesSection.js
│           └── CTASection.js
└── design_guidelines.json # Design blueprint from design_agent_full_stack
```

## User Personas
1. **Web3 Hackathon Judges** - Need to see real, working on-chain demos that prove the concept
2. **DeFi Protocol Builders** - Looking for composable safety primitives they can integrate
3. **DAO Members / Guardians** - Need emergency controls for autonomous agents
4. **Web3 Investors / VCs** - Evaluating infrastructure projects

## Core Requirements (Static)
1. Live Intent Grid (3 intent cards) showing approved/executed/blocked states
2. Real-time risk scoring with multi-factor breakdown (volatility, liquidity, concentration, quantum)
3. Intent detail modal with Risk Timeline chart (Recharts AreaChart) + Dynamic Fields view
4. Object IDs linked to Sui Explorer
5. Interactive controls: Kill Switch, Simulate Rogue Market, Reset Demo
6. Live market bar (SUI/USDC on DeepBook)
7. Problem section with real exploit examples ($197M Euler, $114M Mango, etc.)
8. Code section showing 3-line Move integration
9. Features grid (8 cards in bento layout)
10. CTA section with resource links

## What's Been Implemented (2026-01-30)

### Backend APIs ✅
- `GET /api/intents` - Returns all 3 intents with full data
- `GET /api/intents/{intent_id}` - Detail view
- `GET /api/market/live` - SUI/USDC live market data
- `POST /api/simulate-rogue` - Spikes intent to risk=97
- `POST /api/kill-switch/{intent_id}` - Revokes intent permanently
- `POST /api/reset-demo` - Restore initial state

### Frontend ✅
- **Header**: Sticky nav with brand, links (Problem/Demo/Integrate/Features), Testnet Live badge, Reset button, Launch App pill
- **Hero**: Two-column with floating 3D shield, floating Risk Score + Status data badges, "agentic Web3" gradient text, dual CTAs, trust line, animated grid background
- **Problem**: 3D shattered rogue node + bold "No one has the brakes" tagline + 2x2 grid of real exploits
- **Live Dashboard**: Market bar (Price/24h/Volume/Liquidity) + 3 intent cards with 3D node visuals, color-coded risk scores (28/19/97), progress bars, status badges, quantum/expires metadata
- **Intent Detail Modal**: Object ID + Sui Explorer link, Risk Timeline AreaChart with gradient fill, Dynamic Fields broken into risk/market/policy/notes sections, execution log, Kill Switch button
- **Code Section**: Terminal-style window with macOS dots, syntax-highlighted Move code (3 lines), copy button, feature pills
- **Features**: 8-card bento grid with hover glow effects, 2-column spans for variety
- **CTA**: Large rounded card with floating shield icon, "Secure your agents. Deploy the firewall." headline, resource cards (GitHub/Docs/Community)

### Design Highlights
- 3D glass shield (electric blue + amber core) for hero
- 3D safe data nodes (blue/green glow) for safe intents
- 3D shattered glass node (red/orange) for rogue intents
- Glassmorphism (backdrop-blur-xl + white/[0.02] bg)
- Ambient blue + cyan radial glows
- Grid background pattern
- Risk dot indicators with pulse animation
- Framer Motion animations (float, glow, stagger reveals)
- JetBrains Mono for all on-chain data points

### Demo Scenarios Implemented ✅
1. **Safe Execution** (INTENT-001): risk=28, APPROVED
2. **Executed** (INTENT-002): risk=19, EXECUTED with full log
3. **Blocked Rogue** (INTENT-003): risk=97, BLOCKED with critical note
4. **Kill Switch**: One-click revocation with on-chain log entry
5. **Simulate Rogue Market**: Button on INTENT-003 to spike risk live

## Prioritized Backlog

### P0 (Done) ✅
- Hero with 3D shield
- Problem section with real exploits
- Live dashboard with 3 intents
- Intent detail modal with Dynamic Fields
- Code section with Move syntax
- Features grid
- CTA section
- All API endpoints
- Kill Switch + Simulate Rogue interactions

### P1 (Future Enhancements)
- Real Sui blockchain integration (replace mock data with on-chain reads)
- Wallet connection (Sui Wallet, Suiet)
- Animated risk score transitions (count up animation)
- Live market data WebSocket from DeepBook
- More exploit case studies / blog posts
- Code language switcher (Move / TypeScript SDK)
- Dark/light theme toggle

### P2 (Polish)
- Loading skeletons with shimmer
- Better mobile responsive for intent cards
- Sound effects on kill switch activation
- Confetti on safe execution
- Onboarding tour

## Key Files
- `/app/backend/server.py` - FastAPI server with all endpoints
- `/app/frontend/src/components/Dashboard.js` - Main dashboard composition
- `/app/frontend/src/components/IntentDetailModal.js` - Dynamic Fields display
- `/app/design_guidelines.json` - Design blueprint (Deep Slate + Blue + Cyan, NO violet)
- `/app/frontend/src/index.css` - Global styles (glassmorphism, glows, fonts)
- `/app/README.md` - Full project documentation

## URLs
- Frontend: https://aegis-ptb.preview.emergentagent.com
- Backend API: https://aegis-ptb.preview.emergentagent.com/api

## Next Tasks
1. Optional: Connect to real Sui testnet (replace in-memory data with on-chain queries)
2. Optional: Add wallet connection flow
3. Optional: Add WebSocket for real-time market data updates
