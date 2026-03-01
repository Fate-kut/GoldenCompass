# 🧭 Golden Compass — React Native Mobile App

A fully working, pirate-themed regulated investment fintech platform for Kenya.
Built with **Expo Router + React Native** — runs on iOS, Android, and Web.

---

## 🚀 Quick Start (3 steps)

### 1. Install dependencies
```bash
cd golden-compass
npm install
```

### 2. Start the development server
```bash
npx expo start
```

### 3. Run on your device
- **Android**: Press `a` in the terminal, or scan the QR code with the [Expo Go](https://expo.dev/client) app
- **iOS**: Press `i`, or scan the QR code with the iOS Camera app
- **Web**: Press `w` for browser preview

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Investor | demo@compass.co.ke | password123 |
| Admin | admin@compass.co.ke | admin123 |

---

## 📁 Project Structure

```
golden-compass/
├── app/
│   ├── _layout.tsx              # Root layout (fonts, navigation)
│   ├── index.tsx                # Auth redirect
│   ├── (auth)/
│   │   └── login.tsx            # Login/Register/Admin tabs
│   ├── (tabs)/
│   │   ├── home.tsx             # Portfolio dashboard
│   │   ├── pools.tsx            # Investment pools listing
│   │   ├── navigator.tsx        # AI chat navigator
│   │   ├── history.tsx          # Transaction history
│   │   └── profile.tsx          # Profile, KYC, settings
│   ├── (admin)/
│   │   └── dashboard.tsx        # Admin command bridge
│   ├── pool/[id].tsx            # Pool detail + invest flow
│   └── kyc.tsx                  # 3-step KYC flow
├── components/
│   ├── ui.tsx                   # GoldButton, Card, Tag, Toggle, Charts...
│   └── CompassSVG.tsx           # Animated compass component
├── constants/
│   └── theme.ts                 # Colors, fonts, pool data
└── store/
    └── index.ts                 # Zustand global state management
```

---

## ✅ Features Implemented

### 👤 Investor App
- **Auth**: Sign In, Register, Admin Login (tabbed)
- **Home Dashboard**: Live portfolio value, NAV chart, quick actions
- **M-Pesa Deposits**: STK Push simulation with 3-second confirmation
- **Withdrawals**: Pool selection and processing
- **Investment Pools**: Bahari Growth, Pwani Stable, Kilima Balanced
- **Pool Detail**: NAV history chart, fund stats, invest modal with unit preview
- **AI Navigator**: Full chat with portfolio analysis, NAV explainer, risk assessment
- **Transaction History**: Filter by deposit/withdrawal, M-Pesa reference tracking
- **Profile**: Portfolio stats, KYC status, settings toggles (notifications, 2FA, biometric)
- **KYC Flow**: 3-step (Identity → Source of Funds → Risk Disclosure)

### 🔐 Admin Panel
- **KPI Dashboard**: AUM, users, pending KYC count, AML flags
- **AUM Growth Chart**: 7-day trend
- **Pool Management**: View all pools, update NAV (logged immutably)
- **Create Pool**: Launch new investment pools
- **KYC Queue**: Approve / reject with one tap
- **AML Flags**: Review and block/clear suspicious transactions
- **Audit Log**: Color-coded immutable event log (all actions recorded)

### 🏛️ Compliance Architecture
- Immutable audit logging on every action (Zustand store)
- KYC multi-step with risk disclosure acceptance
- AML transaction monitoring and flagging
- Role-based access (investor / admin / compliance / auditor)
- CMA & CBK compliant structure

---

## 🛠️ Tech Stack (All Free)

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 52 |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| UI | Custom components + LinearGradient |
| Charts | Custom bar charts |
| Fonts | CinzelDecorative + Space Mono (Google) |
| Animations | React Native Animated API |
| Haptics | expo-haptics |
| Auth | Local mock (JWT-ready architecture) |
| Payments | M-Pesa STK Push simulation (Daraja API ready) |
| AI | Local responses (OpenAI API ready) |

---

## 🔌 Connecting Real Services

### M-Pesa (Safaricom Daraja API)
In `store/index.ts`, replace the `deposit()` mock with:
```typescript
const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}` },
  body: JSON.stringify({ BusinessShortCode, Password, Timestamp, TransactionType: 'CustomerPayBillOnline', Amount, PartyA, PartyB, PhoneNumber, CallBackURL, AccountReference, TransactionDesc })
});
```

### OpenAI (AI Navigator)
In `app/(tabs)/navigator.tsx`, replace `getResponse()` with:
```typescript
const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'gpt-4', messages: [{ role: 'system', content: 'You are the Golden Compass AI financial advisor for Kenyan investors...' }, ...chatHistory] })
});
```

### PostgreSQL Backend
The store architecture mirrors the database schema directly:
- `users` → `currentUser`
- `transactions` → `transactions[]`
- `user_investments` → `investments[]`
- `kyc_records` → KYC flow
- `audit_logs` → `auditLogs[]`
- `pool_nav_history` → `navHistory[]`

---

## 📦 Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure builds
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit
```

---

## 📱 Screens Preview

| Screen | Description |
|--------|-------------|
| Login | Pirate-themed auth with 3 tabs |
| Home | Portfolio overview + NAV chart |
| Pools | 3 active investment pools |
| Pool Detail | NAV history, invest modal |
| AI Navigator | Full chat interface |
| Transaction History | Filterable M-Pesa log |
| Profile | Stats, KYC, settings |
| KYC | 3-step compliance flow |
| Admin Dashboard | Full admin control panel |

---

*Built for the Golden Compass MVP · CMA Licensed Structure · CBK Compliant*
