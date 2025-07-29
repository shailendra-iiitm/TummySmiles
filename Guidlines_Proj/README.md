# 🍽️ **Tummy Smiles** - Modern Food Donation Platform

> Transform your extra food into someone's happiness with our beautiful, modern, and interactive food donation platform! 

![Tummy Smiles](https://img.shields.io/badge/Status-✨%20Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)

---

## 🌟 **What Makes Tummy Smiles Special?**

TummySmiles isn't just another food donation platform - it's a **modern, beautiful, and interactive experience** that makes sharing food as delightful as receiving it! ✨

### 🎨 **Modern UI/UX Features**
- **Glassmorphism Design** - Beautiful glass-like effects with backdrop blur
- **Interactive Animations** - Smooth hover effects, floating elements, and micro-interactions
- **Particle Background** - Dynamic animated particles that respond to user interaction
- **Gradient Magic** - Eye-catching gradient backgrounds and text effects
- **Mobile-First Design** - Perfectly responsive across all devices
- **Real-time Stats** - Live animated counters and progress bars

### 🚀 **Enhanced User Experience**
- **Role-Based Dashboards** - Personalized experiences for donors, agents, and admins
- **Quick Demo Login** - One-click demo access for testing
- **Toast Notifications** - Beautiful real-time feedback system
- **Loading States** - Smooth loading animations and skeleton screens
- **Progress Tracking** - Visual progress indicators and impact scores

---

## 👥 **User Roles & Dashboards**

### 🍽️ **Donor Dashboard**
- **Modern Stats Cards** - Animated progress bars and impact metrics
- **Quick Actions** - One-click donation creation and management
- **Visual Status Tracking** - Color-coded donation status with icons
- **Impact Score** - Gamified contribution tracking

### 🚗 **Agent Dashboard**
- **Interactive Map** - Real-time location tracking with route optimization
- **Pickup Management** - Streamlined accept/reject workflow
- **Status Updates** - Quick action buttons for delivery status
- **Performance Metrics** - Track deliveries and success rates

### 👑 **Admin Dashboard**
- **Tabbed Interface** - Clean organization of different admin functions
- **Agent Assignment** - Smart distance-based agent suggestions
- **Analytics Overview** - Real-time platform statistics and trends
- **User Management** - Complete user control panel with blocking/unblocking
- **Chat Management** - Monitor and participate in user support chats
- **Support Tickets** - Comprehensive ticket management system
- **Donation Oversight** - Complete platform donation monitoring

---

## 🛠️ **Tech Stack**

### **Frontend Arsenal**
- **React 18** - Latest React with hooks and modern patterns
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Seamless navigation and routing
- **Axios** - Promise-based HTTP client
- **React Hot Toast** - Beautiful toast notifications
- **Leaflet** - Interactive maps and location services

### **Backend Power**
- **Node.js & Express** - Fast and scalable server
- **MongoDB & Mongoose** - NoSQL database with elegant ODM
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing and security
- **Socket.io** - Real-time communication and chat
- **Multer** - File upload handling for media
- **Nodemailer** - Email service integration
- **CORS** - Cross-origin resource sharing

### **Modern Development**
- **Vite** - Lightning-fast build tool
- **ESLint** - Code quality and consistency
- **Hot Module Replacement** - Instant development feedback
- **Environment Variables** - Secure configuration management

---

## 🎯 **Key Features**

### ✅ **Authentication & Security**
- JWT-based secure authentication
- Role-based access control
- Password hashing with bcrypt
- Protected routes and middleware

### ✅ **Donation Management**
- Create donations with geo-location
- Real-time status tracking
- Photo uploads and descriptions
- Quantity and expiry management

### ✅ **Agent Operations**
- GPS-based location updates
- Route optimization
- Pickup confirmation system
- Delivery status reporting

### ✅ **Admin Control**
- Complete platform oversight
- Agent assignment and management
- User blocking/unblocking
- Analytics and reporting

### ✅ **Real-time Features**
- Live location tracking
- Instant notifications
- Status updates
- Interactive maps

### ✅ **Communication System**
- Real-time chat with Socket.io
- Multi-user support conversations
- Media sharing (voice, images, files)
- Admin chat management interface
- Online status indicators

### ✅ **Support Ticket System**
- Comprehensive ticket creation form
- Multi-status workflow management
- Email notifications for status updates
- Priority system (low, medium, high, urgent)
- Public ticket tracking with ID
- Admin ticket management dashboard

### ✅ **Email Integration**
- Automated welcome emails
- Ticket confirmation notifications
- Status update alerts
- Professional HTML email templates
- Email error handling and fallbacks

### ✅ **Advanced Analytics**
- Platform performance metrics
- Agent productivity tracking
- Monthly trend analysis
- Food type popularity statistics
- User engagement analytics
- Impact scoring and gamification

---

## 🚀 **Quick Start Guide**

### **Option 1: Easy Start (Recommended)**
```bash
# Clone the repository
git clone https://github.com/shailendra-iiitm/TummySmiles.git
cd TummySmiles

# Run the magic startup script
./start-dev.bat
```

### **Option 2: Manual Setup**
```bash
# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup (in new terminal)
cd frontend
npm install
npm run dev
```

---

## 🌐 **Access Points**

- **🎨 Frontend**: http://localhost:5173
- **🔧 Backend**: http://localhost:5000
- **📊 MongoDB**: Your MongoDB connection string

---

## 🎮 **Demo Access**

### **Quick Login Options**
- **👤 Donor**: Phone: `1234567890`, Password: `password123`
- **🚗 Agent**: Phone: `0987654321`, Password: `password123`
- **👑 Admin**: Phone: `5555555555`, Password: `password123`

---

## 📱 **Mobile Experience**

TummySmiles is designed **mobile-first** with:
- **Touch-friendly interfaces** - Optimized for mobile interaction
- **Responsive design** - Perfect on all screen sizes
- **Fast loading** - Optimized for mobile networks
- **Offline capabilities** - Works even with poor connectivity

---

## 🎨 **Visual Highlights**

### **🌈 Color Palette**
- **Primary Orange**: `#f97316` - Warmth and energy
- **Secondary Red**: `#ef4444` - Passion and urgency
- **Accent Yellow**: `#fbbf24` - Joy and optimism
- **Success Green**: `#22c55e` - Growth and success

### **✨ Animations**
- **Smooth transitions** - All interactions have smooth 300ms transitions
- **Hover effects** - Cards lift and glow on hover
- **Loading states** - Beautiful skeleton screens and spinners
- **Particle system** - Dynamic background particles

---

## 🏗️ **Project Structure**

```
TummySmiles/
├── 📁 backend/
│   ├── 🔧 controllers/     # Business logic
│   │   ├── adminController.js
│   │   ├── agentController.js
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── donorController.js
│   │   └── supportController.js
│   ├── 🗃️ models/          # Database schemas
│   │   ├── User.js
│   │   ├── Donations.js
│   │   ├── Chat.js
│   │   └── SupportTicket.js
│   ├── 🛣️ routes/          # API endpoints
│   │   ├── authRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── agentRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── chatRoutes.js
│   │   └── supportRoutes.js
│   ├── 🛡️ middlewares/     # Auth & validation
│   │   ├── authenticate.js
│   │   ├── authMiddleware.js
│   │   └── verifyeRole.js
│   ├── � utils/           # Utility functions
│   │   ├── distanceCalculator.js
│   │   └── emailService.js
│   ├── 📁 uploads/         # File storage
│   │   └── chat-media/
│   └── �🚀 index.js         # Server entry point
├── 📁 frontend/
│   ├── 🎨 components/      # Reusable UI components
│   │   ├── ChatWidget.jsx
│   │   ├── Navbar.jsx
│   │   ├── ParticleBackground.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── admin/
│   │   ├── common/
│   │   └── ui/
│   ├── 📄 pages/           # Route components
│   │   ├── donor/
│   │   ├── agent/
│   │   ├── admin/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Login.jsx
│   ├── 🔄 contexts/        # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── AuthProvider.jsx
│   ├── 🎯 services/        # API calls
│   │   └── api.jsx
│   └── 📱 App.jsx          # Main app component
├── 📚 Guidlines_Proj/      # Documentation
└── 📚 README.md            # This comprehensive document
```

---

## 💬 **Real-time Communication System**

### **🔄 Socket.io Integration**
- **Real-time Messaging** - Instant chat between users and support
- **Multi-user Support** - Admins can join any user conversation
- **Connection Management** - Automatic reconnection and status tracking
- **Message Broadcasting** - Real-time message delivery to all participants

### **📱 Chat Features**
- **Media Sharing** - Voice messages, images, and file uploads
- **Typing Indicators** - Live typing status display
- **Online Presence** - Real-time user online/offline status
- **Chat History** - Persistent message storage and retrieval
- **Admin Notifications** - Instant alerts for new user messages

### **🎛️ Admin Chat Management**
- **Chat Overview** - Monitor all active conversations
- **Status Management** - Mark chats as active, resolved, or closed
- **Chat Assignment** - Assign specific chats to support agents
- **Message Interface** - Send messages as admin with proper identification
- **Chat Analytics** - Track response times and resolution rates

---

## 🎫 **Advanced Support System**

### **📋 Support Ticket Creation**
- **Comprehensive Form** - Name, email, subject, category, priority
- **Category System** - General, Technical, Donation, Agent, Partnership, Feedback
- **Priority Levels** - Low, Medium, High, Urgent classification
- **Auto-ID Generation** - Unique ticket IDs for easy tracking

### **🔄 Ticket Workflow Management**
- **Multi-status System** - Open → In Progress → Under Review → Resolved → Closed
- **Admin Assignment** - Assign tickets to specific support staff
- **Response System** - Add responses with admin identification
- **Comment System** - Internal admin comments for ticket management

### **📧 Email Notification System**
- **Ticket Confirmation** - Automatic email with ticket ID upon creation
- **Status Updates** - Email notifications for every status change
- **Professional Templates** - Branded HTML email templates
- **Public Tracking** - Track ticket status without login using ticket ID

### **📊 Support Analytics**
- **Ticket Statistics** - Count by status, priority, and category
- **Response Time Metrics** - Average response and resolution times
- **Support Performance** - Agent productivity and success rates
- **Recent Activity** - Latest tickets and updates overview

---

## 🗺️ **Advanced Location Services**

### **📍 Geolocation Integration**
- **GPS Auto-detection** - Automatic location capture for donations
- **Reverse Geocoding** - Convert coordinates to readable addresses
- **Location Validation** - Ensure accurate pickup and drop coordinates
- **Manual Override** - Allow manual coordinate entry when GPS fails

### **🗺️ Interactive Mapping**
- **Leaflet Integration** - Open-source mapping with custom markers
- **Route Visualization** - Display optimal routes for food pickup
- **Distance Calculations** - Smart agent suggestions based on proximity
- **Real-time Updates** - Live agent location tracking during pickups

### **🎯 Smart Agent Assignment**
- **Distance-based Suggestions** - Find nearest available agents
- **Automatic Assignment** - Admin can assign agents with one click
- **Route Optimization** - Calculate best pickup routes for agents
- **Drop Location Management** - Predefined drop points for efficiency

---

## 📈 **Comprehensive Analytics Dashboard**

### **📊 Platform Statistics**
- **Donation Metrics** - Total, pending, completed, rejected donations
- **User Analytics** - Donor, agent, and admin user statistics
- **Performance Tracking** - Completion rates and success metrics
- **Time-based Analysis** - Daily, weekly, and monthly trends

### **👥 User Insights**
- **Agent Performance** - Working hours, delivery success rates, productivity
- **Donor Engagement** - Impact scores, contribution tracking, activity levels
- **Popular Categories** - Most donated food types and preferences
- **Geographic Analysis** - Location-based donation patterns

### **📈 Business Intelligence**
- **Growth Metrics** - Platform expansion and user acquisition
- **Efficiency Reports** - Agent utilization and platform optimization
- **Impact Measurement** - Social impact tracking and reporting
- **Trend Analysis** - Historical data patterns and predictions

---

## 🔗 **API Documentation**

### **🔐 Authentication Endpoints**
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/verify      # Token verification
```

### **🍽️ Donor Endpoints**
```
POST /api/donor/create             # Create new donation
GET  /api/donor/mine               # Get user's donations
GET  /api/donor/donation/:id       # Get specific donation
PATCH /api/donor/donation/:id      # Update donation
DELETE /api/donor/donation/:id     # Delete donation
GET  /api/donor/profile            # Get donor profile
PATCH /api/donor/profile           # Update donor profile
```

### **🚗 Agent Endpoints**
```
GET  /api/agent/assigned           # Get assigned donations
PATCH /api/agent/pickup/:id/accept # Accept donation pickup
PATCH /api/agent/pickup/:id/reject # Reject donation pickup
PATCH /api/agent/pickup/:id/collected # Mark as collected
PATCH /api/agent/pickup/:id/delivered # Mark as delivered
PATCH /api/agent/pickup/:id/not-found # Mark as not found
GET  /api/agent/history            # Get pickup history
PATCH /api/agent/location          # Update agent location
PATCH /api/agent/status            # Update agent status
```

### **👑 Admin Endpoints**
```
GET  /api/admin/donations          # Get all donations
GET  /api/admin/stats             # Get platform statistics
GET  /api/admin/agents            # Get all agents
GET  /api/admin/donors            # Get all donors
PATCH /api/admin/donation/:id/assign-agent # Assign agent
GET  /api/admin/donation/:id/suggested-agents # Get suggested agents
PATCH /api/admin/user/:id/block   # Block user
PATCH /api/admin/user/:id/unblock # Unblock user
DELETE /api/admin/user/:id        # Delete user
```

### **💬 Chat Endpoints**
```
POST /api/chat/create             # Create or get chat
GET  /api/chat/:chatId/history    # Get chat history
POST /api/chat/:chatId/message    # Send message
POST /api/chat/:chatId/media      # Send media message
GET  /api/chat/admin/all          # Get all chats (admin)
POST /api/chat/admin/assign/:chatId # Assign chat
PUT  /api/chat/admin/status/:chatId # Update chat status
```

### **🎫 Support Endpoints**
```
POST /api/support/ticket          # Create support ticket
GET  /api/support/tickets         # Get all tickets (admin)
GET  /api/support/ticket/:id      # Get specific ticket
PUT  /api/support/ticket/:id      # Update ticket status
GET  /api/support/stats           # Get support statistics
GET  /api/support/track/:ticketId # Track ticket by ID (public)
GET  /api/support/user/tickets    # Get user's tickets
```

---

## 🚀 **Enhanced Deployment & Production**

### **🌐 Live Deployment**
- **Frontend**: Deployed on Vercel - [https://tummysmiles.vercel.app](https://tummysmiles.vercel.app)
- **Backend**: Deployed on Render - Auto-scaling serverless functions
- **Database**: MongoDB Atlas - Cloud database with automatic backups
- **File Storage**: Integrated file upload system with media handling

### **🔧 Environment Configuration**
```bash
# Backend Environment Variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_password
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://tummysmiles.vercel.app

# Frontend Environment Variables
VITE_API_URL=your_backend_api_url
VITE_SOCKET_URL=your_socket_server_url
```

### **🏗️ Build & Deploy Process**
```bash
# Backend Build
cd backend
npm install
npm run build  # Install dependencies
npm start      # Start production server

# Frontend Build
cd frontend
npm install
npm run build  # Create production build
npm run preview # Preview production build

# Automated Deployment
# - Frontend: Auto-deploy on push to main (Vercel)
# - Backend: Auto-deploy on push to main (Render)
# - Database: MongoDB Atlas with automatic scaling
```

### **⚡ Performance Optimizations**
- **Code Splitting** - Dynamic imports for optimal loading
- **Image Optimization** - Lazy loading and responsive images
- **API Caching** - Smart caching strategies for better performance
- **Bundle Optimization** - Tree shaking and minification
- **CDN Integration** - Fast global content delivery
- **Database Indexing** - Optimized queries and indexing

---

## 🌟 **What's New in This Version**

### **🎨 Visual Enhancements**
- **Glassmorphism effects** throughout the application
- **Particle background** with interactive animations
- **Gradient text** and button effects
- **Smooth transitions** on all interactions
- **Modern card designs** with hover effects

### **🚀 Performance Improvements**
- **Optimized animations** with CSS transforms
- **Lazy loading** for images and components
- **Efficient state management** with React hooks
- **Reduced bundle size** with code splitting

### **📱 Mobile Optimizations**
- **Touch-friendly** interface elements
- **Responsive breakpoints** for all screen sizes
- **Optimized fonts** and spacing for mobile
- **Fast loading** with optimized assets

---

## 🛡️ **Security & Best Practices**

### **� Security Features**
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Input Validation** - Server-side validation for all endpoints
- **CORS Configuration** - Proper cross-origin resource sharing
- **Role-based Access** - Middleware for route protection
- **SQL Injection Prevention** - MongoDB with proper query sanitization

### **🏗️ Architecture Best Practices**
- **MVC Pattern** - Clean separation of concerns
- **RESTful API Design** - Standard HTTP methods and status codes
- **Error Handling** - Comprehensive error management
- **Code Organization** - Modular structure with clear separation
- **Environment Variables** - Secure configuration management
- **Logging System** - Comprehensive logging for debugging

---

## 🧪 **Testing & Quality Assurance**

### **� Code Quality**
- **ESLint** for code consistency and best practices
- **Prettier** for consistent code formatting
- **Clean Architecture** with separation of concerns
- **TypeScript Ready** - Easy migration path for type safety

### **🧪 Testing Strategy**
- **API Testing** - Postman collections for endpoint testing
- **Component Testing** - React Testing Library setup
- **Integration Testing** - End-to-end testing capabilities
- **Performance Monitoring** - Real-time performance tracking

### **� Monitoring & Analytics**
- **Error Tracking** - Comprehensive error logging
- **Performance Metrics** - Response time and throughput monitoring
- **User Analytics** - Platform usage and engagement tracking
- **System Health** - Real-time system status monitoring

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch
3. **💻 Make** your changes
4. **✅ Test** thoroughly
5. **📝 Submit** a pull request

---

## 📈 **Roadmap**

### **🔮 Coming Soon**
- **🗺️ Google Maps integration** for enhanced location services
- **📱 Mobile app** with React Native
- **🔔 Push notifications** for real-time updates
- **📊 Advanced analytics** dashboard with data visualization
- **🌐 Multi-language support** for global accessibility
- **🎮 Gamification** features with badges and achievements
- **🤖 AI-powered** food categorization and smart matching
- **📱 PWA features** for offline functionality
- **🔍 Advanced search** and filtering capabilities
- **📊 Export functionality** for reports and analytics

### **🚀 Recently Added**
- **💬 Real-time chat system** with Socket.io integration
- **🎫 Comprehensive support ticket** management
- **📧 Automated email notifications** for all status updates
- **🗺️ Smart agent assignment** based on location proximity
- **📈 Advanced analytics dashboard** with detailed metrics
- **👥 Enhanced user management** with blocking/unblocking
- **🎨 Modern UI improvements** with glassmorphism effects
- **📱 Mobile-first responsive design** optimization

---

## 🎖️ **Credits**

**👨‍💻 Developer**: Shailendra Shukla  
**🎨 Design**: Modern UI/UX patterns  
**💡 Inspiration**: Making the world a better place, one meal at a time  

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💌 **Contact & Support**

### **📞 Get in Touch**
- **📧 Email**: hello@tummysmiles.com
- **🐦 Twitter**: @TummySmiles
- **� LinkedIn**: [TummySmiles Platform](https://linkedin.com/in/tummysmiles)
- **🌐 Website**: https://tummysmiles.vercel.app
- **📱 Support**: Create a ticket through our platform

### **🔧 Developer Contact**
- **👨‍💻 Developer**: Shailendra Shukla
- **📧 Email**: shailendra@tummysmiles.com
- **💼 LinkedIn**: [Connect with Shailendra](https://linkedin.com/in/shailendra-iiitm)
- **🐙 GitHub**: [@shailendra-iiitm](https://github.com/shailendra-iiitm)

### **🆘 Support Channels**
- **💬 Live Chat**: Available on platform for registered users
- **🎫 Support Tickets**: Create tickets through Contact page
- **📧 Email Support**: support@tummysmiles.com
- **📞 Emergency**: For urgent issues, contact through platform

---

## 📋 **Complete Feature Summary**

### **� Core Platform (23 Features)**
✅ Multi-role Authentication System  
✅ JWT-based Security & Authorization  
✅ Comprehensive Donation Management  
✅ Real-time Location Tracking  
✅ Smart Agent Assignment System  
✅ Interactive Mapping with Leaflet  
✅ File Upload & Media Handling  
✅ Modern Responsive UI Design  
✅ Glassmorphism Design Effects  
✅ Animated Progress Indicators  
✅ Mobile-First Development  
✅ Role-based Dashboard Systems  
✅ Real-time Status Updates  
✅ GPS Auto-detection  
✅ Reverse Geocoding Services  
✅ Distance-based Calculations  
✅ Route Optimization  
✅ User Profile Management  
✅ CRUD Operations for All Entities  
✅ Data Validation & Sanitization  
✅ Error Handling & Recovery  
✅ Environment Configuration  
✅ Production-Ready Deployment  

### **💬 Communication & Support (12 Features)**
✅ Real-time Chat System with Socket.io  
✅ Multi-user Chat Support  
✅ Media Sharing (Voice, Images, Files)  
✅ Admin Chat Management Interface  
✅ Online Status Indicators  
✅ Typing Indicators  
✅ Comprehensive Support Ticket System  
✅ Multi-status Workflow Management  
✅ Automated Email Notifications  
✅ Professional HTML Email Templates  
✅ Public Ticket Tracking  
✅ Support Analytics Dashboard  

### **📊 Analytics & Reporting (8 Features)**
✅ Comprehensive Platform Statistics  
✅ Agent Performance Tracking  
✅ Donor Engagement Analytics  
✅ Monthly Trend Analysis  
✅ Food Category Analytics  
✅ Geographic Analysis  
✅ Business Intelligence Reports  
✅ Impact Measurement System  

### **🔧 Technical Excellence (15 Features)**
✅ RESTful API Architecture  
✅ MongoDB with Mongoose ODM  
✅ Express.js Backend Framework  
✅ React 18 Frontend Framework  
✅ Vite Build System  
✅ Tailwind CSS Styling  
✅ Socket.io Real-time Communication  
✅ Multer File Upload Handling  
✅ Nodemailer Email Integration  
✅ ESLint Code Quality  
✅ Modular Code Architecture  
✅ Environment Variable Management  
✅ CORS Security Configuration  
✅ Database Indexing & Optimization  
✅ Performance Monitoring  

**Total: 58 Comprehensive Features**

---

<div align="center">

### 🌟 **Star this repository if you found it helpful!** 🌟

**Made with ❤️ by the TummySmiles team**

*Spreading joy through food, one meal at a time* 🍽️✨

</div>
