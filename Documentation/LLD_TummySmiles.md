# 🔧 **Low Level Design (LLD) - TummySmiles Food Donation Platform**

## 📋 **Document Information**
- **Project**: TummySmiles - Modern Food Donation Platform
- **Version**: 2.0
- **Date**: January 25, 2025
- **Authors**: Shailendra Shukla & Anisha Dwivedi
- **Document Type**: Low Level Design

---

## 🎯 **1. Detailed Component Design**

### **1.1 System Component Breakdown**

```
TummySmiles Application
├── Frontend (React SPA)
│   ├── Authentication Components
│   ├── Dashboard Components (Donor/Agent/Admin)
│   ├── Donation Management Components
│   ├── Payment Components
│   ├── Chat Components
│   └── Common UI Components
├── Backend (Node.js/Express API)
│   ├── Controllers
│   ├── Models (Mongoose Schemas)
│   ├── Routes
│   ├── Middlewares
│   ├── Services
│   └── Utils
└── Database (MongoDB)
    ├── Collections
    ├── Indexes
    └── Aggregation Pipelines
```

---

## 🗄️ **2. Database Design**

### **2.1 Collections Schema**

#### **2.1.1 Users Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, sparse),
  phone: String (required, unique),
  address: String,
  password: String (required, hashed),
  role: String (enum: ['donor', 'admin', 'agent'], default: 'donor'),
  pincode: String (required for donor/agent),
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  // Agent-specific fields
  agentStatus: String (enum: ['active', 'inactive']),
  workingHours: [{
    date: Date,
    startTime: Date,
    endTime: Date,
    totalHours: Number,
    status: String
  }],
  isBlocked: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- { phone: 1 } (unique)
- { email: 1 } (unique, sparse)
- { role: 1 }
- { pincode: 1 }
- { agentStatus: 1 }
- { isBlocked: 1 }
```

#### **2.1.2 Donations Collection**
```javascript
{
  _id: ObjectId,
  donor: ObjectId (ref: 'User', required),
  foodType: String,
  quantity: String,
  pickupAddress: String,
  pickupLocation: {
    lat: Number,
    lng: Number
  },
  dropLocation: {
    lat: Number,
    lng: Number
  },
  agentLocation: {
    lat: Number (default: null),
    lng: Number (default: null)
  },
  status: String (enum: [
    'pending', 'accepted', 'rejected', 
    'collected', 'agent_rejected', 
    'not_found', 'agent_accepted', 'delivered'
  ], default: 'pending'),
  agent: ObjectId (ref: 'User', default: null),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- { donor: 1 }
- { agent: 1 }
- { status: 1 }
- { createdAt: -1 }
- { pickupLocation: '2dsphere' }
- { dropLocation: '2dsphere' }
```

#### **2.1.3 MoneyDonations Collection**
```javascript
{
  _id: ObjectId,
  donor: ObjectId (ref: 'User', required),
  amount: Number (required, min: 1),
  currency: String (default: 'INR', enum: ['INR', 'USD']),
  donorName: String (required),
  donorEmail: String (required),
  donorPhone: String (required),
  message: String (maxlength: 500),
  isAnonymous: Boolean (default: false),
  receiptNumber: String (format: 'RCP-YYYY-XXX'),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentStatus: String (enum: ['pending', 'success', 'failed']),
  paymentMethod: String,
  paymentSignature: String,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- { donor: 1 }
- { paymentStatus: 1 }
- { createdAt: -1 }
- { razorpayOrderId: 1 }
- { receiptNumber: 1 }
```

#### **2.1.4 SupportTickets Collection**
```javascript
{
  _id: ObjectId,
  ticketId: String (unique, format: 'TS' + timestamp + random),
  userId: ObjectId (ref: 'User'),
  name: String (required),
  email: String (required),
  subject: String (required),
  category: String (enum: [
    'general', 'technical', 'donation', 
    'financial', 'payment', 'agent', 
    'partnership', 'feedback'
  ]),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  status: String (enum: ['open', 'in_progress', 'resolved', 'closed']),
  message: String (required),
  response: String,
  assignedTo: ObjectId (ref: 'User'),
  resolvedBy: ObjectId (ref: 'User'),
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- { ticketId: 1 } (unique)
- { userId: 1 }
- { status: 1 }
- { category: 1 }
- { priority: 1 }
- { createdAt: -1 }
```

#### **2.1.5 Chats Collection**
```javascript
{
  _id: ObjectId,
  chatId: String (required, unique),
  participants: [{
    userId: ObjectId (ref: 'User', required),
    name: String (required),
    role: String (enum: ['user', 'donor', 'admin', 'agent'], required),
    joinedAt: Date (default: Date.now)
  }],
  messages: [{
    senderId: ObjectId (ref: 'User'),
    senderName: String (required),
    senderRole: String (enum: ['user', 'donor', 'admin', 'agent', 'system']),
    message: String (required),
    messageType: String (enum: ['text', 'image', 'audio', 'file', 'system']),
    mediaUrl: String,
    fileName: String,
    fileSize: Number,
    timestamp: Date (default: Date.now)
  }],
  status: String (enum: ['active', 'resolved', 'closed'], default: 'active'),
  assignedTo: ObjectId (ref: 'User'),
  lastActivity: Date (default: Date.now),
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- { chatId: 1 } (unique)
- { 'participants.userId': 1 }
- { status: 1 }
- { lastActivity: -1 }
```

---

## 🔧 **3. API Design Specification**

### **3.1 Authentication APIs**

#### **POST /api/auth/register**
```javascript
// Request Body
{
  name: String (required),
  phone: String (required),
  email: String (optional),
  password: String (required),
  confirmPassword: String (required),
  role: String (required, enum: ['donor', 'agent', 'admin']),
  pincode: String (required for donor/agent),
  address: String (optional)
}

// Response
{
  success: Boolean,
  message: String,
  userId: ObjectId
}

// Implementation
const register = async (req, res) => {
  // 1. Validate input data
  // 2. Check if user already exists
  // 3. Hash password with bcrypt
  // 4. Create user in database
  // 5. Return success response
}
```

#### **POST /api/auth/login**
```javascript
// Request Body
{
  identifier: String (phone or email),
  password: String (required)
}

// Response
{
  token: String (JWT),
  user: {
    id: ObjectId,
    name: String,
    phone: String,
    role: String,
    pincode: String (if applicable)
  }
}

// Implementation
const login = async (req, res) => {
  // 1. Find user by phone or email
  // 2. Verify password with bcrypt
  // 3. Generate JWT token
  // 4. Return token and user data
}
```

### **3.2 Donation Management APIs**

#### **POST /api/donor/create**
```javascript
// Request Body
{
  foodType: String (required),
  quantity: String (required),
  pickupAddress: String (required),
  pickupLocation: {
    lat: Number (required),
    lng: Number (required)
  }
}

// Response
{
  success: Boolean,
  donation: DonationObject,
  message: String
}

// Implementation
const createDonation = async (req, res) => {
  // 1. Validate donation data
  // 2. Create donation object
  // 3. Save to database
  // 4. Return created donation
}
```

#### **GET /api/admin/donations**
```javascript
// Query Parameters
{
  page: Number (default: 1),
  limit: Number (default: 20),
  status: String (optional),
  sortBy: String (default: 'createdAt'),
  sortOrder: String (default: 'desc')
}

// Response
{
  donations: Array<DonationObject>,
  pagination: {
    currentPage: Number,
    totalPages: Number,
    totalItems: Number,
    hasNext: Boolean,
    hasPrev: Boolean
  }
}

// Implementation
const getAllDonations = async (req, res) => {
  // 1. Build query filters
  // 2. Apply pagination
  // 3. Populate related data
  // 4. Return paginated results
}
```

### **3.3 Payment APIs**

#### **POST /api/payment/create-order**
```javascript
// Request Body
{
  amount: Number (required, min: 1),
  donorName: String (required),
  donorEmail: String (required),
  donorPhone: String (required),
  message: String (optional),
  isAnonymous: Boolean (default: false)
}

// Response
{
  order: {
    id: String (Razorpay order ID),
    amount: Number (in paise),
    currency: String,
    receipt: String
  },
  donationId: ObjectId,
  key: String (Razorpay key ID)
}

// Implementation
const createPaymentOrder = async (req, res) => {
  // 1. Validate payment data
  // 2. Create money donation record
  // 3. Generate receipt number
  // 4. Create Razorpay order
  // 5. Update donation with order ID
  // 6. Return order details
}
```

#### **POST /api/payment/verify**
```javascript
// Request Body
{
  razorpay_order_id: String (required),
  razorpay_payment_id: String (required),
  razorpay_signature: String (required),
  donationId: ObjectId (required)
}

// Response
{
  success: Boolean,
  message: String,
  donation: MoneyDonationObject
}

// Implementation
const verifyPayment = async (req, res) => {
  // 1. Verify Razorpay signature
  // 2. Update donation status
  // 3. Store payment details
  // 4. Send confirmation
  // 5. Return success response
}
```

---

## 🎨 **4. Frontend Component Architecture**

### **4.1 Component Hierarchy**

```
App
├── AuthProvider (Context)
├── ChatProvider (Context)
├── BrowserRouter
└── AppContent
    ├── Navbar
    ├── ParticleBackground
    ├── ChatWidget
    ├── Routes
    │   ├── Public Routes
    │   │   ├── Home
    │   │   ├── About
    │   │   ├── Contact
    │   │   ├── Login
    │   │   └── Register
    │   ├── Donor Routes (Protected)
    │   │   ├── DonorDashboard
    │   │   ├── CreateDonation
    │   │   ├── MyDonations
    │   │   ├── MoneyDonation
    │   │   └── DonorProfile
    │   ├── Agent Routes (Protected)
    │   │   ├── AgentDashboard
    │   │   ├── AgentProfile
    │   │   ├── AgentLocation
    │   │   └── AgentStatus
    │   └── Admin Routes (Protected)
    │       ├── AdminDashboard
    │       └── AdminProfile
    ├── Footer (Conditional)
    └── Toaster (Notifications)
```

### **4.2 Key Component Implementations**

#### **4.2.1 AdminDashboard Component**
```javascript
const AdminDashboard = () => {
  // State Management
  const [activeTab, setActiveTab] = useState("donations");
  const [donations, setDonations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({});
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);

  // Data Fetching
  const fetchDonations = useCallback(async () => {
    // Implementation for fetching donations
  }, []);

  const fetchStats = useCallback(async () => {
    // Implementation for fetching statistics
  }, []);

  // Tab Management
  const tabs = [
    { id: "donations", label: "Food Donations", icon: "🍽️" },
    { id: "agents", label: "Agent Management", icon: "🚗" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "support", label: "Support Tickets", icon: "🎫" },
    { id: "money", label: "Financial Tracking", icon: "💰" },
    { id: "chat", label: "Chat Management", icon: "💬" }
  ];

  // Component Structure
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      {/* Tab Navigation */}
      {/* Tab Content */}
      {/* Modals */}
    </div>
  );
};
```

#### **4.2.2 PaymentService Implementation**
```javascript
class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount, currency = 'INR', receiptId) {
    // Validate inputs
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount provided');
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receiptId,
      payment_capture: 1
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
  }

  verifyPaymentSignature(orderId, paymentId, signature) {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  }
}
```

---

## 🔒 **5. Security Implementation**

### **5.1 Authentication Middleware**
```javascript
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
```

### **5.2 Role Verification Middleware**
```javascript
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Authentication required' });
    }

    const userRole = req.user.role;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        msg: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};
```

### **5.3 Input Validation**
```javascript
const validateDonation = (req, res, next) => {
  const { foodType, quantity, pickupAddress, pickupLocation } = req.body;

  if (!foodType || !quantity || !pickupAddress) {
    return res.status(400).json({ 
      msg: 'Missing required fields: foodType, quantity, pickupAddress' 
    });
  }

  if (!pickupLocation || !pickupLocation.lat || !pickupLocation.lng) {
    return res.status(400).json({ 
      msg: 'Valid pickup location coordinates are required' 
    });
  }

  next();
};
```

---

## 🚀 **6. Real-time Communication**

### **6.1 Socket.IO Implementation**
```javascript
// Server-side Socket handling
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    socket.userId = user._id.toString();
    socket.userRole = user.role;
    socket.userName = user.name;
    
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userName} (${socket.userRole})`);

  // Join user to their role-based room
  socket.join(socket.userRole);
  socket.join(`user_${socket.userId}`);

  // Handle chat messages
  socket.on('send_message', async (data) => {
    try {
      const { chatId, message, messageType = 'text' } = data;
      
      // Save message to database
      const chat = await Chat.findOne({ chatId });
      const newMessage = {
        senderId: socket.userId,
        senderName: socket.userName,
        senderRole: socket.userRole,
        message,
        messageType,
        timestamp: new Date()
      };

      chat.messages.push(newMessage);
      await chat.save();

      // Emit to all participants
      chat.participants.forEach(participant => {
        io.to(`user_${participant.userId}`).emit('new_message', {
          chatId,
          message: newMessage
        });
      });

    } catch (error) {
      socket.emit('message_error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userName}`);
  });
});
```

### **6.2 Frontend Socket Integration**
```javascript
// React Hook for Socket.IO
const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });

      newSocket.on('new_message', (data) => {
        // Handle incoming messages
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return socket;
};
```

---

## 📊 **7. Data Processing & Analytics**

### **7.1 Aggregation Pipelines**

#### **7.1.1 Donation Statistics**
```javascript
const getDonationStats = async () => {
  const stats = await Donation.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        statusCounts: {
          $push: {
            status: "$_id",
            count: "$count"
          }
        },
        totalDonations: { $sum: "$count" }
      }
    }
  ]);

  return stats[0];
};
```

#### **7.1.2 Financial Analytics**
```javascript
const getFinancialAnalytics = async () => {
  const analytics = await MoneyDonation.aggregate([
    {
      $match: { paymentStatus: 'success' }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalDonations: { $sum: 1 },
        averageDonation: { $avg: "$amount" }
      }
    },
    {
      $addFields: {
        formattedRevenue: { $toString: "$totalRevenue" },
        formattedAverage: { $round: ["$averageDonation", 2] }
      }
    }
  ]);

  return analytics[0];
};
```

### **7.2 Distance Calculation Utility**
```javascript
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

const findNearestAgents = (donationLocation, agents, maxAgents = 5) => {
  return agents
    .map(agent => ({
      ...agent.toObject(),
      distance: agent.location?.lat && agent.location?.lng
        ? calculateDistance(
            donationLocation.lat,
            donationLocation.lng,
            agent.location.lat,
            agent.location.lng
          )
        : Infinity
    }))
    .filter(agent => agent.distance !== Infinity)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxAgents);
};
```

---

## 🔧 **8. Error Handling & Logging**

### **8.1 Global Error Handler**
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
```

### **8.2 Request Logging**
```javascript
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
```

---

## 🧪 **9. Testing Strategy**

### **9.1 Unit Tests**
```javascript
// Example: Testing payment service
describe('PaymentService', () => {
  let paymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  describe('createOrder', () => {
    it('should create a valid order', async () => {
      const order = await paymentService.createOrder(100, 'INR', 'RCP-2024-001');
      
      expect(order).toHaveProperty('id');
      expect(order.amount).toBe(10000); // 100 * 100 (paise)
      expect(order.currency).toBe('INR');
    });

    it('should throw error for invalid amount', async () => {
      await expect(paymentService.createOrder(0))
        .rejects.toThrow('Invalid amount provided');
    });
  });
});
```

### **9.2 Integration Tests**
```javascript
// Example: Testing donation API
describe('Donation API', () => {
  let token;

  beforeEach(async () => {
    // Create test user and get token
    token = await getTestUserToken();
  });

  it('should create a donation', async () => {
    const donationData = {
      foodType: 'Cooked Rice',
      quantity: '50 servings',
      pickupAddress: 'Test Address',
      pickupLocation: { lat: 28.7041, lng: 77.1025 }
    };

    const response = await request(app)
      .post('/api/donor/create')
      .set('Authorization', `Bearer ${token}`)
      .send(donationData)
      .expect(201);

    expect(response.body.donation).toHaveProperty('_id');
    expect(response.body.donation.status).toBe('pending');
  });
});
```

---

## 📈 **10. Performance Optimization**

### **10.1 Database Optimization**
```javascript
// Efficient pagination with indexes
const getPaginatedDonations = async (page = 1, limit = 20, filters = {}) => {
  const skip = (page - 1) * limit;
  
  const donations = await Donation.aggregate([
    { $match: filters },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'donor',
        foreignField: '_id',
        as: 'donorInfo'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'agent',
        foreignField: '_id',
        as: 'agentInfo'
      }
    }
  ]);

  const total = await Donation.countDocuments(filters);
  
  return {
    donations,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};
```

### **10.2 Caching Strategy**
```javascript
// Redis caching for frequently accessed data
const cacheService = {
  get: async (key) => {
    if (redisClient.isReady) {
      return await redisClient.get(key);
    }
    return null;
  },

  set: async (key, value, ttl = 3600) => {
    if (redisClient.isReady) {
      await redisClient.setex(key, ttl, JSON.stringify(value));
    }
  },

  getCachedStats: async () => {
    const cached = await cacheService.get('admin:stats');
    
    if (cached) {
      return JSON.parse(cached);
    }

    const stats = await generateStats();
    await cacheService.set('admin:stats', stats, 300); // 5 minutes
    
    return stats;
  }
};
```

---

<div align="center">

### 🔧 **Low Level Design Complete** 🔧

**Implementation Ready • Scalable • Maintainable**

*Detailed technical specifications for seamless development*

</div>

---

*Document Version: 2.0 | Last Updated: January 25, 2025*
