# 🏗️ CloseKart Seller Platform - Architecture Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                 CloseKart Seller Platform                   │
│                    (React + Vite)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼────┐    ┌─────▼──────┐   ┌────▼──────┐
    │Firebase│    │ Firestore  │   │  Storage  │
    │  Auth  │    │ Database   │   │ (Images)  │
    └────────┘    └────────────┘   └───────────┘
```

## Authentication Architecture

### Flow Diagram
```
User → Signup/Login → Firebase Auth → Check Firestore → 
Protected Routes → Dashboard
```

### Auth Context
- Manages user authentication state
- Stores seller profile data
- Provides login/signup/logout functions
- Handles auth persistence

### Protected Routes
- Redirect unauthenticated users to login
- Wrap dashboard routes
- Show loading state while checking auth

## State Management

### Authentication State
```javascript
{
  user: { uid, email },           // Firebase auth user
  sellerData: { shopName, ... },  // Firestore seller doc
  loading: boolean,               // Loading state
  error: string,                  // Error message
  isAuthenticated: boolean,       // Auth status
  isSeller: boolean              // Has seller profile
}
```

## Database Schema

### Firestore Collections

#### 1. sellers
```
/sellers/{uid}
├── uid: string
├── email: string
├── shopName: string
├── phoneNumber: string
├── description: string
├── profileImage: URL
├── rating: number
├── verified: boolean
├── totalProducts: number
├── totalOrders: number
├── totalRevenue: number
├── createdAt: timestamp
└── updatedAt: timestamp
```

#### 2. products
```
/products/{productId}
├── sellerId: string (FK to sellers)
├── name: string
├── description: string
├── category: string
├── images: array[URL]
├── price: number
├── stock: number
├── location: string
├── views: number
├── soldCount: number
├── createdAt: timestamp
└── updatedAt: timestamp
```

#### 3. reels
```
/reels/{reelId}
├── sellerId: string (FK to sellers)
├── videoUrl: URL
├── caption: string
├── tags: array[string]
├── likes: number
├── comments: number
├── shares: number
├── createdAt: timestamp
└── updatedAt: timestamp
```

#### 4. orders
```
/orders/{orderId}
├── sellerId: string (FK to sellers)
├── customerId: string (FK to buyers)
├── customerName: string
├── totalAmount: number
├── status: enum[pending,processing,shipped,delivered,cancelled]
├── createdAt: timestamp
└── updatedAt: timestamp
```

## Firebase Storage Structure

```
storage-bucket/
├── products/
│   └── {sellerId}/
│       ├── image1.jpg
│       ├── image2.jpg
│       └── ...
└── reels/
    └── {sellerId}/
        ├── video1.mp4
        ├── video2.webm
        └── ...
```

## Component Architecture

### Layout Components
- `DashboardLayout` - Wraps all dashboard pages
  - Uses `Header` for top navigation
  - Uses `Sidebar` for left navigation
  - Manages sidebar open/close state

- `Header` - Top navigation bar
  - Shows shop name and logo
  - User info and logout button
  - Mobile menu toggle

- `Sidebar` - Left navigation menu
  - Navigation links to all pages
  - Active state highlighting
  - Mobile responsive

### Page Components
```
pages/
├── auth/
│   ├── SellerLogin - Email/password login form
│   └── SellerSignup - Account creation form
├── dashboard/
│   └── Dashboard - Stats and quick actions
├── products/
│   └── Products - Add/edit/delete/search products
├── reels/
│   └── Reels - Upload and manage reels
├── orders/
│   └── Orders - View and track orders
├── analytics/
│   └── Analytics - Sales data and insights
└── settings/
    └── Settings - Profile and account management
```

## Data Flow

### Product Creation
```
User Input Form
    ↓
File Upload to Storage
    ↓
Get Download URL
    ↓
Save to Firestore
    ↓
Update Local State
    ↓
Display in Products List
```

### Order Fetching
```
Component Mounts
    ↓
Query Firestore (sellerId == uid)
    ↓
Transform Data
    ↓
Update State
    ↓
Render Order List
```

### Analytics Calculation
```
Fetch All Products
    ↓
Calculate Totals:
  - Sum views
  - Sum revenue
  - Count orders
    ↓
Calculate Averages:
  - Average order value
  - Top products
    ↓
Display Charts
```

## Routing Structure

```
App.jsx
├── Routes
│   ├── /seller-login (SellerLogin)
│   ├── /seller-signup (SellerSignup)
│   ├── /dashboard (Protected)
│   │   └── Dashboard
│   ├── /products (Protected)
│   │   └── Products
│   ├── /reels (Protected)
│   │   └── Reels
│   ├── /orders (Protected)
│   │   └── Orders
│   ├── /analytics (Protected)
│   │   └── Analytics
│   ├── /settings (Protected)
│   │   └── Settings
│   └── / → Redirect to /dashboard
```

## Responsive Design Strategy

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Components
```
Mobile:
├── Header (full width)
├── Content (full width with padding)
└── (Sidebar hidden - on toggle overlay)

Tablet:
├── Header (full width)
├── Sidebar (collapsed or drawer)
└── Content (adjusted width)

Desktop:
├── Header (full width)
├── Sidebar (fixed, full height)
└── Content (fill remaining space)
```

## Security Considerations

### Authentication
- ✅ Firebase handles password hashing
- ✅ JWT tokens managed by Firebase
- ✅ Auth state persisted in localStorage

### Authorization
- ✅ Protected routes check auth status
- ✅ Firestore rules enforce user ownership
- ✅ Storage rules prevent unauthorized access

### Data Protection
```javascript
// Firestore Rules Example
match /products/{productId} {
  allow read: if true;  // Anyone can view
  allow write: if request.auth.uid == resource.data.sellerId;  // Only seller
}
```

## Performance Optimizations

### Code Splitting
- Dynamic imports for routes (future enhancement)
- Lazy loading components

### Data Fetching
- Efficient Firestore queries with `where` clauses
- Real-time listeners for live updates
- Batch operations where possible

### UI Rendering
- Tailwind CSS for optimized styling
- Conditional rendering for loading states
- Proper event delegation

## Error Handling

### Auth Errors
- Email already exists
- Wrong password
- Invalid credentials
- Network errors

### Data Errors
- Upload failures
- Query errors
- Validation errors

### UI Errors
- Show error messages to user
- Provide retry buttons
- Log to console for debugging

## Testing Checklist

- [ ] Signup creates seller document
- [ ] Login fetches seller data
- [ ] Logout clears auth state
- [ ] Protected routes redirect
- [ ] Product upload stores images
- [ ] Product deletion works
- [ ] Reels upload works
- [ ] Analytics calculate correctly
- [ ] Profile updates save
- [ ] Mobile responsive works

## Integration Points

### With Buyer App
1. Products collection readable by buyers
2. Reels collection readable by buyers
3. Seller profile viewable by buyers
4. Orders created by buyers for sellers

### With Backend Services
1. Email notifications (future)
2. Payment processing (future)
3. Shipping integration (future)
4. Analytics dashboard (future)

## Deployment Considerations

### Pre-deployment Checklist
- [ ] Firebase project created
- [ ] All environment variables configured
- [ ] Security rules deployed
- [ ] Build tested locally
- [ ] Error handling verified
- [ ] Loading states working
- [ ] Mobile responsiveness checked
- [ ] XSS protection enabled
- [ ] HTTPS configured

### Environment Variables
```
Production (.env.production)
├── VITE_FIREBASE_API_KEY
├── VITE_FIREBASE_AUTH_DOMAIN
├── VITE_FIREBASE_PROJECT_ID
├── VITE_FIREBASE_STORAGE_BUCKET
├── VITE_FIREBASE_MESSAGING_SENDER_ID
└── VITE_FIREBASE_APP_ID
```

## Monitoring & Logging

### Key Metrics
- Auth success/failure rates
- Product upload success rate
- Page load times
- Firebase usage

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'closekart:*');
```

## Future Enhancements

1. **Advanced Analytics**
   - Charts and graphs
   - Customer behavior tracking
   - Conversion funnels

2. **Automation**
   - Auto-replies to messages
   - Inventory alerts
   - Order notifications

3. **Integration**
   - Multiple payment gateways
   - Shipping APIs
   - Email marketing

4. **Mobile App**
   - React Native version
   - Native push notifications
   - Offline sync

5. **AI Features**
   - Product recommendations
   - Pricing optimization
   - Chatbot support

---

**Architecture designed for scalability, maintainability, and user experience.**
