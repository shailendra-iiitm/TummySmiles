const nodemailer = require('nodemailer');

// Create transporter with Gmail (you can change this to your preferred email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your app password
    }
  });
};

// Send registration welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🍽️ Welcome to TummySmiles - Start Spreading Joy!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f97316 0%, #ef4444 100%); color: white; padding: 40px 20px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 32px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🍽️ TummySmiles</h1>
            <p style="font-size: 18px; margin: 10px 0; opacity: 0.9;">Spreading joy through food, one meal at a time</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #fff; margin-top: 0;">Welcome aboard, ${userName}! 🎉</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for joining our community of food heroes! You're now part of a movement that's fighting hunger and reducing food waste across the globe.
            </p>
            
            <div style="margin: 25px 0;">
              <h3 style="color: #fff; margin-bottom: 15px;">What you can do now:</h3>
              <ul style="font-size: 15px; line-height: 1.8;">
                <li>🍲 Share your extra food with those in need</li>
                <li>🚗 Become a delivery agent and spread happiness</li>
                <li>📊 Track your impact on the community</li>
                <li>🤝 Connect with local restaurants and partners</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://tummysmiles.vercel.app/login" style="background: #fff; color: #f97316; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                Get Started Now 🚀
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 14px; opacity: 0.8;">
            <p>Need help? Contact us at support@tummysmiles.com</p>
            <p>© 2025 TummySmiles. Made with ❤️ for humanity</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', userEmail);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send support ticket confirmation email
const sendTicketConfirmationEmail = async (userEmail, userName, ticketId, subject) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎫 Support Ticket Created - ${ticketId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px;">🎫 Support Ticket Created</h1>
            <p style="margin: 10px 0; opacity: 0.9;">We've received your request and will help you soon!</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName},</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for contacting TummySmiles support. Your ticket has been created successfully and our team will review it shortly.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6; margin: 20px 0;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0;">Ticket Details:</h3>
              <p style="margin: 5px 0;"><strong>Ticket ID:</strong> <span style="color: #8b5cf6; font-family: monospace;">${ticketId}</span></p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f59e0b;">Open</span></p>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1e40af; margin: 0 0 10px 0;">💡 What happens next?</h4>
              <ul style="color: #1e3a8a; margin: 10px 0; padding-left: 20px;">
                <li>Our support team will review your ticket within 24 hours</li>
                <li>You'll receive email updates when the status changes</li>
                <li>You can track your ticket status anytime using the ticket ID</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://tummysmiles.vercel.app/contact?track=${ticketId}" style="background: #8b5cf6; color: white; padding: 12px 25px; border-radius: 20px; text-decoration: none; font-weight: bold; display: inline-block;">
                Track Your Ticket 🔍
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>Need immediate assistance? Reply to this email or contact us at support@tummysmiles.com</p>
            <p>© 2025 TummySmiles Support Team</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Ticket confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('Error sending ticket confirmation email:', error);
    return false;
  }
};

// Send support ticket status update email
const sendTicketStatusUpdateEmail = async (userEmail, userName, ticketId, subject, oldStatus, newStatus, comment = '') => {
  try {
    const transporter = createTransporter();
    
    const getStatusColor = (status) => {
      switch (status) {
        case 'open': return '#f59e0b';
        case 'in_progress': return '#06b6d4';
        case 'under_review': return '#8b5cf6';
        case 'resolved': return '#10b981';
        case 'closed': return '#6b7280';
        default: return '#6b7280';
      }
    };

    const getStatusEmoji = (status) => {
      switch (status) {
        case 'open': return '🔓';
        case 'in_progress': return '⏳';
        case 'under_review': return '🔍';
        case 'resolved': return '✅';
        case 'closed': return '🔒';
        default: return '📋';
      }
    };
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🔄 Ticket Update - ${ticketId} | Status: ${newStatus.replace('_', ' ').toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px;">🔄 Ticket Status Updated</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Your support ticket has been updated</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName},</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Great news! Your support ticket has been updated. Here are the details:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0;">Ticket Information:</h3>
              <p style="margin: 8px 0;"><strong>Ticket ID:</strong> <span style="color: #059669; font-family: monospace;">${ticketId}</span></p>
              <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
              
              <div style="display: flex; align-items: center; margin: 15px 0; padding: 10px; background: #f3f4f6; border-radius: 6px;">
                <span style="margin-right: 10px;">Status Update:</span>
                <span style="background: ${getStatusColor(oldStatus)}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-right: 10px;">
                  ${getStatusEmoji(oldStatus)} ${oldStatus.replace('_', ' ').toUpperCase()}
                </span>
                <span style="margin: 0 10px;">→</span>
                <span style="background: ${getStatusColor(newStatus)}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                  ${getStatusEmoji(newStatus)} ${newStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            ${comment ? `
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1e40af; margin: 0 0 10px 0;">💬 Comment from Support Team:</h4>
              <p style="color: #1e3a8a; font-style: italic; line-height: 1.6; margin: 0;">"${comment}"</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://tummysmiles.vercel.app/contact?track=${ticketId}" style="background: #10b981; color: white; padding: 12px 25px; border-radius: 20px; text-decoration: none; font-weight: bold; display: inline-block;">
                View Full Ticket 🔍
              </a>
            </div>
            
            ${newStatus === 'resolved' ? `
            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; border: 2px solid #10b981; margin: 20px 0; text-align: center;">
              <h3 style="color: #065f46; margin: 0 0 10px 0;">🎉 Issue Resolved!</h3>
              <p style="color: #064e3b; margin: 0;">
                We're happy to let you know that your issue has been resolved! If you need any further assistance, please don't hesitate to create a new ticket.
              </p>
            </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px;">
            <p>Questions about this update? Reply to this email or contact support@tummysmiles.com</p>
            <p>© 2025 TummySmiles Support Team</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Status update email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('Error sending status update email:', error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendTicketConfirmationEmail,
  sendTicketStatusUpdateEmail
};
