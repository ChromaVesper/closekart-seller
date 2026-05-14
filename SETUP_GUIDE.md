# CloseKart Seller Platform - Setup Guide

## ✅ Project Completed

The CloseKart Seller Platform has been successfully created as a standalone, professional-grade seller dashboard.

## 📦 What's Included

### ✨ Core Features Implemented

1. **Seller Authentication System**
   - ✅ Email/Password signup and login
   - ✅ Firestore seller profile storage
   - ✅ Protected routes with auth context
   - ✅ Logout functionality
   - ✅ Auth persistence

2. **Dashboard**
   - ✅ Real-time statistics (products, orders, revenue, views)
   - ✅ Quick action cards
   - ✅ Performance tips
   - ✅ Responsive layout

3. **Product Management**
   - ✅ Add new products with multiple image uploads
   - ✅ Edit existing products
   - ✅ Delete products
   - ✅ Image upload to Firebase Storage
   - ✅ Search and filter functionality
   - ✅ Product display with images

4. **Reel Management (Videos)**
   - ✅ Upload short videos (Instagram-style)
   - ✅ Add captions and tags
   - ✅ View reel engagement metrics
   - ✅ Delete reels
   - ✅ Video preview

5. **Order Management**
   - ✅ View all seller orders
   - ✅ Order status tracking
   - ✅ Customer information display
   - ✅ Order history with dates

6. **Analytics Dashboard**
   - ✅ Total views, orders, revenue
   - ✅ Average order value
   - ✅ Top products by revenue
   - ✅ Sales metrics

7. **Settings Page**
   - ✅ Update shop name and description
   - ✅ Phone number management
   - ✅ Account information display
   - ✅ Quick stats overview

### 🎨 UI/UX Features

- ✅ Professional design with Tailwind CSS
- ✅ Responsive sidebar navigation
- ✅ Mobile-friendly bottom navigation
- ✅ Clean header with user info
- ✅ Dark borders and proper spacing
- ✅ Icon system with Lucide React
- ✅ Loading states and error handling
- ✅ Form validation
- ✅ Success/error messages

### 🛠️ Technical Stack

- ✅ React 19 with Hooks
- ✅ Vite build tool
- ✅ Tailwind CSS styling
- ✅ Firebase Authentication
- ✅ Firestore Database
- ✅ Firebase Storage
- ✅ React Router v7
- ✅ Context API for state management
- ✅ Custom hooks (useAuth)

### 📁 Project Structure

```
closekart-seller/
├── src/
│   ├── components/common/
│   │   ├── Header.jsx (Top navigation with user info)
│   │   ├── Sidebar.jsx (Navigation menu)
│   │   ├── DashboardLayout.jsx (Main layout wrapper)
│   │   └── ProtectedRoute.jsx (Route protection)
│   ├── context/
│   │   └── AuthContext.jsx (Authentication state management)
│   ├── hooks/
│   │   └── useAuth.js (Custom auth hook)
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── SellerLogin.jsx
│   │   │   └── SellerSignup.jsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── products/
│   │   │   └── Products.jsx
│   │   ├── reels/
│   │   │   └── Reels.jsx
│   │   ├── orders/
│   │   │   └── Orders.jsx
│   │   ├── analytics/
│   │   │   └── Analytics.jsx
│   │   └── settings/
│   │       └── Settings.jsx
│   ├── config/
│   │   └── firebase.js (Firebase configuration)
│   ├── styles/
│   │   └── globals.css (Global styles and Tailwind)
│   ├── App.jsx (Main app with routing)
│   └── main.jsx (React entry point)
├── index.html (HTML template)
├── tailwind.config.js (Tailwind configuration)
├── postcss.config.js (PostCSS configuration)
├── vite.config.js (Vite configuration)
├── package.json (Dependencies)
└── README.md (Documentation)
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd /Users/akshaykumar/Desktop/closekart-seller
npm install --legacy-peer-deps
```

### 2. Configure Firebase
Copy your Firebase credentials to `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## 📱 Available Routes

### Public Routes
- `/` → Redirects to `/seller-login`
- `/seller-login` → Login page
- `/seller-signup` → Sign up page

### Protected Routes (Authenticated Only)
- `/dashboard` → Main dashboard with stats
- `/products` → Product management
- `/reels` → Reel/video management
- `/orders` → Order management
- `/analytics` → Sales analytics
- `/settings` → Account settings

## 🔗 Firebase Collections Structure

### `sellers` Collection
```javascript
{
  uid: string,
  email: string,
  shopName: string,
  phoneNumber: string,
  role: "seller",
  verified: boolean,
  description: string,
  rating: number,
  totalProducts: number,
  totalOrders: number,
  totalRevenue: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `products` Collection
```javascript
{
  sellerId: string,
  name: string,
  description: string,
  category: string,
  images: string[],
  price: number,
  stock: number,
  location: string,
  views: number,
  soldCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `reels` Collection
```javascript
{
  sellerId: string,
  videoUrl: string,
  caption: string,
  tags: string[],
  likes: number,
  comments: number,
  shares: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `orders` Collection
```javascript
{
  sellerId: string,
  customerId: string,
  customerName: string,
  totalAmount: number,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔐 Firebase Setup Requirements

### 1. Enable Authentication
- Go to Firebase Console → Authentication
- Enable Email/Password provider

### 2. Create Firestore Database
- Create database in production mode
- Set appropriate security rules (see below)

### 3. Enable Cloud Storage
- Create a storage bucket
- Set appropriate security rules (see below)

### 4. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sellers/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.sellerId;
      allow create: if request.auth.uid == request.resource.data.sellerId;
    }
    
    match /reels/{reelId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.sellerId;
      allow create: if request.auth.uid == request.resource.data.sellerId;
    }
    
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.sellerId || request.auth.uid == resource.data.customerId;
      allow create, write: if request.auth.uid == request.resource.data.customerId;
    }
  }
}
```

### 5. Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{sellerId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == sellerId;
    }
    
    match /reels/{sellerId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == sellerId;
    }
  }
}
```

## 📊 Database Schema Summary

The seller platform uses 4 main Firestore collections:

1. **sellers** - Seller profiles and shop information
2. **products** - Product listings with images and details
3. **reels** - Short video content from sellers
4. **orders** - Customer orders for seller products

Images are stored in Firebase Storage under `/products/{sellerId}/`
Videos are stored in Firebase Storage under `/reels/{sellerId}/`

## 🎯 Key Features Explained

### Authentication Flow
1. Seller signs up → Firebase creates user
2. Seller document created in Firestore with role "seller"
3. On login, seller profile fetched from Firestore
4. Auth context provides user state throughout app
5. Protected routes redirect unauthenticated users to login

### Product Management
1. Add → Upload images to Storage, save product to Firestore
2. Edit → Modify existing product document
3. Delete → Remove from Firestore (images remain in Storage for now)
4. Search → Filter products client-side by name
5. Display → Real-time product list with images

### Order Tracking
1. Orders created by customers in buyer app
2. Seller dashboard queries orders by sellerId
3. Status can be tracked and updated
4. Real-time sync with Firestore

### Analytics
1. Queries all seller's products
2. Calculates total views, revenue, sold count
3. Identifies top-selling products
4. Displays key metrics

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repo settings
3. Deploy from main branch

### Option 3: Firebase Hosting
```bash
npm i -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option 4: Netlify
Connect GitHub repo to Netlify for automatic deployments

## 📝 Environment Variables

Required `.env.local` file:
```env
VITE_FIREBASE_API_KEY=<Firebase API Key>
VITE_FIREBASE_AUTH_DOMAIN=<Firebase Auth Domain>
VITE_FIREBASE_PROJECT_ID=<Firebase Project ID>
VITE_FIREBASE_STORAGE_BUCKET=<Firebase Storage Bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<Firebase Messaging Sender ID>
VITE_FIREBASE_APP_ID=<Firebase App ID>
```

## 🔍 Testing the Application

### Test Signup
1. Go to `/seller-signup`
2. Create account with:
   - Shop Name: "Test Shop"
   - Email: "test@closekart.com"
   - Password: "Test@123456"
3. Verify seller document created in Firestore

### Test Product Management
1. Go to `/products`
2. Click "Add Product"
3. Upload test images
4. Set price and stock
5. Verify images in Firebase Storage

### Test Reels Upload
1. Go to `/reels`
2. Click "Upload Reel"
3. Select video file
4. Add caption and tags
5. Verify video in Firebase Storage

### Test Dashboard
1. Visit `/dashboard`
2. See real-time stats update
3. Check quick action cards

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
npm run build
```

### Firebase Connection Issues
- Verify `.env.local` file exists
- Check all Firebase credentials
- Ensure Firebase services are enabled
- Check browser console for errors

### Images Not Uploading
- Check Storage permissions
- Verify file size (max 10MB recommended)
- Check file format (PNG, JPG, GIF)
- Verify Storage rules are correct

### Products Not Loading
- Check Firestore database exists
- Verify seller document created
- Check read permissions in Security Rules
- Verify products exist in database

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## 🎓 Next Steps

1. **Configure Firebase** with your credentials
2. **Start development server** and test login
3. **Add test products** to verify everything works
4. **Deploy to Vercel or similar** platform
5. **Configure domain** for seller.closekart.com or similar
6. **Set up buyer app** to connect to same Firebase

## 📞 Support

For issues or questions:
- Check README.md for detailed documentation
- Review Firebase Console for errors
- Check browser console for JavaScript errors
- Verify all environment variables are set

---

**CloseKart Seller Platform - Professional Marketplace Solution**
Built with React, Vite, Firebase, and Tailwind CSS ✨
