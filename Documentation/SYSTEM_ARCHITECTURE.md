# 🏛️ **System Architecture - TummySmiles Food Donation Platform**

## 📋 **Document Information**
- **Project**: TummySmiles - Modern Food Donation Platform
- **Version**: 2.0
- **Date**: January 25, 2025
- **Authors**: Shailendra Shukla & Anisha Dwivedi
- **Document Type**: System Architecture Document

---

## 🎯 **1. Architecture Overview**

### **1.1 System Purpose**
TummySmiles is a comprehensive food donation platform designed to bridge the gap between food donors and those in need. The system facilitates efficient food collection, distribution, and financial donations through a modern, scalable, and secure architecture.

### **1.2 Architectural Principles**
- **Modularity**: Clear separation of concerns with distinct layers
- **Scalability**: Horizontal and vertical scaling capabilities
- **Security**: Multi-layered security approach
- **Performance**: Optimized for real-time operations
- **Maintainability**: Clean code architecture with comprehensive documentation
- **Reliability**: High availability with robust error handling

---

## 🏗️ **2. System Architecture Layers**

### **2.1 Three-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React.js Single Page Application (SPA)                │   │
│  │  ├── Component-Based Architecture                      │   │
│  │  ├── Context API for State Management                  │   │
│  │  ├── React Router for Navigation                       │   │
│  │  ├── Responsive UI with Tailwind CSS                   │   │
│  │  └── Real-time Updates with Socket.IO                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                            HTTPS/WebSocket
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Node.js/Express.js RESTful API Server                 │   │
│  │  ├── Authentication & Authorization                    │   │
│  │  ├── Business Logic Controllers                        │   │
│  │  ├── Real-time Communication (Socket.IO)               │   │
│  │  ├── External Service Integration                      │   │
│  │  ├── File Upload & Processing                          │   │
│  │  └── Error Handling & Logging                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                           MongoDB Driver
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MongoDB NoSQL Database                                 │   │
│  │  ├── Document-Based Collections                        │   │
│  │  ├── Optimized Indexes                                 │   │
│  │  ├── Aggregation Pipelines                             │   │
│  │  ├── Geospatial Queries                                │   │
│  │  └── Transaction Support                               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 **3. Client-Server Architecture**

### **3.1 Frontend Architecture (React SPA)**

```
React Application Architecture
├── Public Layer
│   ├── Static Assets (Images, Icons, Favicons)
│   └── Index.html Template
├── Source Layer
│   ├── Components
│   │   ├── Common Components (Navbar, Footer, ParticleBackground)
│   │   ├── UI Components (Buttons, Cards, Modals)
│   │   ├── Role-Specific Components
│   │   │   ├── Donor Components
│   │   │   ├── Agent Components
│   │   │   └── Admin Components
│   │   └── Feature Components (Chat, Payment, Maps)
│   ├── Pages
│   │   ├── Public Pages (Home, About, Contact)
│   │   ├── Authentication Pages (Login, Register)
│   │   └── Dashboard Pages (Role-Specific)
│   ├── Context Providers
│   │   ├── AuthContext (Authentication State)
│   │   ├── ChatContext (Real-time Communication)
│   │   └── Theme Context (UI State)
│   ├── Services
│   │   ├── API Service (HTTP Client)
│   │   ├── Socket Service (Real-time)
│   │   └── Utility Services
│   └── Assets
│       ├── Styles (CSS, Tailwind Config)
│       ├── Images
│       └── Icons
└── Build Layer
    ├── Webpack Configuration
    ├── Environment Variables
    └── Optimization Settings
```

### **3.2 Backend Architecture (Node.js/Express)**

```
Node.js API Server Architecture
├── Entry Point
│   ├── index.js (Server Initialization)
│   ├── Database Connection
│   └── Middleware Setup
├── Routes Layer
│   ├── Authentication Routes (/api/auth)
│   ├── Donor Routes (/api/donor)
│   ├── Agent Routes (/api/agent)
│   ├── Admin Routes (/api/admin)
│   ├── Payment Routes (/api/payment)
│   ├── Support Routes (/api/support)
│   ├── Chat Routes (/api/chat)
│   └── Webhook Routes (/api/webhook)
├── Controllers Layer
│   ├── Authentication Controller
│   ├── Donor Controller
│   ├── Agent Controller
│   ├── Admin Controller
│   ├── Payment Controller
│   ├── Support Controller
│   ├── Chat Controller
│   └── Webhook Controller
├── Models Layer
│   ├── User Model (Mongoose Schema)
│   ├── Donation Model
│   ├── MoneyDonation Model
│   ├── SupportTicket Model
│   └── Chat Model
├── Middleware Layer
│   ├── Authentication Middleware
│   ├── Authorization Middleware
│   ├── Validation Middleware
│   ├── Error Handling Middleware
│   └── Logging Middleware
├── Services Layer
│   ├── Payment Service (Razorpay Integration)
│   ├── Email Service (SMTP)
│   ├── File Upload Service
│   └── Notification Service
└── Utilities Layer
    ├── Distance Calculator
    ├── Receipt Generator
    ├── Data Validators
    └── Helper Functions
```

---

## 🔌 **4. Microservices Architecture Pattern**

### **4.1 Current Monolithic Structure**
The system is currently implemented as a modular monolith, which provides:
- **Simplified Deployment**: Single application deployment
- **Easy Development**: Unified codebase
- **Cost Effective**: Lower infrastructure costs
- **Quick Iteration**: Faster development cycles

### **4.2 Future Microservices Migration Path**

```
Future Microservices Architecture
├── API Gateway
│   ├── Request Routing
│   ├── Authentication
│   ├── Rate Limiting
│   └── Load Balancing
├── Core Services
│   ├── User Service
│   │   ├── User Management
│   │   ├── Authentication
│   │   └── Profile Management
│   ├── Donation Service
│   │   ├── Food Donation CRUD
│   │   ├── Status Management
│   │   └── Location Tracking
│   ├── Payment Service
│   │   ├── Financial Donations
│   │   ├── Payment Processing
│   │   └── Transaction Management
│   ├── Communication Service
│   │   ├── Chat System
│   │   ├── Real-time Notifications
│   │   └── Email Services
│   └── Analytics Service
│       ├── Data Processing
│       ├── Reporting
│       └── Insights Generation
├── Infrastructure Services
│   ├── File Storage Service
│   ├── Logging Service
│   ├── Monitoring Service
│   └── Configuration Service
└── Data Layer
    ├── User Database
    ├── Donation Database
    ├── Payment Database
    ├── Communication Database
    └── Analytics Database
```

---

## 🔄 **5. Data Flow Architecture**

### **5.1 Request-Response Flow**

```
User Request Flow
┌─────────────┐    HTTPS    ┌─────────────┐    Process    ┌─────────────┐
│   Client    │ ──────────> │   Server    │ ──────────> │  Database   │
│ (React SPA) │             │ (Express)   │             │ (MongoDB)   │
└─────────────┘ <────────── └─────────────┘ <────────── └─────────────┘
                  Response              Query Result

Detailed Flow:
1. User initiates action in React component
2. API service sends HTTP request to Express server
3. Server validates authentication and authorization
4. Controller processes business logic
5. Model interacts with MongoDB database
6. Response travels back through the layers
7. React component updates UI with response data
```

### **5.2 Real-time Communication Flow**

```
WebSocket Communication Flow
┌─────────────┐ WebSocket ┌─────────────┐  Database  ┌─────────────┐
│   Client    │ <──────> │   Server    │ <────────> │  Database   │
│ (Socket.IO) │          │ (Socket.IO) │            │ (MongoDB)   │
└─────────────┘          └─────────────┘            └─────────────┘
      │                         │
      │      Real-time Event    │
      └─────────────────────────┘

Real-time Events:
1. Chat messages
2. Donation status updates
3. Agent location updates
4. Payment confirmations
5. Admin notifications
```

### **5.3 Payment Processing Flow**

```
Payment Integration Flow
┌────────────┐   Create    ┌────────────┐   Order    ┌────────────┐
│   Client   │ ─────────> │   Server   │ ────────> │  Razorpay  │
│ (Payment)  │            │ (Payment   │           │ (Gateway)  │
│            │            │  Service)  │           │            │
└────────────┘            └────────────┘           └────────────┘
      │                          │                        │
      │        Payment UI        │      Webhook Event     │
      └──────────────────────────┼────────────────────────┘
                                 │
                         ┌───────▼────────┐
                         │   Verification  │
                         │   & Database   │
                         │     Update     │
                         └────────────────┘

Payment Steps:
1. User initiates payment
2. Server creates Razorpay order
3. Client shows payment interface
4. Payment processing at Razorpay
5. Webhook notification to server
6. Payment verification
7. Database status update
8. Confirmation to user
```

---

## 🗄️ **6. Database Architecture**

### **6.1 MongoDB Document Structure**

```
MongoDB Collections Architecture
├── Users Collection
│   ├── Donor Documents
│   ├── Agent Documents
│   └── Admin Documents
├── Donations Collection
│   ├── Food Donation Documents
│   ├── Status Tracking
│   └── Location Data
├── MoneyDonations Collection
│   ├── Payment Information
│   ├── Transaction History
│   └── Receipt Management
├── SupportTickets Collection
│   ├── Ticket Management
│   ├── Category Classification
│   └── Resolution Tracking
└── Chats Collection
    ├── Conversation Management
    ├── Message History
    └── Participant Tracking
```

### **6.2 Data Relationships**

```
Entity Relationship Model
┌─────────────┐    creates    ┌─────────────┐
│    User     │ ────────────> │  Donation   │
│  (Donor)    │               │   (Food)    │
└─────────────┘               └─────────────┘
      │                              │
      │ creates                      │ assigned_to
      ▼                              ▼
┌─────────────┐               ┌─────────────┐
│MoneyDonation│               │    User     │
│ (Financial) │               │  (Agent)    │
└─────────────┘               └─────────────┘
      │                              │
      │ support_for                  │ manages
      ▼                              ▼
┌─────────────┐               ┌─────────────┐
│SupportTicket│               │    User     │
│             │               │  (Admin)    │
└─────────────┘               └─────────────┘
      │                              │
      │ chat_about                   │ participates
      ▼                              ▼
┌─────────────┐               ┌─────────────┐
│    Chat     │ ◀──────────── │   Message   │
│             │   contains    │             │
└─────────────┘               └─────────────┘
```

### **6.3 Indexing Strategy**

```javascript
// Performance-Critical Indexes
Users Collection:
- { phone: 1 } (unique) - Authentication
- { email: 1 } (unique, sparse) - Alternative auth
- { role: 1 } - Role-based queries
- { agentStatus: 1 } - Active agent lookup
- { location: '2dsphere' } - Geospatial queries

Donations Collection:
- { donor: 1 } - User's donations
- { agent: 1 } - Agent assignments
- { status: 1 } - Status filtering
- { createdAt: -1 } - Chronological sorting
- { pickupLocation: '2dsphere' } - Location-based queries

MoneyDonations Collection:
- { donor: 1 } - User's financial donations
- { paymentStatus: 1 } - Payment filtering
- { createdAt: -1 } - Recent donations
- { razorpayOrderId: 1 } - Payment lookup

SupportTickets Collection:
- { ticketId: 1 } (unique) - Ticket tracking
- { status: 1 } - Status filtering
- { category: 1 } - Category-based routing
- { createdAt: -1 } - Recent tickets

Chats Collection:
- { chatId: 1 } (unique) - Chat identification
- { 'participants.userId': 1 } - User participation
- { status: 1 } - Active chat filtering
- { lastActivity: -1 } - Recent activity
```

---

## 🔒 **7. Security Architecture**

### **7.1 Authentication & Authorization Layer**

```
Security Layer Architecture
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  JWT Token Management                                           │
│  ├── Token Generation (Login)                                  │
│  ├── Token Validation (Middleware)                             │
│  ├── Token Expiration (Security)                               │
│  └── Refresh Token Mechanism                                   │
└─────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Role-Based Access Control (RBAC)                              │
│  ├── Donor Permissions                                         │
│  ├── Agent Permissions                                         │
│  ├── Admin Permissions                                         │
│  └── Route Protection                                          │
└─────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                      DATA SECURITY LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Input Validation & Sanitization                               │
│  ├── Request Validation                                        │
│  ├── SQL/NoSQL Injection Prevention                            │
│  ├── XSS Protection                                            │
│  └── CSRF Protection                                           │
└─────────────────────────────────────────────────────────────────┘
```

### **7.2 Payment Security Architecture**

```
Payment Security Flow
┌─────────────┐  HTTPS   ┌─────────────┐  Encrypted  ┌─────────────┐
│   Client    │ ──────> │   Server    │ ─────────> │  Razorpay   │
│             │         │             │            │  Gateway    │
└─────────────┘         └─────────────┘            └─────────────┘
                               │                           │
                               │ Signature                 │
                               │ Verification              │
                               ▼                           │
                        ┌─────────────┐                   │
                        │  Database   │ ◀─────────────────┘
                        │   Update    │    Webhook
                        └─────────────┘   Notification

Security Measures:
1. HTTPS encryption for all communications
2. Payment data never stored on our servers
3. Razorpay signature verification
4. Webhook signature validation
5. Environment variable protection
6. PCI DSS compliance through Razorpay
```

---

## 🚀 **8. Deployment Architecture**

### **8.1 Current Deployment Strategy**

```
Production Deployment Architecture
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND TIER                           │
├─────────────────────────────────────────────────────────────────┤
│  Vercel Hosting                                                 │
│  ├── Global CDN Distribution                                   │
│  ├── Automatic HTTPS                                           │
│  ├── Git-based Deployment                                      │
│  ├── Environment Variables                                     │
│  └── Performance Optimization                                  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                              Internet
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND TIER                            │
├─────────────────────────────────────────────────────────────────┤
│  Render/Railway Hosting                                         │
│  ├── Auto-scaling Capabilities                                 │
│  ├── Health Monitoring                                         │
│  ├── Automatic Deployments                                     │
│  ├── Environment Management                                    │
│  └── Load Balancing                                            │
└─────────────────────────────────────────────────────────────────┘
                                  │
                            Database Connection
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE TIER                           │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB Atlas                                                  │
│  ├── Managed Database Service                                  │
│  ├── Automatic Backups                                         │
│  ├── Replica Sets                                              │
│  ├── Security Features                                         │
│  └── Performance Monitoring                                    │
└─────────────────────────────────────────────────────────────────┘
```

### **8.2 Environment Management**

```
Environment Configuration
├── Development Environment
│   ├── Local MongoDB Instance
│   ├── Test Razorpay Keys
│   ├── Development SMTP
│   └── Debug Logging
├── Staging Environment
│   ├── MongoDB Atlas (Test Cluster)
│   ├── Razorpay Test Mode
│   ├── Production-like Config
│   └── Integration Testing
└── Production Environment
    ├── MongoDB Atlas (Production Cluster)
    ├── Razorpay Live Keys
    ├── Production SMTP
    ├── Error Monitoring
    └── Performance Tracking
```

---

## 📊 **9. Performance Architecture**

### **9.1 Frontend Performance**

```
Frontend Optimization Strategy
├── Build Optimization
│   ├── Code Splitting (React.lazy)
│   ├── Bundle Optimization (Webpack)
│   ├── Asset Compression (Gzip)
│   └── Tree Shaking
├── Runtime Optimization
│   ├── Component Memoization (React.memo)
│   ├── State Management (Context API)
│   ├── Virtual DOM Optimization
│   └── Lazy Loading
├── Network Optimization
│   ├── CDN Asset Delivery
│   ├── HTTP/2 Support
│   ├── Image Optimization
│   └── Caching Strategy
└── User Experience
    ├── Progressive Loading
    ├── Skeleton Screens
    ├── Error Boundaries
    └── Offline Support
```

### **9.2 Backend Performance**

```
Backend Optimization Strategy
├── Database Optimization
│   ├── Index Optimization
│   ├── Query Optimization
│   ├── Connection Pooling
│   └── Aggregation Pipelines
├── API Optimization
│   ├── Response Compression
│   ├── Pagination
│   ├── Rate Limiting
│   └── Async Processing
├── Caching Strategy
│   ├── In-Memory Caching
│   ├── Database Query Caching
│   ├── API Response Caching
│   └── Static Asset Caching
└── Monitoring & Logging
    ├── Performance Metrics
    ├── Error Tracking
    ├── Resource Monitoring
    └── User Analytics
```

---

## 🔄 **10. Integration Architecture**

### **10.1 External Service Integration**

```
External Services Integration
├── Payment Gateway (Razorpay)
│   ├── Order Creation API
│   ├── Payment Verification API
│   ├── Webhook Integration
│   ├── Refund Processing
│   └── Transaction Analytics
├── Map Services (Leaflet)
│   ├── Location Display
│   ├── Route Calculation
│   ├── Distance Calculation
│   └── Geospatial Queries
├── Email Services (SMTP)
│   ├── Support Notifications
│   ├── Payment Confirmations
│   ├── System Alerts
│   └── User Communications
└── File Storage
    ├── Chat Media Storage
    ├── Profile Pictures
    ├── Document Uploads
    └── System Assets
```

### **10.2 API Integration Patterns**

```
API Integration Patterns
├── RESTful API Design
│   ├── Resource-Based URLs
│   ├── HTTP Method Semantics
│   ├── Status Code Standards
│   └── JSON Response Format
├── Real-time Integration
│   ├── WebSocket Connections
│   ├── Event-Driven Updates
│   ├── Bi-directional Communication
│   └── Connection Management
├── Webhook Integration
│   ├── Payment Webhooks
│   ├── Signature Verification
│   ├── Retry Mechanisms
│   └── Event Processing
└── Error Handling
    ├── Graceful Degradation
    ├── Fallback Mechanisms
    ├── Circuit Breaker Pattern
    └── Timeout Management
```

---

## 📈 **11. Scalability Architecture**

### **11.1 Horizontal Scaling Strategy**

```
Horizontal Scaling Architecture
├── Application Layer Scaling
│   ├── Load Balancer Distribution
│   ├── Multiple Server Instances
│   ├── Stateless Design
│   └── Session Management
├── Database Layer Scaling
│   ├── Read Replicas
│   ├── Sharding Strategy
│   ├── Connection Pooling
│   └── Query Optimization
├── CDN and Caching
│   ├── Global Content Distribution
│   ├── Edge Caching
│   ├── Browser Caching
│   └── API Response Caching
└── Microservices Transition
    ├── Service Decomposition
    ├── API Gateway
    ├── Inter-service Communication
    └── Service Discovery
```

### **11.2 Vertical Scaling Strategy**

```
Vertical Scaling Optimization
├── Server Resources
│   ├── CPU Optimization
│   ├── Memory Management
│   ├── Storage Performance
│   └── Network Bandwidth
├── Database Performance
│   ├── Index Optimization
│   ├── Query Performance
│   ├── Connection Limits
│   └── Memory Allocation
├── Application Optimization
│   ├── Code Efficiency
│   ├── Memory Usage
│   ├── CPU Utilization
│   └── I/O Operations
└── Monitoring & Alerts
    ├── Resource Utilization
    ├── Performance Metrics
    ├── Threshold Alerts
    └── Capacity Planning
```

---

## 🔍 **12. Monitoring & Observability**

### **12.1 System Monitoring Architecture**

```
Monitoring & Observability Stack
├── Application Monitoring
│   ├── Error Tracking
│   ├── Performance Metrics
│   ├── User Analytics
│   └── Business Metrics
├── Infrastructure Monitoring
│   ├── Server Health
│   ├── Database Performance
│   ├── Network Monitoring
│   └── Resource Utilization
├── Log Management
│   ├── Centralized Logging
│   ├── Log Aggregation
│   ├── Search & Analysis
│   └── Alert Generation
└── Real-time Dashboards
    ├── System Status
    ├── Performance KPIs
    ├── Business Metrics
    └── Alert Management
```

---

## 🚀 **13. Future Architecture Evolution**

### **13.1 Technology Roadmap**

```
Future Architecture Evolution
├── Microservices Migration
│   ├── Service Decomposition
│   ├── API Gateway Implementation
│   ├── Service Mesh Integration
│   └── Container Orchestration
├── Cloud-Native Architecture
│   ├── Kubernetes Deployment
│   ├── Serverless Functions
│   ├── Managed Services
│   └── Auto-scaling
├── Advanced Features
│   ├── Machine Learning Integration
│   ├── AI-Powered Matching
│   ├── Predictive Analytics
│   └── Blockchain Integration
└── Mobile Platform
    ├── React Native App
    ├── Push Notifications
    ├── Offline Capabilities
    └── Native Features
```

---

<div align="center">

### 🏛️ **System Architecture Complete** 🏛️

**Scalable • Secure • Maintainable • Future-Ready**

*Comprehensive architectural foundation for enterprise-grade platform*

</div>

---

*Document Version: 2.0 | Last Updated: January 25, 2025*
