const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    console.log('PaymentService constructor - Checking environment variables...');
    console.log('RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID);
    console.log('RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY credentials missing!');
      console.error('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
      console.error('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
    }
    
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount, currency = 'INR', receiptId) {
    try {
      console.log('PaymentService.createOrder called with:', { amount, currency, receiptId });
      
      // Check if Razorpay credentials are available
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay credentials not configured. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
      }
      
      // Validate inputs
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount provided');
      }
      
      if (!receiptId) {
        throw new Error('Receipt ID is required');
      }

      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: receiptId,
        payment_capture: 1 // Auto capture payment
      };

      console.log('Creating Razorpay order with options:', options);
      const order = await this.razorpay.orders.create(options);
      console.log('Razorpay order created successfully:', order);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order - Full details:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
  }

  verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error('Failed to fetch payment details');
    }
  }

  async refundPayment(paymentId, amount = null) {
    try {
      const refundOptions = {
        payment_id: paymentId,
        amount: amount ? amount * 100 : undefined // Full refund if amount not specified
      };

      const refund = await this.razorpay.payments.refund(paymentId, refundOptions);
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Failed to process refund');
    }
  }
}

module.exports = new PaymentService();
