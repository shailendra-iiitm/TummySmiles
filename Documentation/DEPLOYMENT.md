# Deployment Guide

## Prerequisites
1. MongoDB Atlas account (free tier)
2. Vercel account (for frontend)
3. Render account (for backend)

## Backend Deployment (Render)

### Step 1: Setup MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a cluster (free tier M0)
3. Create a database user
4. Get connection string: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/food_donation`

### Step 2: Deploy to Render
1. Push your code to GitHub
2. Connect GitHub to Render
3. Create new Web Service
4. Choose your repository and `backend` folder
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18.x or higher

### Step 3: Environment Variables (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food_donation
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_chars
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app-name.vercel.app

# Payment Configuration (Required for financial donations)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in frontend directory
3. Follow prompts to deploy

### Step 2: Environment Variables (Vercel)
```
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
VITE_NODE_ENV=production

# Payment Configuration (Required for financial donations)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

### Step 3: Custom Domain (Optional)
1. Add custom domain in Vercel dashboard
2. Update CORS in backend with new domain

## Post-Deployment Setup

1. Update CORS origins in backend `index.js`:
   ```javascript
   allowedOrigins.push('https://your-actual-domain.vercel.app');
   ```

2. Test all functionality:
   - User registration/login
   - Donation creation
   - Agent assignment
   - Admin dashboard
   - **Payment processing** (financial donations)
   - **Payment verification** and receipts
   - **Admin financial analytics**

## Payment System Setup

### Razorpay Configuration
1. **Create Razorpay Account**: Sign up at [razorpay.com](https://razorpay.com)
2. **Get API Keys**: Navigate to Account & Settings > API Keys
3. **Generate Keys**: 
   - Test Mode: `rzp_test_xxxxxxxxxx`
   - Live Mode: `rzp_live_xxxxxxxxxx`
4. **Configure Webhooks** (Optional):
   - URL: `https://your-backend.onrender.com/api/webhook/payment`
   - Events: `payment.captured`, `payment.failed`

### Environment Variables Setup
Ensure these are configured in both development and production:

**Backend (Render/Railway)**:
```bash
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=webhook_secret
```

**Frontend (Vercel/Netlify)**:
```bash
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

### Testing Payment Integration
1. **Test Mode**: Use test API keys for development
2. **Test Cards**: Use Razorpay test card numbers
3. **Verification**: Test payment signature verification
4. **Webhooks**: Test webhook endpoints with ngrok (development)

## Local Development with Production APIs

Create `.env.local` files to test against production:

**Frontend (.env.local):**
```
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
```

**Backend (.env.local):**
```
MONGODB_URI=your_production_mongodb_uri
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check frontend URL in backend environment variables
2. **API not found**: Verify API base URL in frontend
3. **Database connection**: Check MongoDB connection string and IP whitelist
4. **Build failures**: Check Node.js version compatibility

### Render Specific:
- Free tier sleeps after 15 minutes of inactivity
- Cold start can take 30+ seconds
- Check logs in Render dashboard

### Vercel Specific:
- Build errors shown in deployment logs
- Environment variables case-sensitive
- Automatic deployments on git push
