# 🚀 Payment Integration Deployment Guide

## 📋 Quick Checklist

### ✅ Before Pushing Code
- [ ] All payment integration files created
- [ ] Environment variables documented
- [ ] Webhook handler implemented
- [ ] Routes updated

## 🔧 Environment Variables Setup

### 1. 🎨 Vercel (Frontend)
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

```bash
# Required Variables
VITE_API_URL=https://your-backend-url.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_id

# Optional for analytics
VITE_ENVIRONMENT=production
```

### 2. 🚀 Render (Backend)
Go to Render Dashboard → Your Service → Environment

```bash
# Existing Variables (keep these)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=5000

# NEW Payment Variables (add these)
RAZORPAY_KEY_ID=rzp_live_your_live_key_id
RAZORPAY_KEY_SECRET=your_live_key_secret
RAZORPAY_WEBHOOK_SECRET=whsec_your_webhook_secret

# Optional
FRONTEND_URL=https://your-app.vercel.app
```

## 🔗 Razorpay Configuration

### 1. Switch to Live Mode
1. Login to Razorpay Dashboard
2. Switch from "Test Mode" to "Live Mode"
3. Complete KYC verification if not done
4. Generate Live API Keys

### 2. Create Webhook
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Click "Create Webhook"
3. Configure as follows:

```
Webhook URL: https://your-backend-url.onrender.com/api/webhook/razorpay
Active Events:
  ✅ payment.captured
  ✅ payment.failed
  ✅ payment.authorized
Secret: Generate new secret (save this for RAZORPAY_WEBHOOK_SECRET)
```

### 3. Test Webhook
After deployment, test webhook with:
```bash
curl -X POST https://your-backend-url.onrender.com/api/webhook/razorpay \
  -H "Content-Type: application/json" \
  -H "X-Razorpay-Signature: test" \
  -d '{"event":"test"}'
```

## 📦 Dependencies to Install

### Backend (already in package.json)
```bash
npm install razorpay crypto
```

### Frontend (already in package.json)  
```bash
npm install razorpay
```

## 🔍 Post-Deployment Testing

### 1. Test Payment Flow
1. Go to your live site
2. Navigate to Money Donation page
3. Try a test payment with live credentials
4. Verify webhook receives events
5. Check admin dashboard for donation records

### 2. Monitor Logs
- **Render**: Dashboard → Logs
- **Vercel**: Dashboard → Functions → Logs
- **Razorpay**: Dashboard → Payment Links → Logs

## 🛡️ Security Checklist

- [ ] Live API keys configured (not test keys)
- [ ] Webhook secret properly set
- [ ] CORS origins updated for production
- [ ] Environment variables secured
- [ ] No hardcoded secrets in code

## 🚨 Troubleshooting

### Common Issues:

1. **Payment Gateway Not Loading**
   - Check VITE_RAZORPAY_KEY_ID is set correctly
   - Verify API URL is pointing to your Render backend

2. **Webhook Not Receiving Events**
   - Verify webhook URL is accessible
   - Check RAZORPAY_WEBHOOK_SECRET matches
   - Ensure webhook route is before body parsing

3. **CORS Errors**
   - Add your Vercel domain to allowed origins
   - Check environment variables are set

4. **Database Connection Issues**
   - Verify MONGODB_URI is correct
   - Check database user permissions

## 📈 Post-Launch Monitoring

Monitor these metrics:
- Payment success rate
- Webhook delivery success
- API response times
- Error rates in logs

## 🔄 Rollback Plan

If issues occur:
1. Keep old deployment running
2. Check logs for specific errors
3. Fix environment variables first
4. Redeploy with fixes
5. Test thoroughly before switching

---

**🎉 Once configured, your payment integration will be live and ready to accept donations!**
