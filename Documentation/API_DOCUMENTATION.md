# 🔗 **TummySmiles API Documentation**

> Complete API reference for the TummySmiles Food Donation Platform

![API Status](https://img.shields.io/badge/API-v2.0-blue)
![Authentication](https://img.shields.io/badge/Auth-JWT%20Bearer-green)
![Database](https://img.shields.io/badge/Database-MongoDB-green)

---

## 🌐 **Base URL**

- **Development**: `http://localhost:5000/api`
- **Production**: `https://tummysmiles.onrender.com/api`

---

## 🔐 **Authentication**

All protected endpoints require JWT token in Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### **Role-Based Access**
- **User**: Basic authenticated user
- **Agent**: Delivery agent role
- **Admin**: Administrative privileges

---

## 👤 **Authentication Endpoints**

### **Register User**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword":"password123",
  "role": "donor", // "donor", "agent", "admin"
  "address": "123 Main St, City"
}
```

### **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "donor"
  }
}
```

---

## 🍽️ **Donations Endpoints**

### **Create Food Donation**
```http
POST /donations
Authorization: Bearer <token>
Content-Type: application/json

{
  "foodType": "Cooked Meals",
  "quantity": "50 servings",
  "description": "Fresh biryani from wedding",
  "expiryTime": "2024-01-25T18:00:00Z",
  "location": {
    "address": "123 Main St",
    "coordinates": [77.1025, 28.7041]
  },
  "contactPerson": "John Doe",
  "contactPhone": "9876543210"
}
```

### **Get User Donations**
```http
GET /donations/my
Authorization: Bearer <token>
```

### **Get All Donations (Admin)**
```http
GET /donations/admin/all?page=1&limit=20&status=pending
Authorization: Bearer <admin_token>
```

### **Update Donation Status**
```http
PUT /donations/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted", // "pending", "accepted", "collected", "delivered"
  "agentId": "agent_user_id"
}
```

---

## 💳 **Payment Endpoints**

### **Create Payment Order**
```http
POST /payment/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "donorPhone": "+91-9876543210",
  "message": "Happy to help!",
  "isAnonymous": false
}
```

### **Verify Payment**
```http
POST /payment/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc789",
  "razorpay_signature": "signature_hash",
  "donationId": "donation_id"
}
```

### **Get Payment Analytics (Admin)**
```http
GET /payment/admin/analytics
Authorization: Bearer <admin_token>
```

### **Get All Payments (Admin)**
```http
GET /payment/admin/all?page=1&limit=20&status=success
Authorization: Bearer <admin_token>
```

### **Process Refund (Admin)**
```http
POST /payment/refund
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "paymentId": "pay_abc789",
  "amount": 500,
  "reason": "User requested refund"
}
```

---

## 🚗 **Agent Endpoints**

### **Get Available Pickups**
```http
GET /agent/pickups
Authorization: Bearer <agent_token>
```

### **Accept Pickup**
```http
POST /agent/pickup/:donationId/accept
Authorization: Bearer <agent_token>
```

### **Update Location**
```http
PUT /agent/location
Authorization: Bearer <agent_token>
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "address": "Current location"
}
```

### **Update Delivery Status**
```http
PUT /agent/delivery/:donationId/status
Authorization: Bearer <agent_token>
Content-Type: application/json

{
  "status": "collected", // "assigned", "collected", "in_transit", "delivered"
  "notes": "Food collected successfully"
}
```

---

## 👑 **Admin Endpoints**

### **Get Dashboard Stats**
```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "totalDonations": 245,
  "activeDonations": 12,
  "totalAgents": 15,
  "activeAgents": 8,
  "totalRevenue": 125000,
  "monthlyGrowth": 15.5
}
```

### **Get All Users**
```http
GET /admin/users?page=1&limit=20&role=donor
Authorization: Bearer <admin_token>
```

### **Block/Unblock User**
```http
PUT /admin/users/:userId/block
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "blocked": true,
  "reason": "Violation of terms"
}
```

### **Assign Agent to Donation**
```http
POST /admin/donations/:donationId/assign-agent
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "agentId": "agent_user_id"
}
```

---

## 🎫 **Support Endpoints**

### **Create Support Ticket**
```http
POST /support/ticket
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Payment Issue",
  "category": "financial",
  "priority": "high",
  "message": "Unable to complete donation payment"
}
```

### **Get User Tickets**
```http
GET /support/tickets/my
Authorization: Bearer <token>
```

### **Get Ticket by ID**
```http
GET /support/tickets/:ticketId
Authorization: Bearer <token>
```

### **Update Ticket Status (Admin)**
```http
PUT /support/tickets/:ticketId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "resolved",
  "response": "Issue has been resolved",
  "resolvedBy": "admin_user_id"
}
```

---

## 🔔 **Webhook Endpoints**

### **Payment Webhook**
```http
POST /webhook/payment
Content-Type: application/json
X-Razorpay-Signature: <signature>

{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_abc123",
        "order_id": "order_xyz789",
        "status": "captured"
      }
    }
  }
}
```

---

## 📊 **Response Format**

### **Success Response**
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      // Error details
    }
  }
}
```

---

## 🏷️ **Status Codes**

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

---

## 🔍 **Query Parameters**

### **Pagination**
```http
GET /endpoint?page=1&limit=20
```

### **Filtering**
```http
GET /endpoint?status=pending&category=urgent
```

### **Sorting**
```http
GET /endpoint?sortBy=createdAt&sortOrder=desc
```

### **Search**
```http
GET /endpoint?search=keyword&searchFields=name,email
```

---

## 📝 **Data Models**

### **User Model**
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  role: String, // 'donor', 'agent', 'admin'
  address: String,
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Donation Model**
```javascript
{
  _id: ObjectId,
  donor: ObjectId, // User reference
  foodType: String,
  quantity: String,
  description: String,
  expiryTime: Date,
  location: {
    address: String,
    coordinates: [Number] // [longitude, latitude]
  },
  status: String, // 'pending', 'accepted', 'collected', 'delivered'
  assignedAgent: ObjectId, // User reference
  createdAt: Date,
  updatedAt: Date
}
```

### **MoneyDonation Model**
```javascript
{
  _id: ObjectId,
  donor: ObjectId,
  amount: Number,
  donorName: String,
  donorEmail: String,
  donorPhone: String,
  message: String,
  isAnonymous: Boolean,
  receiptNumber: String, // RCP-YYYY-XXX
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentStatus: String, // 'pending', 'success', 'failed'
  paymentSignature: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 **Testing**

### **Test Users**
```json
{
  "donor": {
    "phone": "1234567890",
    "password": "password123"
  },
  "agent": {
    "phone": "0987654321", 
    "password": "password123"
  },
  "admin": {
    "phone": "5555555555",
    "password": "password123"
  }
}
```

### **Test Environment**
```bash
# Use test database
MONGODB_URI=mongodb://localhost:27017/tummysmiles_test

# Test payment credentials
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=test_secret_key
```

---

## 🔧 **Rate Limiting**

| Endpoint Category | Rate Limit |
|------------------|------------|
| Authentication | 10 requests/minute |
| General API | 100 requests/minute |
| File Upload | 20 requests/minute |
| Payment API | 50 requests/minute |

---

## 📞 **Support**

### **API Issues**
- **Email**: api-support@tummysmiles.com
- **Response Time**: Within 24 hours
- **Status Page**: https://status.tummysmiles.com

### **Integration Help**
- **Documentation**: https://docs.tummysmiles.com
- **Examples**: https://github.com/tummysmiles/api-examples
- **Community**: https://community.tummysmiles.com

---

<div align="center">

### 🚀 **API Status: Production Ready** 🚀

**Built for reliability, security, and ease of use**

*RESTful • Documented • Developer-Friendly*

</div>

---

*Last Updated: January 25, 2025*
