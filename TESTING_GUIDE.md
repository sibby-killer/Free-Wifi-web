# FreeWiFi KE - Testing Guide

## 🚀 Server Status
✅ **Dev server is running on http://localhost:3000**

## 🧪 Features to Test

### 1. Landing Page (/)
- [ ] Hero section displays correctly
- [ ] Plans showcase (10 Mbps & 12 Mbps)
- [ ] Coverage areas visible
- [ ] Contact section with WhatsApp links
- [ ] **SECRET ADMIN ACCESS**: Click the "FreeWiFi KE" logo 4 times quickly
  - On 3rd click: Logo should shake
  - On 4th click: Redirects to `/admin`
- [ ] Floating WhatsApp button works
- [ ] Mobile responsive

### 2. Authentication
#### Sign Up (/sign-up)
- [ ] Click "Sign Up" button
- [ ] Clerk modal opens
- [ ] Create a new account
- [ ] Should redirect to `/dashboard` after signup

#### Sign In (/sign-in)
- [ ] Click "Login" button
- [ ] Clerk modal opens
- [ ] Sign in with existing account
- [ ] Should redirect to `/dashboard` after login

### 3. User Dashboard (/dashboard)
**Bottom Navigation Test:**
- [ ] 4 tabs visible: Dashboard, Reviews, AI Chat, Orders
- [ ] Tab switching works smoothly
- [ ] Active tab highlighted in blue

#### Dashboard Tab
- [ ] Welcome message shows your first name
- [ ] Current plan card displays "No active plan"
- [ ] Quick action buttons visible
- [ ] Account information displays correctly

#### Reviews Tab ⭐
- [ ] Location filter dropdown works
- [ ] "Write a Review" button opens modal
- [ ] Submit a review:
  - Select rating (1-5 stars)
  - Choose region (Kakamega or Bungoma)
  - Choose sub-location (changes based on region)
  - Add review text (optional)
  - Submit
- [ ] Success message: "Review submitted! It will appear after admin approval."
- [ ] Reviews list loads (may be empty initially)

#### AI Chat Tab 🤖
- [ ] Chat interface loads
- [ ] AI welcome message appears
- [ ] Type a message and click Send
- [ ] AI responds (using Groq API)
- [ ] Test @admin mention:
  - Type: "Hello @admin, I need help"
  - Should see: "Admin notification sent" indicator
  - Admin should receive email notification
- [ ] Chat history scrolls automatically
- [ ] Loading state shows "Typing..."

#### Orders Tab 📦
- [ ] Order form displays
- [ ] Select a plan (10 Mbps or 12 Mbps)
- [ ] Selected plan highlights in blue
- [ ] Fill in all fields:
  - Region
  - Sub-location (updates based on region)
  - Address
  - Google Maps link (optional)
  - Preferred installation date
  - WhatsApp number
  - Additional notes (optional)
- [ ] Submit order
- [ ] Success alert appears
- [ ] WhatsApp opens with pre-filled message
- [ ] Order appears in "My Orders" section
- [ ] Order status badge displays correctly

### 4. Admin Dashboard (/admin)
**Prerequisites:** 
- Create admin user in Clerk Dashboard
- Add `{"role": "admin"}` to Public Metadata

#### Access Admin
- [ ] Click logo 4 times on homepage, OR
- [ ] Navigate directly to `/admin`
- [ ] Non-admin users should be redirected

#### Admin Overview
- [ ] Stats cards display (Orders, Tickets, Users)
- [ ] Quick access links work:
  - [ ] Manage Orders
  - [ ] Support Tickets
  - [ ] Users
  - [ ] Reviews

#### Admin Orders Page
- [ ] Navigate to `/admin/orders`
- [ ] Orders table displays
- [ ] Can see all customer orders
- [ ] Order details visible

### 5. API Endpoints to Test

#### Orders API
```bash
# Create order (requires auth)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "10 Mbps Basic Plan",
    "price": 1500,
    "region": "kakamega",
    "subLocation": "Lurambi",
    "address": "Main Street, Building 5",
    "preferredDate": "2026-02-15",
    "whatsappNumber": "0762667048"
  }'

# Get user orders
curl http://localhost:3000/api/orders
```

#### Reviews API
```bash
# Create review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "content": "Great service!",
    "region": "kakamega",
    "subLocation": "Lurambi"
  }'

# Get reviews
curl http://localhost:3000/api/reviews?location=all
```

#### Chat API
```bash
# Send message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your plans?"}'

# Get chat history
curl http://localhost:3000/api/chat
```

### 6. Email Notifications to Test
**Note:** Requires valid Resend API key in `.env`

- [ ] **Order Confirmation**: Submit an order → Check customer email
- [ ] **Admin Order Notification**: Submit an order → Check admin email
- [ ] **@admin Mention**: Use @admin in chat → Check admin email
- [ ] **Support Ticket**: Create ticket → Check admin email

### 7. Mobile Responsiveness
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on:
  - [ ] iPhone SE (375px)
  - [ ] iPhone 12 Pro (390px)
  - [ ] iPad (768px)
  - [ ] Desktop (1920px)
- [ ] Bottom navigation works on mobile
- [ ] Forms are easy to fill on mobile
- [ ] Modals display correctly

## 🔧 Common Issues & Solutions

### "Unauthorized" errors
- Make sure you're signed in
- Check Clerk configuration in `.env`

### API errors
- Verify all environment variables are set
- Check database connection (Prisma)
- Ensure Groq API key is valid
- Ensure Resend API key is valid

### Admin access not working
- Go to Clerk Dashboard
- Find your user
- Add `{"role": "admin"}` to Public Metadata
- Sign out and sign in again

### Email notifications not sending
- Check Resend API key
- Verify EMAIL_FROM is configured
- Check console for email errors

## 📊 Test Checklist Summary

**Frontend:**
- [x] Landing page
- [x] Authentication (Clerk)
- [x] User dashboard with tabs
- [x] Reviews tab with modal
- [x] AI Chat with Groq
- [x] Orders form with WhatsApp
- [x] Admin dashboard
- [x] Admin orders page

**Backend:**
- [x] Orders API (GET, POST)
- [x] Reviews API (GET, POST)
- [x] Chat API (GET, POST)
- [x] Tickets API (GET, POST)
- [x] Email notifications

**Features:**
- [x] Secret admin access (4 logo clicks)
- [x] TikTok-style bottom navigation
- [x] @admin mention in chat
- [x] WhatsApp integration
- [x] Location-based filtering
- [x] Order history
- [x] Review moderation (admin approval)

## 🎯 Next Steps After Testing

1. **Fix any bugs found**
2. **Complete remaining admin pages** (tickets, users, reviews)
3. **Add loading states** where needed
4. **Improve error handling**
5. **Test email notifications** thoroughly
6. **Deploy to Vercel**

---

## 🌐 Local URLs
- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Prisma Studio**: `npx prisma studio` → http://localhost:5555

**Happy Testing! 🚀**
