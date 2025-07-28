# 💳 **TummySmiles Payment System Documentation**

> Complete guide to the financial donation and payment processing system in TummySmiles

![Payment System](https://img.shields.io/badge/Payment%20Gateway-Razorpay-3395FF)
![Security](https://img.shields.io/badge/Security-JWT%20%2B%20Signature%20Verification-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

---

## 🌟 **Overview**

TummySmiles features a comprehensive payment system that enables users to make financial donations to support food distribution efforts. The system is built with Razorpay integration and provides secure, reliable payment processing.

### 🎯 **Key Features**
- **Secure Payment Processing** - Razorpay integration with signature verification
- **Anonymous Donations** - Option to donate anonymously 
- **Real-time Tracking** - Complete payment status tracking
- **Admin Dashboard** - Comprehensive financial management
- **Receipt Generation** - Automatic receipt numbering
- **Refund Support** - Built-in refund capabilities
- **Analytics** - Payment success rates and financial insights

---

## 🏗️ **System Architecture**

### **Payment Flow Overview**
```
User Donation → Payment Order → Razorpay → Payment Verification → Database Update → Receipt
```

### **Components**
- **Frontend**: React payment forms and status tracking
- **Backend**: Node.js/Express payment controllers and services
- **Database**: MongoDB for payment records
- **Gateway**: Razorpay for payment processing
- **Security**: JWT authentication + payment signature verification

---

## 🔧 **Setup & Configuration**

### **Environment Variables**

**Backend (.env)**
```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here

# Database
MONGODB_URI=mongodb://localhost:27017/tummysmiles

# Security
JWT_SECRET=your_jwt_secret_here

# CORS
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### **Razorpay Setup**
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from the dashboard
3. Configure webhook endpoints (optional for advanced features)
4. Set up payment methods (UPI, Cards, Net Banking, etc.)

---

## 📡 **API Endpoints**

### **Payment Order Creation**
```http
POST /api/payment/create-order
Authorization: Bearer <jwt_token>
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

**Response:**
```json
{
  "order": {
    "id": "order_xyz123",
    "amount": 50000,
    "currency": "INR",
    "receipt": "RCP-2024-001"
  },
  "donationId": "64abc123def456789",
  "key": "rzp_test_xxxxxxxxxx"
}
```

### **Payment Verification**
```http
POST /api/payment/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc789",
  "razorpay_signature": "signature_hash",
  "donationId": "64abc123def456789"
}
```

### **Admin Payment Analytics**
```http
GET /api/payment/admin/analytics
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "totalDonations": 150,
  "totalRevenue": 75000,
  "successfulPayments": 142,
  "failedPayments": 8,
  "successRate": 94.67,
  "averageDonation": 500,
  "monthlyRevenue": 25000,
  "topDonors": [...]
}
```

### **Get All Payments (Admin)**
```http
GET /api/payment/admin/all?page=1&limit=20&status=success&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <admin_jwt_token>
```

### **Payment Refund**
```http
POST /api/payment/refund
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "paymentId": "pay_abc789",
  "amount": 500,
  "reason": "User requested refund"
}
```

---

## 💾 **Database Schema**

### **MoneyDonation Model**
```javascript
{
  _id: ObjectId,
  donor: ObjectId, // Reference to User
  amount: Number, // Amount in rupees
  donorName: String,
  donorEmail: String,
  donorPhone: String,
  message: String,
  isAnonymous: Boolean,
  receiptNumber: String, // Auto-generated (RCP-YYYY-XXX)
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentStatus: String, // 'pending', 'success', 'failed'
  paymentMethod: String,
  paymentSignature: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Receipt Number Format**
- Pattern: `RCP-YYYY-XXX`
- Example: `RCP-2024-001`, `RCP-2024-002`
- Auto-incremented per year

---

## 🎨 **Frontend Integration**

### **Payment Form Component**
```jsx
// Donor donation form with Razorpay integration
import { useState } from 'react';
import api from '../services/api';

const DonationForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    message: '',
    isAnonymous: false
  });

  const handlePayment = async () => {
    try {
      // Create payment order
      const response = await api.post('/payment/create-order', formData);
      const { order, key, donationId } = response.data;

      // Load Razorpay checkout
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'TummySmiles',
        description: 'Food Donation',
        order_id: order.id,
        handler: async (response) => {
          // Verify payment
          await api.post('/payment/verify', {
            ...response,
            donationId
          });
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };
};
```

### **Admin Dashboard Integration**
The admin dashboard includes comprehensive financial tracking:

- **Financial Overview Cards**: Total donations, revenue, success rates
- **Payment Analytics**: Success rate calculations with visual progress bars
- **Money Donations Table**: Complete transaction history with filters
- **Export Functionality**: CSV export of financial data
- **Real-time Updates**: Live financial statistics

---

## 🔒 **Security Features**

### **Payment Signature Verification**
```javascript
// Automatic signature verification for each payment
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  
  return expectedSignature === signature;
};
```

### **Authentication Requirements**
- All payment endpoints require JWT authentication
- Admin endpoints require admin role verification
- User context validation for payment creation

### **Data Validation**
- Amount validation (minimum ₹1)
- Email format validation
- Phone number format validation
- Required field validation

---

## 📊 **Analytics & Reporting**

### **Admin Financial Dashboard**
- **Total Revenue**: Sum of all successful payments
- **Success Rate**: Percentage of successful vs total payments
- **Average Donation**: Mean donation amount
- **Monthly Trends**: Revenue tracking by month
- **Top Donors**: Highest contributing users

### **Payment Status Tracking**
- **Pending**: Payment initiated but not completed
- **Success**: Payment completed successfully
- **Failed**: Payment failed or cancelled

### **Export Features**
- **CSV Export**: Complete transaction history
- **Date Range Filtering**: Filter by custom date ranges
- **Status Filtering**: Filter by payment status
- **Amount Filtering**: Filter by donation amounts

---

## 🧪 **Testing**

### **Test Mode Configuration**
```javascript
// Automatic fallback to test mode if credentials missing
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  // Use test order creation
  const testOrder = {
    id: `test_order_${Date.now()}`,
    amount: amount * 100,
    currency: 'INR',
    receipt: receiptNumber,
    status: 'created'
  };
}
```

### **Test Credentials**
```bash
# Razorpay Test Mode
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=test_secret_key
```

### **Test Cards**
- **Success**: 4111 1111 1111 1111
- **Failure**: 4111 1111 1111 1112
- **CVV**: Any 3 digits
- **Expiry**: Any future date

---

## 🚀 **Deployment**

### **Production Environment Variables**
```bash
# Production Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=live_secret_key

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tummysmiles

# Frontend URL
FRONTEND_URL=https://tummysmiles.vercel.app
```

### **Webhook Configuration (Optional)**
```bash
# Webhook endpoint for automatic payment updates
WEBHOOK_SECRET=your_webhook_secret
```

---

## 🛠️ **Troubleshooting**

### **Common Issues**

**1. Payment Creation Fails**
```bash
Error: Razorpay credentials not configured
Solution: Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables
```

**2. Signature Verification Fails**
```bash
Error: Invalid payment signature
Solution: Ensure RAZORPAY_KEY_SECRET matches the one used for order creation
```

**3. Database Connection Issues**
```bash
Error: Failed to save donation
Solution: Check MongoDB connection and ensure database is accessible
```

### **Debug Mode**
Enable detailed logging by setting:
```bash
NODE_ENV=development
DEBUG=payment:*
```

---

## 📈 **Performance Optimization**

### **Best Practices**
- **Async Processing**: All payment operations are asynchronous
- **Error Handling**: Comprehensive error catching and logging
- **Database Indexing**: Optimized queries for payment retrieval
- **Caching**: Redis caching for frequently accessed payment data (optional)

### **Monitoring**
- Payment success rate tracking
- Response time monitoring
- Error rate tracking
- Failed payment analysis

---

## 🔄 **API Response Codes**

| Code | Status | Description |
|------|--------|-------------|
| 200 | Success | Payment processed successfully |
| 400 | Bad Request | Invalid payment data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Payment/Order not found |
| 500 | Server Error | Internal payment processing error |

---

## 📞 **Support & Contact**

### **Technical Support**
- **Email**: dev@tummysmiles.com
- **Documentation**: `/docs/payment-api`
- **GitHub Issues**: [TummySmiles Issues](https://github.com/shailendra-iiitm/TummySmiles/issues)

### **Razorpay Support**
- **Dashboard**: [Razorpay Dashboard](https://dashboard.razorpay.com/)
- **Documentation**: [Razorpay Docs](https://razorpay.com/docs/)
- **Support**: support@razorpay.com

---

<div align="center">

### 💰 **Payment System Status: Production Ready** 💰

**Built with ❤️ for seamless donations**

*Secure • Reliable • User-Friendly*

</div>

---

## 📝 **Version History**

- **v2.0** - Enhanced admin dashboard with comprehensive financial tracking
- **v1.5** - Added anonymous donation support
- **v1.2** - Implemented refund functionality
- **v1.1** - Added payment analytics and reporting
- **v1.0** - Initial payment system with Razorpay integration

---

*Last Updated: January 25, 2025*
