# 🧪 **PulseFi Navigation Test Guide**

## **🚀 How to Test All Navigation**

### **1. Start the App**
```bash
cd frontend
npm run dev
```

### **2. Landing Page Test** (`/`)
- ✅ Click "Get Started" → Should go to `/user-type`
- ✅ Click "Learn More" → Should scroll to features

### **3. User Type Selection** (`/user-type`)
- ✅ Click "SME Owner" → Should go to `/sme/onboarding`
- ✅ Click "Lender/Investor" → Should go to `/auth`

### **4. Authentication** (`/auth`)
- ✅ Register/Login as SME → Should go to `/sme/dashboard`
- ✅ Register/Login as Lender → Should go to `/lender/dashboard`

---

## **🏢 SME Navigation Test**

### **Main Navigation Bar**
- ✅ **Dashboard** → `/sme/dashboard`
- ✅ **Applications** → `/sme/applications`
- ✅ **Find Lenders** → `/sme/lenders`
- ✅ **My Pitches** → `/sme/pitches`
- ✅ **My Profile** → `/sme/profile`

### **Quick Access Buttons** (From Dashboard)
- ✅ **Create Application** → `/sme/applications`
- ✅ **Find Lenders** → `/sme/lenders`
- ✅ **View Profile** → `/sme/profile`
- ✅ **Track Pitches** → `/sme/pitches`

### **Profile Page Tabs** (`/sme/profile`)
- ✅ **Business Info** → Company details, team info
- ✅ **Verification** → Pulse/Profit score breakdowns
- ✅ **Financial Data** → Revenue, bank connections
- ✅ **Settings** → Account, privacy settings

### **Breadcrumb Navigation**
- ✅ Shows current location
- ✅ Clickable navigation back to previous pages
- ✅ Home icon goes to dashboard

---

## **💰 Lender Navigation Test**

### **Main Navigation Bar**
- ✅ **Dashboard** → `/lender/dashboard`
- ✅ **SME Marketplace** → `/marketplace`
- ✅ **Applications** → `/lender/applications`
- ✅ **My Offers** → `/lender/offers`
- ✅ **Portfolio** → `/lender/portfolio`
- ✅ **My Profile** → `/lender/profile`

### **Quick Access Buttons** (From Dashboard)
- ✅ **Browse SMEs** → `/marketplace`
- ✅ **View Applications** → `/lender/applications`
- ✅ **My Portfolio** → `/lender/portfolio`
- ✅ **My Profile** → `/lender/profile`

### **Profile Page Tabs** (`/lender/profile`)
- ✅ **Overview** → Company info, investment thesis
- ✅ **Investment Criteria** → Terms, requirements
- ✅ **Portfolio** → Current investments, performance
- ✅ **Settings** → Account, investment preferences

### **Marketplace Navigation** (`/marketplace`)
- ✅ Click SME card → Opens SME profile modal
- ✅ SME profile modal tabs work
- ✅ "Make an Offer" button works
- ✅ Negotiate tab accessible

---

## **🔄 Cross-Navigation Test**

### **User Menu (Top Right)**
- ✅ **Profile Icon** → Goes to respective profile page
- ✅ **Logout Icon** → Returns to landing page
- ✅ **User Type Badge** → Shows SME or Lender

### **Logo Navigation**
- ✅ **PulseFi Logo** → Returns to respective dashboard

### **Mobile Navigation**
- ✅ **Hamburger Menu** → Shows all navigation items
- ✅ **Mobile Menu Items** → All clickable and working

---

## **🎯 Critical Navigation Flows**

### **SME Complete Journey**
1. `/` → `/user-type` → `/sme/onboarding` → `/sme/dashboard`
2. Dashboard → Applications → Create loan application
3. Dashboard → Find Lenders → Browse lenders → Submit pitch
4. Dashboard → My Profile → Edit business info
5. Dashboard → My Pitches → Track pitch status

### **Lender Complete Journey**
1. `/` → `/user-type` → `/auth` → `/lender/dashboard`
2. Dashboard → SME Marketplace → Browse SMEs → View profile
3. Marketplace → SME Profile → Negotiate → Make offer
4. Dashboard → My Profile → Update investment criteria
5. Dashboard → Portfolio → Track investments

---

## **🐛 Common Issues to Check**

### **Navigation Issues**
- ❌ **Profile pages not showing** → Check if routes are properly defined
- ❌ **Navigation bar not appearing** → Check AppNavigation component import
- ❌ **Breadcrumbs not working** → Check Breadcrumb component paths
- ❌ **Quick access buttons not working** → Check QuickAccess component paths

### **Route Issues**
- ❌ **404 errors** → Check if all routes are defined in App.jsx
- ❌ **Blank pages** → Check if components are properly imported
- ❌ **Navigation not updating** → Check if useNavigate is working

### **Component Issues**
- ❌ **Profile tabs not switching** → Check tab state management
- ❌ **Modal not opening** → Check modal state and event handlers
- ❌ **Forms not submitting** → Check form handlers and navigation

---

## **✅ Success Criteria**

### **All Routes Accessible**
- Every navigation item works
- All profile pages load correctly
- Breadcrumbs show proper navigation
- Quick access buttons function

### **Smooth User Experience**
- No broken links or 404 errors
- Fast navigation between pages
- Consistent navigation across all pages
- Mobile navigation works properly

### **Complete Feature Access**
- SMEs can access all their features
- Lenders can access all their features
- Profile pages fully functional
- Cross-navigation between user types works

**🎉 If all tests pass, the navigation system is complete and functional!**