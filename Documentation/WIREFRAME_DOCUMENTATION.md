# 🎨 **Wireframe Documentation - TummySmiles Food Donation Platform**

## 📋 **Document Information**
- **Project**: TummySmiles - Modern Food Donation Platform
- **Version**: 2.0
- **Date**: January 25, 2025
- **Authors**: Shailendra Shukla & Anisha Dwivedi
- **Document Type**: Wireframe Documentation & UI/UX Specification

---

## 🎯 **1. Design Overview**

### **1.1 Design Philosophy**
TummySmiles follows a modern, user-centric design approach with emphasis on:
- **Glassmorphism Effects**: Beautiful glass-like effects with backdrop blur
- **Gradient Magic**: Eye-catching gradient backgrounds and text effects
- **Interactive Animations**: Smooth hover effects and micro-interactions
- **Mobile-First Design**: Responsive design optimized for all devices
- **Accessibility**: WCAG compliant design for inclusive user experience

### **1.2 Color Palette**
```css
Primary Colors:
- Orange: #f97316 (Warmth and energy)
- Red: #ef4444 (Passion and urgency)
- Yellow: #fbbf24 (Joy and optimism)
- Green: #22c55e (Growth and success)

Neutral Colors:
- Gray-50: #f9fafb (Background)
- Gray-100: #f3f4f6 (Light background)
- Gray-500: #6b7280 (Secondary text)
- Gray-900: #111827 (Primary text)

Gradient Combinations:
- Primary: from-orange-50 to-yellow-50
- Hero: from-orange-500 to-red-500
- Success: from-green-400 to-blue-500
```

### **1.3 Typography System**
```css
Font Family: Inter, system-ui, sans-serif

Heading Scale:
- H1: text-4xl (36px) font-bold
- H2: text-3xl (30px) font-bold
- H3: text-2xl (24px) font-semibold
- H4: text-xl (20px) font-semibold
- H5: text-lg (18px) font-medium

Body Text:
- Large: text-lg (18px)
- Base: text-base (16px)
- Small: text-sm (14px)
- Extra Small: text-xs (12px)
```

---

## 🏠 **2. Public Pages Wireframes**

### **2.1 Homepage Layout**

```
┌─────────────────────────────────────────────────────────────────┐
│                        NAVIGATION BAR                          │
│  [Logo] TummySmiles    [Home] [About] [Contact]    [Login] [Register] │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        HERO SECTION                            │
│                                                                 │
│           🍽️ Transform Extra Food into Smiles 🍽️               │
│                                                                 │
│     Join our community of food donors and help reduce waste    │
│              while feeding those in need                       │
│                                                                 │
│            [Get Started] [Learn More]                          │
│                                                                 │
│              [Particle Animation Background]                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FEATURES SECTION                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │    🍽️       │ │    🚗       │ │    👑       │ │    💳       │ │
│  │ Food        │ │ Real-time   │ │ Admin       │ │ Financial   │ │
│  │ Donations   │ │ Tracking    │ │ Dashboard   │ │ Donations   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    STATISTICS SECTION                          │
│        [Real-time animated counters with icons]                │
│   📊 Donations: 500+  👥 Users: 1000+  🏆 Success: 95%       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       HOW IT WORKS                             │
│  Step 1: Create Account → Step 2: Add Donation → Step 3: Agent │
│        [Visual flow with icons and arrows]                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FOOTER                                  │
│   [Links] [Contact Info] [Social Media] [Legal]               │
└─────────────────────────────────────────────────────────────────┘
```

### **2.2 Authentication Pages**

#### **Login Page Wireframe**
```
┌─────────────────────────────────────────────────────────────────┐
│                     LOGIN PAGE                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                LOGIN FORM                               │   │
│  │                                                         │   │
│  │  🍽️ Welcome Back to TummySmiles                        │   │
│  │                                                         │   │
│  │  Email/Phone: [________________]                        │   │
│  │  Password:    [________________] [👁️]                  │   │
│  │                                                         │   │
│  │  [Remember Me] ☐               [Forgot Password?]      │   │
│  │                                                         │   │
│  │              [Login Button]                            │   │
│  │                                                         │   │
│  │  ────────────── OR ──────────────                      │   │
│  │                                                         │   │
│  │  [Demo Login Options]                                  │   │
│  │  [Donor] [Agent] [Admin]                              │   │
│  │                                                         │   │
│  │  Don't have account? [Sign Up]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│              [Glassmorphism background effect]                  │
└─────────────────────────────────────────────────────────────────┘
```

#### **Registration Page Wireframe**
```
┌─────────────────────────────────────────────────────────────────┐
│                   REGISTRATION PAGE                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                REGISTRATION FORM                        │   │
│  │                                                         │   │
│  │  🍽️ Join TummySmiles Community                         │   │
│  │                                                         │   │
│  │  Name:        [________________]                        │   │
│  │  Phone:       [________________]                        │   │
│  │  Email:       [________________]                        │   │
│  │  Password:    [________________] [👁️]                  │   │
│  │  Confirm:     [________________] [👁️]                  │   │
│  │                                                         │   │
│  │  Role: (●) Donor (○) Agent (○) Admin                  │   │
│  │                                                         │   │
│  │  Pincode:     [______] (if Donor/Agent)               │   │
│  │  Address:     [________________]                        │   │
│  │                                                         │   │
│  │  [Terms & Conditions] ☐                               │   │
│  │                                                         │   │
│  │              [Register Button]                         │   │
│  │                                                         │   │
│  │  Already have account? [Sign In]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 **3. Role-Specific Dashboard Wireframes**

### **3.1 Donor Dashboard**

```
┌─────────────────────────────────────────────────────────────────┐
│                      DONOR DASHBOARD                           │
│                                                                 │
│  [👤 Profile] [🏠 Dashboard] [📝 Donations] [💰 Money] [⚙️ Settings] │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                WELCOME SECTION                          │   │
│  │  👋 Welcome back, [User Name]!                         │   │
│  │  Your impact: [Impact Score] meals delivered          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 STATISTICS CARDS                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ 📊 Total    │ │ ⏳ Pending  │ │ ✅ Completed│       │   │
│  │  │ Donations   │ │ Donations   │ │ Donations   │       │   │
│  │  │     25      │ │     3       │ │     22      │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │                                                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ 💰 Money    │ │ 📍 Locations│ │ 🎯 Success  │       │   │
│  │  │ Donated     │ │ Covered     │ │ Rate        │       │   │
│  │  │   ₹5,000    │ │     8       │ │    95%      │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   QUICK ACTIONS                         │   │
│  │  [➕ Create Food Donation] [💳 Financial Donation]      │   │
│  │  [📱 Track Donations]     [💬 Support Chat]            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                RECENT DONATIONS                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ 🍛 Biryani (50 servings) - Status: Delivered  │   │   │
│  │  │ Agent: John Doe - Date: Jan 20, 2025          │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ 🍞 Bread (100 pieces) - Status: In Transit    │   │   │
│  │  │ Agent: Jane Smith - Date: Jan 22, 2025        │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │  [View All Donations]                              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### **3.2 Agent Dashboard**

```
┌─────────────────────────────────────────────────────────────────┐
│                      AGENT DASHBOARD                           │
│                                                                 │
│  [👤 Profile] [🚗 Dashboard] [📍 Location] [📊 Status] [⚙️ Settings] │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                STATUS TOGGLE                            │   │
│  │  Agent Status: [🟢 Active] [🔴 Inactive]              │   │
│  │  Working Hours: 8.5 hrs today                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 PERFORMANCE METRICS                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ 📦 Today's  │ │ ✅ Total    │ │ ⭐ Rating   │       │   │
│  │  │ Pickups     │ │ Deliveries  │ │ Average     │       │   │
│  │  │     5       │ │    156      │ │   4.8/5     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                ASSIGNED PICKUPS                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ 📍 Pickup #1 - Biryani (50 servings)          │   │   │
│  │  │ Location: 123 Main St, Delhi                   │   │   │
│  │  │ Distance: 2.5 km - ETA: 15 mins               │   │   │
│  │  │ [Accept] [Reject] [Navigate]                   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ 📍 Pickup #2 - Rice & Dal (30 servings)       │   │   │
│  │  │ Location: 456 Park Ave, Delhi                  │   │   │
│  │  │ Distance: 4.2 km - ETA: 25 mins               │   │   │
│  │  │ [Accept] [Reject] [Navigate]                   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  INTERACTIVE MAP                        │   │
│  │  [🗺️ Full-screen map with route optimization]          │   │
│  │  • Current Location (GPS)                              │   │
│  │  • Pickup Points                                       │   │
│  │  • Drop Points                                         │   │
│  │  • Optimized Route                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### **3.3 Admin Dashboard**

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                           │
│                                                                 │
│  [📊 Overview] [🍽️ Donations] [🚗 Agents] [👥 Users] [💰 Finance] │
│  [🎫 Support] [💬 Chat]                                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 PLATFORM OVERVIEW                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ 📊 Total    │ │ 👥 Active   │ │ 💰 Revenue  │       │   │
│  │  │ Donations   │ │ Users       │ │ This Month  │       │   │
│  │  │   1,234     │ │    456      │ │  ₹50,000    │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │                                                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ 🚗 Active   │ │ ✅ Success  │ │ 🎫 Support  │       │   │
│  │  │ Agents      │ │ Rate        │ │ Tickets     │       │   │
│  │  │    28       │ │   95.5%     │ │     12      │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 RECENT ACTIVITIES                       │   │
│  │  • New donation created by John Doe (5 mins ago)       │   │
│  │  • Agent assigned to pickup #1234 (10 mins ago)        │   │
│  │  • Financial donation of ₹500 received (15 mins ago)   │   │
│  │  • Support ticket resolved #TS12345 (20 mins ago)      │   │
│  │  [View All Activities]                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 PENDING ACTIONS                         │   │
│  │  • 5 donations awaiting agent assignment               │   │
│  │  • 3 support tickets require attention                 │   │
│  │  • 2 payment disputes to review                        │   │
│  │  • 1 agent application pending approval                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                ANALYTICS CHARTS                         │   │
│  │  📈 [Monthly donation trends graph]                    │   │
│  │  📊 [User growth chart]                                │   │
│  │  🗺️ [Geographic distribution map]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💰 **4. Payment System Wireframes**

### **4.1 Financial Donation Page**

```
┌─────────────────────────────────────────────────────────────────┐
│                  FINANCIAL DONATION PAGE                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 DONATION FORM                           │   │
│  │                                                         │   │
│  │  💰 Make a Financial Contribution                       │   │
│  │                                                         │   │
│  │  Amount (₹): [________________]                         │   │
│  │  Quick amounts: [₹100] [₹500] [₹1000] [₹2000]        │   │
│  │                                                         │   │
│  │  Donor Details:                                        │   │
│  │  Name:    [________________]                           │   │
│  │  Email:   [________________]                           │   │
│  │  Phone:   [________________]                           │   │
│  │                                                         │   │
│  │  Message: [________________________________]           │   │
│  │           [________________________________]           │   │
│  │                                                         │   │
│  │  [Make Anonymous] ☐                                   │   │
│  │                                                         │   │
│  │  Payment Methods:                                      │   │
│  │  (●) Credit/Debit Card                                │   │
│  │  (○) UPI                                              │   │
│  │  (○) Net Banking                                      │   │
│  │  (○) Wallet                                           │   │
│  │                                                         │   │
│  │              [Donate Now]                             │   │
│  │                                                         │   │
│  │  🔒 Secure payment powered by Razorpay                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 IMPACT PREVIEW                          │   │
│  │  Your ₹500 donation can:                              │   │
│  │  • Feed 10 families for a day                         │   │
│  │  • Support 2 agent trips                              │   │
│  │  • Cover platform maintenance                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### **4.2 Payment Success Page**

```
┌─────────────────────────────────────────────────────────────────┐
│                   PAYMENT SUCCESS PAGE                         │
│                                                                 │
│           ✅ Payment Successful!                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               TRANSACTION DETAILS                       │   │
│  │                                                         │   │
│  │  Transaction ID: RZP_12345678901234                    │   │
│  │  Amount: ₹500                                          │   │
│  │  Date: January 25, 2025                               │   │
│  │  Receipt No: RCP-2025-001                             │   │
│  │                                                         │   │
│  │  Status: ✅ Completed                                  │   │
│  │  Payment Method: UPI                                   │   │
│  │                                                         │   │
│  │  [Download Receipt] [Email Receipt]                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  NEXT STEPS                            │   │
│  │  • Your donation will help feed families in need      │   │
│  │  • You'll receive updates on impact via email         │   │
│  │  • Track your contributions in the dashboard          │   │
│  │                                                         │   │
│  │  [Go to Dashboard] [Make Another Donation]            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💬 **5. Communication System Wireframes**

### **5.1 Chat Interface**

```
┌─────────────────────────────────────────────────────────────────┐
│                       CHAT SYSTEM                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  💬 Support Chat                                [✕]    │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                         │   │
│  │  🤖 System: Welcome to TummySmiles support!           │   │
│  │      How can we help you today?                       │   │
│  │                                               10:30 AM │   │
│  │                                                         │   │
│  │                     👤 You: I need help with my order │   │
│  │                                               10:31 AM │   │
│  │                                                         │   │
│  │  👨‍💼 Agent: Sure! I'd be happy to help.              │   │
│  │      What's your order ID?                            │   │
│  │                                               10:32 AM │   │
│  │                                                         │   │
│  │                        👤 You: It's #DON12345         │   │
│  │                                               10:33 AM │   │
│  │                                                         │   │
│  │  👨‍💼 Agent: I can see your order. Let me check...    │   │
│  │      [🖼️ Screenshot.jpg] ✅                           │   │
│  │                                               10:34 AM │   │
│  │                                                         │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  [Type your message...] [📎] [🎤] [😊] [➤]           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### **5.2 Support Ticket System**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPPORT TICKET FORM                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                CREATE SUPPORT TICKET                   │   │
│  │                                                         │   │
│  │  Name:      [________________]                          │   │
│  │  Email:     [________________]                          │   │
│  │                                                         │   │
│  │  Category:  [▼ Select Category ▼]                     │   │
│  │            • General Inquiry                          │   │
│  │            • Technical Issue                          │   │
│  │            • Donation Related                         │   │
│  │            • Financial Donation Help                  │   │
│  │            • Payment Issues                           │   │
│  │            • Agent/Delivery Issue                     │   │
│  │            • Partnership                              │   │
│  │            • Feedback & Suggestions                   │   │
│  │                                                         │   │
│  │  Priority:  (●) Low (○) Medium (○) High (○) Urgent   │   │
│  │                                                         │   │
│  │  Subject:   [________________________________]         │   │
│  │                                                         │   │
│  │  Message:   [________________________________]         │   │
│  │             [________________________________]         │   │
│  │             [________________________________]         │   │
│  │             [________________________________]         │   │
│  │                                                         │   │
│  │  Attachment: [Choose File] [No file chosen]           │   │
│  │                                                         │   │
│  │              [Submit Ticket]                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                RECENT TICKETS                           │   │
│  │  🎫 #TS12345 - Payment Issue (Open)                   │   │
│  │  🎫 #TS12346 - Delivery Query (Resolved)              │   │
│  │  [View All Tickets]                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 **6. Mobile Responsive Wireframes**

### **6.1 Mobile Navigation**

```
┌─────────────────────────┐
│    MOBILE HEADER        │
│ ☰ TummySmiles    [👤]   │
└─────────────────────────┘

┌─────────────────────────┐
│    SIDE MENU (DRAWER)   │
│                         │
│ 👤 John Doe             │
│    Donor                │
│ ─────────────────────── │
│ 🏠 Dashboard            │
│ 📝 My Donations         │
│ 💰 Financial Donations  │
│ 💬 Support Chat         │
│ ⚙️ Settings             │
│ 🚪 Logout               │
│                         │
└─────────────────────────┘

┌─────────────────────────┐
│  MOBILE DASHBOARD       │
│                         │
│ 👋 Welcome, John!       │
│                         │
│ ┌─────────┐ ┌─────────┐ │
│ │ Total   │ │ Active  │ │
│ │ Donated │ │ Status  │ │
│ │   25    │ │   3     │ │
│ └─────────┘ └─────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Quick Actions       │ │
│ │ [+ New Donation]    │ │
│ │ [💰 Donate Money]   │ │
│ │ [📊 View Stats]     │ │
│ └─────────────────────┘ │
│                         │
│ Recent Activity:        │
│ • Donation delivered   │
│ • Agent assigned       │
│                         │
└─────────────────────────┘
```

### **6.2 Mobile Forms**

```
┌─────────────────────────┐
│   MOBILE DONATION FORM  │
│                         │
│ Create Food Donation    │
│                         │
│ Food Type:              │
│ [________________]      │
│                         │
│ Quantity:               │
│ [________________]      │
│                         │
│ Pickup Address:         │
│ [________________]      │
│ [________________]      │
│                         │
│ 📍 Use Current Location │
│ [□] Add to favorites    │
│                         │
│ Special Instructions:   │
│ [________________]      │
│ [________________]      │
│                         │
│ [Create Donation]       │
│                         │
└─────────────────────────┘

┌─────────────────────────┐
│   MOBILE PAYMENT        │
│                         │
│ 💰 Financial Donation   │
│                         │
│ Amount: ₹ [_____]       │
│                         │
│ Quick Select:           │
│ [₹100][₹500][₹1000]    │
│                         │
│ Your Details:           │
│ Name: [______________]  │
│ Email:[______________]  │
│ Phone:[______________]  │
│                         │
│ Message (Optional):     │
│ [________________]      │
│                         │
│ [Make Anonymous] ☐      │
│                         │
│ [Proceed to Payment]    │
│                         │
└─────────────────────────┘
```

---

## 🎨 **7. UI Component Library**

### **7.1 Button Components**

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
}

/* Secondary Button */
.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #374151;
  padding: 10px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* Icon Button */
.btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### **7.2 Card Components**

```css
/* Glassmorphism Card */
.card-glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

/* Statistics Card */
.card-stats {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #f97316;
  transition: transform 0.3s ease;
}

.card-stats:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* Dashboard Card */
.card-dashboard {
  background: linear-gradient(135deg, #fff 0%, #f9fafb 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}
```

### **7.3 Form Components**

```css
/* Input Field */
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  outline: none;
}

/* Select Dropdown */
.select-field {
  appearance: none;
  background-image: url("data:image/svg+xml...");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

/* Checkbox/Radio */
.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
}

.checkbox-custom:checked {
  background: #f97316;
  border-color: #f97316;
}
```

---

## 🔄 **8. User Flow Diagrams**

### **8.1 Food Donation Flow**

```
Start
  ↓
Login/Register
  ↓
Dashboard
  ↓
Create Donation
  ├── Food Type
  ├── Quantity  
  ├── Location
  └── Submit
  ↓
Admin Review
  ↓
Agent Assignment
  ↓
Agent Accepts
  ↓
Food Collection
  ↓
Delivery
  ↓
Status Update
  ↓
Completion
```

### **8.2 Payment Flow**

```
Start
  ↓
Select Donation Amount
  ↓
Enter Donor Details
  ↓
Choose Payment Method
  ↓
Razorpay Gateway
  ↓
Payment Processing
  ├── Success → Receipt
  └── Failed → Retry
  ↓
Database Update
  ↓
Confirmation Email
  ↓
Dashboard Update
```

### **8.3 Support Flow**

```
User Issue
  ↓
Chat Widget OR Ticket Form
  ↓
Category Selection
  ↓
Details Submission
  ↓
Ticket Creation
  ↓
Admin Assignment
  ↓
Resolution Process
  ↓
Status Updates
  ↓
Issue Resolved
  ↓
Feedback Collection
```

---

## 📐 **9. Responsive Design Specifications**

### **9.1 Breakpoint Strategy**

```css
/* Mobile First Approach */
/* Base styles: Mobile (0px and up) */
.container {
  padding: 16px;
  max-width: 100%;
}

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 768px;
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Large Desktop (1280px and up) */
@media (min-width: 1280px) {
  .container {
    max-width: 1400px;
  }
}
```

### **9.2 Grid System**

```css
/* CSS Grid Layout */
.dashboard-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Flexbox for components */
.flex-responsive {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .flex-responsive {
    flex-direction: row;
    align-items: center;
  }
}
```

---

## ✨ **10. Animation & Interaction Specifications**

### **10.1 Micro-interactions**

```css
/* Button Hover Effects */
.btn-interactive {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Card Hover Effects */
.card-interactive {
  transition: all 0.3s ease;
}

.card-interactive:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Loading States */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Page Transitions */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease-in;
}
```

### **10.2 Particle Background Animation**

```javascript
// Particle system configuration
const particleConfig = {
  particles: {
    number: { value: 80 },
    color: { value: "#f97316" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
      straight: false,
      bounce: false
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" }
    }
  }
};
```

---

<div align="center">

### 🎨 **Wireframe Documentation Complete** 🎨

**Modern • Responsive • User-Centric Design**

*Comprehensive UI/UX specifications for exceptional user experience*

</div>

---

*Document Version: 2.0 | Last Updated: January 25, 2025*
