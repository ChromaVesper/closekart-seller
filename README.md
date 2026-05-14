
# CloseKart Seller Platform

A professional, standalone seller dashboard for the CloseKart marketplace. Built with React, Vite, Firebase, and Tailwind CSS.

## 🚀 Features

### Seller Authentication
- **Sign Up**: Create new seller account with email, password, and shop details
- **Login**: Secure login with Firebase Authentication
- **Logout**: Safe session management
- **Protected Routes**: Only authenticated sellers can access the dashboard

### Dashboard
- **Real-time Statistics**: 
  - Total Products
  - Total Orders
  - Total Revenue
  - Total Views
- **Quick Actions**: Fast access to add products and upload reels
- **Performance Tips**: Best practices for sellers

### Product Management
- **Add Products**: Upload products with images, description, price, and stock
- **Edit Products**: Modify existing product details
- **Delete Products**: Remove products from inventory
- **Image Upload**: Upload multiple images to Firebase Storage
- **Search & Filter**: Find products quickly
- **Real-time Updates**: Live inventory management

### Reel Management (Short Videos)
- **Upload Reels**: Create Instagram-style short videos
- **Add Captions**: Engaging descriptions for reels
- **Product Tags**: Link products to reels
- **View Analytics**: Track likes, comments, and shares
- **Delete Reels**: Remove old content

### Order Management
- **View Orders**: See all customer orders
- **Order Status**: Track processing, shipped, delivered status
- **Order Details**: Customer info, amounts, dates
- **Real-time Sync**: Live order updates

### Analytics & Insights
- **Sales Analytics**: Revenue tracking and trends
- **Top Products**: Best-selling products
- **Customer Views**: Track product visibility
- **Performance Metrics**: Average order value

### Settings
- **Profile Management**: Update shop name, description
- **Contact Info**: Manage phone number
- **Account Info**: Email and account status
- **Quick Stats**: Overview of key metrics

## 📱 Responsive Design

- **Desktop**: Sidebar navigation with full-width layouts
- **Tablet**: Optimized grid layouts
- **Mobile**: Bottom navigation with collapsed menus
- **All Devices**: Touch-friendly interface

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── DashboardLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── dashboard/
│   ├── products/
│   └── reels/
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   ├── auth/
│   │   ├── SellerLogin.jsx
│   │   └── SellerSignup.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── products/
│   │   └── Products.jsx
│   ├── orders/
│   │   └── Orders.jsx
│   ├── analytics/
│   │   └── Analytics.jsx
│   ├── reels/
│   │   └── Reels.jsx
│   └── settings/
│       └── Settings.jsx
├── config/
│   └── firebase.js
├── styles/
│   └── globals.css
├── App.jsx
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Auth and Firestore enabled

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/closekart-seller.git
cd closekart-seller
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Setup Firebase Configuration**

Create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 📱 Routes

### Public Routes
- `/seller-login` - Login page
- `/seller-signup` - Sign up page

### Protected Routes
- `/dashboard` - Main dashboard
- `/products` - Product management
- `/orders` - Order management
- `/analytics` - Sales analytics
- `/settings` - Account settings
- `/reels` - Reel management

## 🔗 Firebase Collections

### sellers
- User profile and shop information
- Ratings, total products, orders, revenue

### products
- Product listings with images, price, stock
- Seller ID and shop association

### reels
- Short video content
- Captions, tags, engagement metrics

### orders
- Customer orders
- Status tracking and amounts

## 🎨 Customization

### Colors (Tailwind)
Update in `tailwind.config.js`:
```javascript
colors: {
  primary: "#1f2937",
  secondary: "#3b82f6",
  accent: "#10b981",
}
```

## 📦 Build & Deploy

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

## 🔐 Firebase Security Rules

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sellers/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.sellerId;
    }
  }
}
```

## 📝 License

MIT License - see LICENSE for details

## 🤝 Contributing

Pull requests are welcome!

## 📧 Support

Email: support@closekart.com

---

**Built with ❤️ by CloseKart Team**
