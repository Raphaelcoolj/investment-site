# Merrick Investments PLC. - Cryptocurrency Investment Platform

Merrick Investments PLC. is a modern, high-performance cryptocurrency investment simulator built with Next.js 14. It features real-time market data, automated profit tracking, and a comprehensive admin management suite.

## 🚀 Key Features

### User Dashboard
- **Real-time Market Charts**: Interactive price tracking for BTC, ETH, SOL, and USDT using CoinGecko and CryptoCompare APIs.
- **Dynamic Balance**: Live tracking of user investment balance and total profits.
- **Transaction History**: Detailed logs of all activities (Deposits, Withdrawals, Increments).
- **Interactive Invoices**: Clickable transaction rows that open detailed digital receipts with crypto-to-USD conversions.

### Investment System
- **Automated Daily Increments**: System automatically calculates and credits daily profits based on admin-defined rates.
- **Multi-Asset Deposits**: Support for BTC, ETH, SOL, USDT, and various fiat methods (CashApp, Zelle, etc.).
- **Smart Price Proxy**: A robust server-side price engine that bypasses ad-blockers and includes triple-layered fallbacks (CoinGecko -> CryptoCompare -> Emergency Static Prices).

### Admin Suite
- **User Management**: Full control over user balances, roles, and account status.
- **Profit Control**: Ability to toggle "Daily Increments" and set specific profit amounts per user.
- **System Settings**: Configurable notification emails and platform parameters.

### Security & UX
- **Authentication**: Secure login, registration, and password reset flows powered by NextAuth.js.
- **Profile Management**: Customizable user profiles with Cloudinary-integrated image uploads.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing with specialized glassmorphism aesthetics.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS / Vanilla CSS
- **Charts**: Chart.js / React-ChartJS-2
- **Notifications**: Nodemailer (SMTP Integration)
- **API Connectivity**: Axios with multi-provider fallbacks

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file with the following:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `EMAIL_USER` / `EMAIL_PASS` (for SMTP)
   - `CLOUDINARY_URL` (for profile images)

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

## 🛡 Disclaimer
This platform is a simulation for educational and investment modeling purposes. No real financial transactions are executed on-chain.
