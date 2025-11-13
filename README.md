# PulseFi - SME Lending Platform

## 🚀 Project Overview

PulseFi is a revolutionary two-sided marketplace that de-risks SME lending through an intelligent "Twin Score System":
- **Pulse Score**: Validates SME authenticity through multi-modal verification
- **Profit Score**: Analyzes financial health of verified businesses
- **Marketplace**: Connects pre-vetted SMEs with confident lenders

## 📁 Repository Structure

```
Zecathon/
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── auth/            # Authentication system
│   │   ├── sme/             # SME user experience
│   │   ├── marketplace/     # Lender marketplace
│   │   ├── components/      # Shared components
│   │   └── data/           # Demo data (to be replaced)
│   └── package.json
├── backend/                 # Django Backend (needs implementation)
└── README.md
```

## 🎯 Demo Flow Requirements

### **Critical Demo Path:**
1. **SME Registration** → Business Info → CAC Upload → Video Recording → Bank Connection
2. **AI Processing** → Pulse Score Generation → Profit Score Analysis
3. **Marketplace** → Lender Discovery → Investment Offers → Negotiations

---

## 🔧 BACKEND API REQUIREMENTS

### **Base URL:** `https://api.pulsefi.com` or `http://localhost:8000`

### **Authentication Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 📋 COMPLETE API ENDPOINTS SPECIFICATION

### 🔐 **1. AUTHENTICATION ENDPOINTS**

#### **POST /api/auth/register/sme**
Register new SME user
```json
// Request Body
{
  "email": "sade@business.com",
  "password": "securePassword123",
  "firstName": "Sade",
  "lastName": "Adebayo",
  "phoneNumber": "+2348012345678",
  "businessName": "Sade Fashion House"
}

// Response (201 Created)
{
  "success": true,
  "message": "SME registered successfully",
  "data": {
    "userId": "sme_12345",
    "email": "sade@business.com",
    "userType": "sme",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### **POST /api/auth/register/lender**
Register new Lender user
```json
// Request Body
{
  "email": "bayo@investment.com",
  "password": "securePassword123",
  "firstName": "Bayo",
  "lastName": "Ogundimu",
  "phoneNumber": "+2348087654321",
  "organizationName": "Lagos Investment Partners",
  "investmentFocus": ["fintech", "retail", "agriculture"]
}

// Response (201 Created)
{
  "success": true,
  "message": "Lender registered successfully",
  "data": {
    "userId": "lender_67890",
    "email": "bayo@investment.com",
    "userType": "lender",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### **POST /api/auth/login**
Login existing user
```json
// Request Body
{
  "email": "sade@business.com",
  "password": "securePassword123"
}

// Response (200 OK)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "sme_12345",
    "email": "sade@business.com",
    "userType": "sme",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "profile": {
      "firstName": "Sade",
      "lastName": "Adebayo",
      "businessName": "Sade Fashion House",
      "verificationStatus": "pending",
      "pulseScore": null,
      "profitScore": null
    }
  }
}
```

#### **POST /api/auth/refresh**
Refresh JWT token
```json
// Request Body
{
  "refreshToken": "refresh_token_here"
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here",
    "refreshToken": "new_refresh_token_here"
  }
}
```

---

### 🏢 **2. SME PROFILE & VERIFICATION ENDPOINTS**

#### **POST /api/sme/profile**
Submit business information (Stated Truth)
```json
// Request Body
{
  "businessName": "Sade Fashion House",
  "businessType": "retail",
  "industry": "fashion",
  "yearEstablished": 2020,
  "employeeCount": 8,
  "monthlyRevenue": 2500000,
  "businessAddress": "15 Balogun Street, Lagos Island",
  "state": "Lagos",
  "lga": "Lagos Island",
  "businessDescription": "We design and sell contemporary African fashion",
  "targetMarket": "Young professionals aged 25-40",
  "competitiveAdvantage": "Unique blend of traditional and modern designs",
  "fundingAmount": 5000000,
  "fundingPurpose": "Expand inventory and open new location"
}

// Response (201 Created)
{
  "success": true,
  "message": "Business profile saved successfully",
  "data": {
    "profileId": "profile_12345",
    "status": "profile_completed",
    "nextStep": "cac_upload"
  }
}
```

#### **POST /api/sme/upload/cac**
Upload CAC certificate
```json
// Request: multipart/form-data
// Fields:
// - file: CAC certificate (PDF/Image)
// - rcNumber: "RC123456" (optional)

// Response (201 Created)
{
  "success": true,
  "message": "CAC certificate uploaded successfully",
  "data": {
    "fileId": "cac_file_12345",
    "fileName": "cac_certificate.pdf",
    "fileSize": 2048576,
    "uploadedAt": "2024-11-12T19:30:00Z",
    "status": "uploaded",
    "nextStep": "business_type_check"
  }
}
```

#### **POST /api/sme/verify-cac**
Verify RC number with CAC database
```json
// Request Body
{
  "rcNumber": "RC123456"
}

// Response (200 OK) - Success
{
  "success": true,
  "message": "CAC verification successful",
  "data": {
    "rcNumber": "RC123456",
    "name": "SADE FASHION HOUSE LIMITED",
    "address": "15 BALOGUN STREET, LAGOS ISLAND, LAGOS",
    "dateOfRegistration": "2020-03-15",
    "isRegistrationComplete": true,
    "status": "active"
  }
}

// Response (404 Not Found) - Company not found
{
  "success": false,
  "message": "Company not found in CAC database",
  "data": null
}
```

#### **POST /api/sme/business-type**
Submit business type verification
```json
// Request Body
{
  "businessType": "physical_store",
  "hasPhysicalLocation": true,
  "operatingHours": "9AM - 6PM",
  "businessModel": "B2C"
}

// Response (201 Created)
{
  "success": true,
  "message": "Business type information saved",
  "data": {
    "status": "business_type_completed",
    "nextStep": "video_recording"
  }
}
```

#### **POST /api/sme/upload/video**
Upload business verification video (Visual Truth)
```json
// Request: multipart/form-data
// Fields:
// - video: Business video file (MP4/WebM)
// - duration: Video duration in seconds
// - recordedAt: Timestamp when recorded

// Response (201 Created)
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "videoId": "video_12345",
    "fileName": "business_video.mp4",
    "fileSize": 15728640,
    "duration": 45,
    "uploadedAt": "2024-11-12T19:45:00Z",
    "status": "uploaded",
    "nextStep": "bank_connection"
  }
}
```

#### **POST /api/sme/mono/connect**
Connect bank account via Mono (Financial Truth)
```json
// Request Body
{
  "monoCode": "code_1234567890",
  "accountId": "acc_1234567890",
  "bankName": "First Bank of Nigeria",
  "accountName": "SADE FASHION HOUSE LIMITED",
  "accountNumber": "1234567890"
}

// Response (201 Created)
{
  "success": true,
  "message": "Bank account connected successfully",
  "data": {
    "connectionId": "mono_conn_12345",
    "accountId": "acc_1234567890",
    "bankName": "First Bank of Nigeria",
    "accountName": "SADE FASHION HOUSE LIMITED",
    "connectedAt": "2024-11-12T20:00:00Z",
    "status": "connected",
    "nextStep": "processing"
  }
}
```

#### **GET /api/sme/dashboard**
Get SME dashboard data
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "user": {
      "firstName": "Sade",
      "lastName": "Adebayo",
      "businessName": "Sade Fashion House",
      "email": "sade@business.com"
    },
    "verificationStatus": "verified", // "pending", "processing", "verified", "failed"
    "pulseScore": 87,
    "profitScore": 74,
    "verificationSteps": {
      "profile": { "completed": true, "completedAt": "2024-11-12T19:00:00Z" },
      "cac": { "completed": true, "completedAt": "2024-11-12T19:30:00Z" },
      "businessType": { "completed": true, "completedAt": "2024-11-12T19:35:00Z" },
      "video": { "completed": true, "completedAt": "2024-11-12T19:45:00Z" },
      "bankConnection": { "completed": true, "completedAt": "2024-11-12T20:00:00Z" }
    },
    "scoreBreakdown": {
      "pulseScore": {
        "total": 87,
        "components": {
          "cacVerification": 25,
          "videoAuthenticity": 22,
          "bankAccountMatch": 20,
          "profileConsistency": 20
        }
      },
      "profitScore": {
        "total": 74,
        "components": {
          "profitability": 18,
          "cashFlow": 20,
          "growthTrend": 16,
          "customerRetention": 20
        }
      }
    },
    "recommendations": [
      "Your CAC verification boosted your Pulse Score significantly",
      "Consider improving cash flow consistency for better Profit Score"
    ],
    "marketplaceStats": {
      "profileViews": 23,
      "lenderInterest": 5,
      "activeOffers": 2
    }
  }
}
```

#### **GET /api/sme/profile**
Get complete SME profile
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "businessInfo": {
      "businessName": "Sade Fashion House",
      "businessType": "retail",
      "industry": "fashion",
      "yearEstablished": 2020,
      "employeeCount": 8,
      "monthlyRevenue": 2500000,
      "businessAddress": "15 Balogun Street, Lagos Island",
      "state": "Lagos",
      "lga": "Lagos Island",
      "businessDescription": "We design and sell contemporary African fashion"
    },
    "verification": {
      "pulseScore": 87,
      "profitScore": 74,
      "verificationStatus": "verified",
      "cacVerified": true,
      "videoVerified": true,
      "bankConnected": true
    },
    "financialData": {
      "monthlyRevenue": 2500000,
      "monthlyExpenses": 1800000,
      "profitMargin": 28,
      "cashFlow": "positive",
      "growthRate": 15
    },
    "documents": {
      "cacCertificate": {
        "fileName": "cac_certificate.pdf",
        "uploadedAt": "2024-11-12T19:30:00Z",
        "verified": true
      },
      "businessVideo": {
        "fileName": "business_video.mp4",
        "uploadedAt": "2024-11-12T19:45:00Z",
        "duration": 45,
        "verified": true
      }
    }
  }
}
```

---

### 💰 **3. LENDER MARKETPLACE ENDPOINTS**

#### **GET /api/lender/marketplace**
Get list of verified SMEs for lenders
```json
// Query Parameters:
// ?page=1&limit=10&industry=fashion&state=Lagos&minPulseScore=75&minProfitScore=60

// Response (200 OK)
{
  "success": true,
  "data": {
    "smes": [
      {
        "id": "sme_12345",
        "businessName": "Sade Fashion House",
        "industry": "fashion",
        "location": "Lagos Island, Lagos",
        "pulseScore": 87,
        "profitScore": 74,
        "fundingAmount": 5000000,
        "fundingPurpose": "Expand inventory and open new location",
        "yearEstablished": 2020,
        "employeeCount": 8,
        "monthlyRevenue": 2500000,
        "growthRate": 15,
        "riskLevel": "low",
        "profileImage": "https://api.pulsefi.com/uploads/profiles/sme_12345.jpg",
        "lastActive": "2024-11-12T20:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "industries": ["fashion", "fintech", "agriculture", "retail"],
      "states": ["Lagos", "Abuja", "Kano", "Rivers"],
      "pulseScoreRange": { "min": 0, "max": 100 },
      "profitScoreRange": { "min": 0, "max": 100 }
    }
  }
}
```

#### **GET /api/lender/marketplace/:smeId**
Get detailed SME profile for lenders
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "basicInfo": {
      "id": "sme_12345",
      "businessName": "Sade Fashion House",
      "industry": "fashion",
      "businessType": "retail",
      "yearEstablished": 2020,
      "employeeCount": 8,
      "location": "Lagos Island, Lagos",
      "businessDescription": "We design and sell contemporary African fashion",
      "targetMarket": "Young professionals aged 25-40",
      "competitiveAdvantage": "Unique blend of traditional and modern designs"
    },
    "scores": {
      "pulseScore": 87,
      "profitScore": 74,
      "riskLevel": "low",
      "verificationStatus": "verified"
    },
    "financialHighlights": {
      "monthlyRevenue": 2500000,
      "profitMargin": 28,
      "growthRate": 15,
      "cashFlowStatus": "positive",
      "debtToIncomeRatio": 0.3
    },
    "fundingRequest": {
      "amount": 5000000,
      "purpose": "Expand inventory and open new location",
      "expectedROI": 25,
      "paybackPeriod": 24,
      "collateral": "Business inventory and equipment"
    },
    "verification": {
      "cacVerified": true,
      "videoVerified": true,
      "bankConnected": true,
      "documentsComplete": true,
      "lastVerified": "2024-11-12T20:00:00Z"
    },
    "marketMetrics": {
      "profileViews": 23,
      "lenderInterest": 5,
      "activeOffers": 2,
      "averageOfferAmount": 4200000
    }
  }
}
```

#### **GET /api/lender/dashboard**
Get lender dashboard data
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "user": {
      "firstName": "Bayo",
      "lastName": "Ogundimu",
      "organizationName": "Lagos Investment Partners",
      "email": "bayo@investment.com"
    },
    "portfolio": {
      "totalInvestments": 15,
      "totalAmount": 75000000,
      "activeInvestments": 12,
      "averageROI": 22.5,
      "defaultRate": 2.1
    },
    "marketplaceStats": {
      "totalVerifiedSMEs": 247,
      "newSMEsThisWeek": 8,
      "averagePulseScore": 78,
      "averageProfitScore": 71
    },
    "recentActivity": [
      {
        "type": "new_sme",
        "smeId": "sme_12345",
        "businessName": "Sade Fashion House",
        "pulseScore": 87,
        "timestamp": "2024-11-12T20:00:00Z"
      }
    ],
    "recommendations": [
      {
        "smeId": "sme_12345",
        "businessName": "Sade Fashion House",
        "reason": "High Pulse Score and growing fashion industry",
        "matchScore": 92
      }
    ]
  }
}
```

#### **POST /api/lender/offers**
Make investment offer to SME
```json
// Request Body
{
  "smeId": "sme_12345",
  "offerAmount": 4500000,
  "interestRate": 18,
  "termMonths": 24,
  "offerType": "loan", // "loan", "equity", "revenue_share"
  "conditions": [
    "Monthly financial reporting required",
    "Quarterly business reviews",
    "Insurance coverage mandatory"
  ],
  "message": "We're impressed with your business model and growth potential."
}

// Response (201 Created)
{
  "success": true,
  "message": "Investment offer submitted successfully",
  "data": {
    "offerId": "offer_12345",
    "smeId": "sme_12345",
    "lenderId": "lender_67890",
    "offerAmount": 4500000,
    "status": "pending",
    "submittedAt": "2024-11-12T21:00:00Z",
    "expiresAt": "2024-11-19T21:00:00Z"
  }
}
```

---

### 🤝 **4. NEGOTIATION & OFFERS ENDPOINTS**

#### **GET /api/sme/offers**
Get investment offers for SME
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "offers": [
      {
        "offerId": "offer_12345",
        "lender": {
          "id": "lender_67890",
          "organizationName": "Lagos Investment Partners",
          "rating": 4.8,
          "totalInvestments": 15,
          "averageROI": 22.5
        },
        "offerDetails": {
          "amount": 4500000,
          "interestRate": 18,
          "termMonths": 24,
          "offerType": "loan",
          "conditions": [
            "Monthly financial reporting required",
            "Quarterly business reviews"
          ]
        },
        "status": "pending", // "pending", "accepted", "rejected", "negotiating"
        "submittedAt": "2024-11-12T21:00:00Z",
        "expiresAt": "2024-11-19T21:00:00Z",
        "message": "We're impressed with your business model and growth potential."
      }
    ],
    "summary": {
      "totalOffers": 3,
      "pendingOffers": 2,
      "averageAmount": 4200000,
      "bestRate": 16.5
    }
  }
}
```

#### **POST /api/sme/offers/:offerId/respond**
Respond to investment offer
```json
// Request Body
{
  "action": "negotiate", // "accept", "reject", "negotiate"
  "counterOffer": {
    "amount": 5000000,
    "interestRate": 16,
    "termMonths": 30,
    "additionalTerms": [
      "Grace period of 3 months",
      "Option for early repayment without penalty"
    ]
  },
  "message": "Thank you for your offer. We'd like to negotiate the terms."
}

// Response (200 OK)
{
  "success": true,
  "message": "Response submitted successfully",
  "data": {
    "offerId": "offer_12345",
    "status": "negotiating",
    "updatedAt": "2024-11-12T22:00:00Z",
    "negotiationRound": 1
  }
}
```

---

### 🔒 **5. ESCROW & FUND MANAGEMENT ENDPOINTS**

#### **GET /api/escrow/:loanId**
Get escrow account details
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "escrowId": "escrow_12345",
    "loanId": "loan_12345",
    "totalAmount": 5000000,
    "releasedAmount": 2000000,
    "pendingAmount": 3000000,
    "status": "active",
    "milestones": [
      {
        "id": 1,
        "title": "Initial Working Capital",
        "amount": 2000000,
        "status": "released",
        "releaseDate": "2024-11-01",
        "description": "Initial funds for operational needs",
        "evidence": ["receipt_001.pdf"],
        "feedback": "Funds utilized effectively"
      },
      {
        "id": 2,
        "title": "Inventory Purchase",
        "amount": 1500000,
        "status": "pending_approval",
        "dueDate": "2024-12-15",
        "description": "Purchase of premium inventory",
        "requirements": ["Purchase orders", "Invoices"],
        "submittedEvidence": ["po_001.pdf"]
      }
    ]
  }
}
```

#### **POST /api/escrow/release/:milestoneId**
Release funds for completed milestone
```json
// Request Body
{
  "approvalNotes": "Milestone completed satisfactorily",
  "releaseAmount": 1500000
}

// Response (200 OK)
{
  "success": true,
  "message": "Funds released successfully",
  "data": {
    "milestoneId": 2,
    "releasedAmount": 1500000,
    "releaseDate": "2024-11-12",
    "transactionId": "txn_67890"
  }
}
```

#### **POST /api/escrow/milestones/:milestoneId/evidence**
SME submits evidence for milestone completion
```json
// Request: multipart/form-data
// Fields:
// - files: Evidence documents (PDF/Images)
// - description: Evidence description

// Response (201 Created)
{
  "success": true,
  "message": "Evidence submitted successfully",
  "data": {
    "milestoneId": 2,
    "evidenceFiles": ["evidence_001.pdf", "evidence_002.jpg"],
    "submittedAt": "2024-11-12T10:30:00Z",
    "status": "pending_review"
  }
}
```

---

### 📊 **6. PULSE MONITORING ENDPOINTS**

#### **GET /api/monitoring/:smeId**
Get real-time business monitoring data
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "currentPulseScore": 87,
    "previousPulseScore": 85,
    "trend": "improving",
    "lastUpdated": "2024-11-12T10:30:00Z",
    "businessHealth": {
      "revenue": { "current": 2800000, "previous": 2500000, "trend": "up" },
      "expenses": { "current": 1900000, "previous": 2000000, "trend": "down" },
      "cashFlow": { "current": 900000, "previous": 500000, "trend": "up" },
      "transactions": { "current": 1250, "previous": 1100, "trend": "up" }
    },
    "riskFactors": [
      { "factor": "Payment Delays", "level": "low", "score": 15 },
      { "factor": "Cash Flow Volatility", "level": "medium", "score": 35 }
    ],
    "recentActivities": [
      {
        "id": 1,
        "type": "transaction",
        "description": "Large payment received from major client",
        "amount": 450000,
        "timestamp": "2024-11-12T08:15:00Z",
        "impact": "positive"
      }
    ]
  }
}
```

#### **GET /api/monitoring/:smeId/alerts**
Get active monitoring alerts
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": 1,
        "type": "warning",
        "title": "Unusual Spending Pattern",
        "description": "Higher than normal expenses detected",
        "timestamp": "2024-11-12T09:00:00Z",
        "severity": "medium"
      }
    ]
  }
}
```

#### **GET /api/monitoring/:smeId/pulse-history**
Get historical pulse score data
```json
// Query Parameters:
// ?period=6months&granularity=monthly

// Response (200 OK)
{
  "success": true,
  "data": {
    "history": [
      { "month": "Jul", "score": 78 },
      { "month": "Aug", "score": 82 },
      { "month": "Sep", "score": 79 },
      { "month": "Oct", "score": 85 },
      { "month": "Nov", "score": 87 }
    ]
  }
}
```

---

### 💬 **7. COMMUNICATION & FEEDBACK ENDPOINTS**

#### **POST /api/investments/:investmentId/feedback**
Lender sends feedback to SME
```json
// Request Body
{
  "message": "Great progress on inventory expansion. Keep up the good work!",
  "type": "positive", // "positive", "request", "warning", "general"
  "milestoneId": 1 // optional
}

// Response (201 Created)
{
  "success": true,
  "message": "Feedback sent successfully",
  "data": {
    "feedbackId": "feedback_12345",
    "timestamp": "2024-11-12T14:30:00Z",
    "status": "sent"
  }
}
```

#### **GET /api/investments/:investmentId/feedback**
Get feedback history
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "feedback": [
      {
        "id": 1,
        "message": "Great progress on the inventory expansion",
        "timestamp": "2024-11-10T14:30:00Z",
        "type": "positive",
        "milestoneId": 1,
        "senderType": "lender"
      }
    ]
  }
}
```

---

### 📊 **8. ANALYTICS & REPORTING ENDPOINTS**

#### **GET /api/lender/investments**
Get lender's investment portfolio
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "investments": [
      {
        "id": "inv_12345",
        "smeId": "sme_12345",
        "smeName": "Sade Fashion House",
        "industry": "Fashion",
        "amount": 5000000,
        "currentROI": 22,
        "totalReturns": 1100000,
        "status": "active",
        "startDate": "2024-08-15",
        "remainingMonths": 18,
        "riskLevel": "low",
        "completedMilestones": 2,
        "totalMilestones": 4
      }
    ],
    "summary": {
      "totalInvestments": 3,
      "totalDeployed": 16500000,
      "averageROI": 21.7,
      "totalReturns": 3415000
    }
  }
}
```

#### **GET /api/admin/analytics/overview**
Get platform analytics (Admin only)
```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "userStats": {
      "totalSMEs": 247,
      "totalLenders": 45,
      "verifiedSMEs": 189,
      "activeLenders": 38
    },
    "verificationStats": {
      "averagePulseScore": 78.5,
      "averageProfitScore": 71.2,
      "verificationSuccessRate": 76.5,
      "processingTime": "2.3 hours"
    },
    "marketplaceStats": {
      "totalOffers": 156,
      "successfulMatches": 89,
      "totalFundingAmount": 450000000,
      "averageOfferAmount": 4200000
    },
    "monthlyGrowth": {
      "newSMEs": 23,
      "newLenders": 4,
      "completedDeals": 12,
      "platformRevenue": 2500000
    }
  }
}
```

---

## 🔧 TECHNICAL IMPLEMENTATION REQUIREMENTS

### **1. File Upload Handling**
- **CAC Certificates**: PDF, JPG, PNG (max 10MB)
- **Business Videos**: MP4, WebM (max 100MB, 30-120 seconds)
- **Storage**: AWS S3 or similar cloud storage
- **Processing**: Async processing for AI analysis

### **2. External API Integrations**

#### **CAC Verification Service**
```python
# Backend should implement CAC verification
# Use official CAC API or reliable third-party service
def verify_cac_number(rc_number):
    # Call CAC API
    # Return company details or error
    pass
```

#### **Mono API Integration**
```python
# For bank account verification
MONO_SECRET_KEY = "your_mono_secret_key"
MONO_BASE_URL = "https://api.withmono.com"

def connect_bank_account(mono_code):
    # Exchange code for account details
    # Verify account ownership
    # Return account information
    pass
```

#### **AI Processing (Google Gemini)**
```python
# For document OCR and video analysis
def analyze_cac_document(file_path):
    # Extract text from CAC certificate
    # Verify document authenticity
    # Return extracted data
    pass

def analyze_business_video(video_path):
    # Analyze video content
    # Verify business operations
    # Return analysis results
    pass
```

### **3. Database Schema Requirements**

#### **Users Table**
```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('sme', 'lender') NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **SME Profiles Table**
```sql
CREATE TABLE sme_profiles (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    industry VARCHAR(100),
    year_established INT,
    employee_count INT,
    monthly_revenue DECIMAL(15,2),
    business_address TEXT,
    state VARCHAR(100),
    lga VARCHAR(100),
    business_description TEXT,
    funding_amount DECIMAL(15,2),
    funding_purpose TEXT,
    verification_status ENUM('pending', 'processing', 'verified', 'failed'),
    pulse_score INT,
    profit_score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **Verification Documents Table**
```sql
CREATE TABLE verification_documents (
    id VARCHAR(50) PRIMARY KEY,
    sme_id VARCHAR(50) REFERENCES sme_profiles(id),
    document_type ENUM('cac', 'video', 'bank_statement'),
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT,
    upload_status ENUM('uploaded', 'processing', 'verified', 'failed'),
    verification_result JSON,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **4. Security Requirements**
- **JWT Authentication** with refresh tokens
- **Rate Limiting** on all endpoints
- **File Upload Validation** and virus scanning
- **CORS Configuration** for frontend domain
- **HTTPS Only** in production
- **Input Validation** and sanitization

### **5. Performance Requirements**
- **Response Time**: < 500ms for API calls
- **File Processing**: Async with status updates
- **Database Indexing** on frequently queried fields
- **Caching** for marketplace data
- **CDN** for file delivery

---

## 🚀 DEPLOYMENT REQUIREMENTS

### **Environment Variables**
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pulsefi
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=your_super_secret_jwt_key
JWT_REFRESH_SECRET_KEY=your_refresh_secret_key

# External APIs
MONO_SECRET_KEY=your_mono_secret_key
GEMINI_API_KEY=your_gemini_api_key
CAC_API_KEY=your_cac_api_key

# File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=pulsefi-uploads

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@pulsefi.com
SMTP_PASS=your_email_password
```

### **Docker Configuration**
```dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## 📱 FRONTEND INTEGRATION POINTS

### **API Client Configuration**
```javascript
// src/utils/api.js
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **Key Integration Files**
- `src/auth/hooks/useAuth.js` - Authentication logic
- `src/sme/components/OnboardingWizard.jsx` - Verification flow
- `src/marketplace/hooks/useMarketplace.js` - Marketplace data
- `src/data/demoData.js` - **REMOVE** and replace with API calls

---

## ✅ TESTING REQUIREMENTS

### **API Testing Checklist**
- [ ] All endpoints return correct status codes
- [ ] Authentication works with JWT tokens
- [ ] File uploads handle large files correctly
- [ ] CAC verification returns real data
- [ ] Mono integration works with test accounts
- [ ] AI processing completes within reasonable time
- [ ] Database transactions are atomic
- [ ] Error handling returns meaningful messages

### **Demo Data Requirements**
Create test accounts for demo:
- **SME**: sade@demo.com / password123
- **Lender**: bayo@demo.com / password123
- Pre-populate with realistic business data
- Ensure smooth demo flow completion

---

## 🎯 PRIORITY IMPLEMENTATION ORDER

### **Phase 1: Core Authentication (Day 1)**
1. User registration/login endpoints
2. JWT token management
3. Basic profile endpoints

### **Phase 2: SME Verification Flow (Day 2)**
1. Business profile submission
2. File upload endpoints
3. CAC verification integration
4. Mono bank connection

### **Phase 3: AI Processing Engine (Day 3)**
1. Document OCR processing
2. Video analysis
3. Pulse Score calculation
4. Profit Score generation

### **Phase 4: Marketplace & Offers (Day 4)**
1. Lender marketplace endpoints
2. Investment offer system
3. Negotiation workflow
4. Dashboard analytics

---

## 📞 SUPPORT & COMMUNICATION

### **API Documentation**
- Use **Swagger/OpenAPI** for interactive docs
- Provide **Postman Collection** for testing
- Include **example requests/responses**

### **Error Handling Standards**
```json
// Standard error response format
{
  "success": false,
  "message": "Descriptive error message",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "email": ["This field is required"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

---

## 🏆 SUCCESS METRICS

### **Demo Success Criteria**
- [ ] SME can complete full verification in < 5 minutes
- [ ] Pulse Score generates within 30 seconds
- [ ] Lender can browse and make offers seamlessly
- [ ] All API calls respond within 500ms
- [ ] Zero errors during live demo

### **Technical KPIs**
- **API Uptime**: 99.9%
- **Response Time**: < 500ms average
- **File Processing**: < 2 minutes for videos
- **Verification Success Rate**: > 85%

---

**This README serves as the complete specification for backend implementation. All endpoints, data formats, and integration requirements are clearly defined for seamless frontend-backend integration.**