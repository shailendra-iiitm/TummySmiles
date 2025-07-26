const crypto = require('crypto');
const MoneyDonation = require('../models/MoneyDonation');

const handleRazorpayWebhook = async (req, res) => {
  try {
    // Get the raw body
    const body = JSON.stringify(req.body);
    
    // Get signature from headers
    const signature = req.get('X-Razorpay-Signature');
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.log('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Webhook event received:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      
      case 'payment.authorized':
        console.log('Payment authorized:', event.payload.payment.entity.id);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

const handlePaymentCaptured = async (payment) => {
  try {
    console.log('Processing payment captured:', payment.id);
    
    const donation = await MoneyDonation.findOne({
      razorpayOrderId: payment.order_id
    });

    if (!donation) {
      console.log('Donation not found for order:', payment.order_id);
      return;
    }

    // Update donation status
    donation.paymentStatus = 'completed';
    donation.razorpayPaymentId = payment.id;
    donation.paymentMethod = payment.method;
    donation.paidAt = new Date();

    await donation.save();
    console.log('Donation updated successfully:', donation._id);
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

const handlePaymentFailed = async (payment) => {
  try {
    console.log('Processing payment failed:', payment.id);
    
    const donation = await MoneyDonation.findOne({
      razorpayOrderId: payment.order_id
    });

    if (!donation) {
      console.log('Donation not found for order:', payment.order_id);
      return;
    }

    // Update donation status
    donation.paymentStatus = 'failed';
    donation.failureReason = payment.error_description || 'Payment failed';

    await donation.save();
    console.log('Donation failure recorded:', donation._id);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

module.exports = {
  handleRazorpayWebhook
};
