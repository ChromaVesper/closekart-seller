# 🚀 CloseKart Seller Platform - Quick Start

## ✅ Installation & Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Configure Firebase
Create `.env.local` in root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Start Development
```bash
npm run dev
```

Visit: `http://localhost:5173`

### Step 4: Create Test Account
1. Click "Create an Account"
2. Sign up with test credentials
3. You're in! 🎉

## 📱 Available Features

| Feature | URL | What It Does |
|---------|-----|-------------|
| Login | `/seller-login` | Sign in as seller |
| Signup | `/seller-signup` | Create new account |
| Dashboard | `/dashboard` | View stats & analytics |
| Products | `/products` | Manage your products |
| Reels | `/reels` | Upload short videos |
| Orders | `/orders` | Track customer orders |
| Analytics | `/analytics` | View sales data |
| Settings | `/settings` | Update profile |

## 🛠️ Key Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm lint
```

## 📁 Project Structure

- `src/pages/` - Page components (Dashboard, Products, etc.)
- `src/components/common/` - Shared components (Header, Sidebar)
- `src/context/` - Authentication context
- `src/config/` - Firebase configuration
- `src/styles/` - Global CSS with Tailwind

## 🔐 Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Email/Password Authentication
- [ ] Create Firestore database
- [ ] Enable Cloud Storage
- [ ] Copy credentials to `.env.local`
- [ ] Add Firestore security rules
- [ ] Add Storage security rules

See `SETUP_GUIDE.md` for detailed instructions.

## 🎯 What's Working

✅ Seller authentication (signup/login/logout)
✅ Protected dashboard routes
✅ Real-time product management
✅ Image upload to Firebase Storage
✅ Reel/video management
✅ Order tracking
✅ Sales analytics
✅ Profile settings
✅ Mobile responsive design
✅ Professional UI with Tailwind CSS

## 🚀 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

That's it! Your seller platform is live.

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `src/` folder - Explore the code

---

**Happy selling! 🛍️**
