# 🗺️ **PulseFi Complete Navigation Map**

## **🏠 Entry Points**

### **1. Landing Page** (`/`)
- **Components**: `Hero.jsx`, `Features.jsx`, `Process.jsx`, `Opportunities.jsx`
- **Actions**: 
  - Click "Get Started" → Auth Page
  - Click "Learn More" → Scroll to features

### **2. Authentication** (`/auth`)
- **Component**: `AuthPage.jsx`
- **User Types**: SME Owner | Lender/Investor
- **Actions**:
  - **SME Registration** → SME Onboarding
  - **Lender Registration** → Lender Dashboard
  - **Login** → Respective Dashboard

---

## **🏢 SME (Sade's) Complete Journey**

### **3. SME Onboarding** (`/sme/onboarding`)
- **Component**: `SMEOnboardingPage.jsx`
- **Flow**: 
  1. **Business Info Form** → `BusinessInfoForm.jsx`
  2. **CAC Upload** → `CACUpload.jsx` 
  3. **Live Video Recording** → `VideoRecorder.jsx`
  4. **Bank Connection** → `MonoConnection.jsx`
  5. **Verification Processing** → Loading + Scores

### **4. SME Dashboard** (`/sme/dashboard`)
- **Component**: `SMEDashboard.jsx`
- **Tabs**:
  - **📊 Overview** → Stats, recent activity, quick actions
  - **📋 Loan Applications** → Create/manage applications (`LoanApplicationForm.jsx`)
  - **🔍 Find Lenders** → `LenderMarketplace.jsx` with `LenderProfileCard.jsx`
  - **📤 My Pitches** → Track submitted pitches
  - **👤 My Profile** → `SMEProfilePage.jsx` *(NEW)*

### **5. SME Profile Page** *(NEW)*
- **Component**: `SMEProfilePage.jsx`
- **Tabs**:
  - **🏢 Business Info** → Company details, description, team
  - **✅ Verification** → Pulse/Profit score breakdowns
  - **💰 Financial Data** → Revenue, bank connections, AI insights
  - **⚙️ Settings** → Account, privacy, notifications

### **6. Lender Marketplace** (Within SME Dashboard)
- **Component**: `LenderMarketplace.jsx`
- **Features**:
  - Filter lenders by type, industry, terms
  - View `LenderProfileCard.jsx` details
  - Submit pitches via enhanced `PitchModal.jsx`

---

## **💰 Lender (Bayo's) Complete Journey**

### **7. Lender Dashboard** (`/lender/dashboard`)
- **Component**: `LenderDashboard.jsx`
- **Tabs**:
  - **🏪 SME Marketplace** → `MarketplacePage.jsx`
  - **📥 Applications** → Incoming SME pitches
  - **🤝 My Offers** → Track investment offers
  - **💼 Portfolio** → Current investments
  - **👤 My Profile** → `LenderProfilePage.jsx` *(NEW)*

### **8. Lender Profile Page** *(NEW)*
- **Component**: `LenderProfilePage.jsx`
- **Tabs**:
  - **🏦 Overview** → Company info, investment thesis, team
  - **📊 Investment Criteria** → Terms, requirements, preferences
  - **💼 Portfolio** → Current investments, performance stats
  - **⚙️ Settings** → Account, investment preferences, notifications

### **9. SME Marketplace** (`/marketplace`)
- **Component**: `MarketplacePage.jsx`
- **Features**:
  - Grid/List view of verified SMEs (`SMECard.jsx`)
  - Filter by industry, location, scores
  - Click SME → `SMEProfile.jsx` modal

### **10. SME Profile Modal**
- **Component**: `SMEProfile.jsx`
- **Tabs**:
  - **📄 Overview** → Enhanced loan details, business info
  - **📊 Scores** → Pulse/Profit score breakdown
  - **📈 Charts** → Financial visualizations
  - **🤖 AI Insights** → Recommendations
  - **⚖️ Negotiate** → `NegotiationTab.jsx` (Professional term sheets)

---

## **🔄 Complete Navigation Flow Map**

```
🏠 Landing Page
    ↓ "Get Started"
🔐 Auth Page
    ↓ Choose User Type
    
📍 SME PATH:                           📍 LENDER PATH:
🏢 SME Onboarding                     💰 Lender Dashboard
    ↓ Complete 4 Steps                    ↓ Navigate 5 Tabs
📊 SME Dashboard (5 Tabs)             🏪 SME Marketplace
    ├── 📊 Overview                        ↓ Click SME Card
    ├── 📋 Applications                📋 SME Profile Modal
    ├── 🔍 Find Lenders                   ↓ "Negotiate" Tab
    ├── 📤 Pitches                     ⚖️ Investment Offers
    └── 👤 Profile (NEW)                   ↓ Submit Offer
        ├── 🏢 Business Info           🤝 Offer Management
        ├── ✅ Verification                ↓ "My Profile"
        ├── 💰 Financial               👤 Lender Profile (NEW)
        └── ⚙️ Settings                    ├── 🏦 Overview
                                           ├── 📊 Investment Criteria
                                           ├── 💼 Portfolio
                                           └── ⚙️ Settings
```

---

## **🎯 Demo Navigation Sequence**

### **Complete Demo Flow:**

1. **Start**: `/` → Show problem statement
2. **SME Registration**: `/auth` → Register as SME
3. **SME Onboarding**: `/sme/onboarding` → Complete 4-step verification
4. **Verification Results**: Show Pulse Score (92) + Profit Score (85)
5. **SME Dashboard**: `/sme/dashboard` → Overview tab
6. **SME Profile**: Click "My Profile" → Show comprehensive business profile
7. **Loan Application**: Applications tab → Create loan application
8. **Lender Discovery**: Find Lenders tab → Browse lender marketplace
9. **Submit Pitch**: Select "Pulse Capital" → Submit professional pitch
10. **Switch to Lender**: `/lender/dashboard` → Show lender dashboard
11. **Lender Profile**: Click "My Profile" → Show investment criteria & portfolio
12. **SME Discovery**: Marketplace tab → View verified SMEs
13. **SME Analysis**: Click SME → View detailed profile with loan request
14. **Investment Offer**: Negotiate tab → Submit formal term sheet
15. **Portfolio Management**: Portfolio tab → Track investment performance
16. **Success**: Complete marketplace transaction with professional profiles

---

## **📱 Complete Component Hierarchy**

```
App.jsx
├── AuthApp.jsx (/auth)
├── SMEApp.jsx (/sme/*)
│   ├── SMEOnboardingPage.jsx
│   │   ├── OnboardingWizard.jsx
│   │   ├── BusinessInfoForm.jsx
│   │   ├── CACUpload.jsx
│   │   ├── VideoRecorder.jsx
│   │   └── MonoConnection.jsx
│   ├── SMEDashboard.jsx
│   │   ├── LenderMarketplace.jsx
│   │   │   ├── LenderProfileCard.jsx
│   │   │   └── PitchModal.jsx (Enhanced)
│   │   └── SMEProfilePage.jsx (NEW)
│   │       ├── BusinessInfoTab
│   │       ├── VerificationTab
│   │       ├── FinancialTab
│   │       └── SettingsTab
└── MarketplaceApp.jsx (/marketplace, /lender/*)
    ├── LenderDashboard.jsx
    │   └── LenderProfilePage.jsx (NEW)
    │       ├── OverviewTab
    │       ├── InvestmentTab
    │       ├── PortfolioTab
    │       └── SettingsTab
    └── MarketplacePage.jsx
        ├── SMECard.jsx (Updated)
        └── SMEProfile.jsx (Enhanced)
            ├── InvestmentCard.jsx
            └── NegotiationTab.jsx (Professional)
```

---

## **🚀 All Accessible URLs**

### **Public Pages**
- **Landing**: `/`
- **Auth**: `/auth`

### **SME Pages**
- **Onboarding**: `/sme/onboarding`
- **Dashboard**: `/sme/dashboard`
  - Overview, Applications, Find Lenders, Pitches, **Profile**

### **Lender Pages**
- **Dashboard**: `/lender/dashboard`
  - Marketplace, Applications, Offers, Portfolio, **Profile**
- **Marketplace**: `/marketplace`
- **SME Profile**: `/marketplace/profile/:id`

---

## **✨ New Features Added**

### **SME Profile Page**
- **Business Information**: Complete company details, team info
- **Verification Status**: Detailed Pulse/Profit score breakdowns
- **Financial Dashboard**: Revenue, bank connections, AI insights
- **Settings**: Account, privacy, notification preferences

### **Lender Profile Page**
- **Company Overview**: Investment thesis, leadership team
- **Investment Criteria**: Terms, requirements, industry focus
- **Portfolio Management**: Current investments, performance tracking
- **Preferences**: Investment settings, notification controls

### **Enhanced User Experience**
- **Professional Profiles**: Both SMEs and Lenders have comprehensive profiles
- **Complete Settings**: Privacy, notifications, preferences for both user types
- **Portfolio Tracking**: Lenders can manage their investment portfolio
- **Verification Details**: SMEs can see detailed score breakdowns

**Every page is now accessible with complete user profiles for both SMEs and Lenders!** 🎉