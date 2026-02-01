import { Resend } from "resend";
import { env } from "./env";

const resend = new Resend(env.server.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: env.server.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Email Templates

export function generateWelcomeEmail(name: string, username: string, location: string) {
  return {
    subject: "Welcome to FreeWiFi KE! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0066FF; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to FreeWiFi KE!</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <p>Hi ${name},</p>
          <p>Your account has been created successfully!</p>
          <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>
          <p>Ready to get connected? Order your plan now!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.client.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #0066FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p>— The FreeWiFi KE Team</p>
        </div>
      </div>
    `,
  };
}

export function generateOrderConfirmationEmail(
  name: string,
  orderId: string,
  plan: string,
  address: string,
  preferredDate: string
) {
  return {
    subject: `Order Received - #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0066FF; color: white; padding: 20px; text-align: center;">
          <h1>Order Received!</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <p>Hi ${name},</p>
          <p>We've received your installation order:</p>
          <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Location:</strong> ${address}</p>
            <p><strong>Preferred Date:</strong> ${preferredDate}</p>
          </div>
          <p>Our team will contact you shortly via WhatsApp.</p>
          <p>— FreeWiFi KE</p>
        </div>
      </div>
    `,
  };
}

export function generateAdminOrderNotification(
  customerName: string,
  phone: string,
  plan: string,
  region: string,
  subLocation: string,
  address: string,
  preferredDate: string,
  orderId: string
) {
  return {
    subject: `🆕 New Order - #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FF6600; color: white; padding: 20px;">
          <h1>New Installation Order</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <h2>Order Details</h2>
          <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Location:</strong> ${region} - ${subLocation}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Preferred Date:</strong> ${preferredDate}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.client.NEXT_PUBLIC_APP_URL}/admin/orders" 
               style="background: #0066FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              View in Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    `,
  };
}

export function generateAdminMentionNotification(
  userName: string,
  username: string,
  userEmail: string,
  location: string,
  message: string,
  timestamp: string
) {
  return {
    subject: `🚨 Customer Needs Help - ${username}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #EF4444; color: white; padding: 20px;">
          <h1>Customer Support Request</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <p>A customer has requested human support:</p>
          <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p><strong>User:</strong> ${userName} (${username})</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f9f9f9; padding: 10px; border-left: 3px solid #0066FF;">${message}</p>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.client.NEXT_PUBLIC_APP_URL}/admin/chat-logs" 
               style="background: #0066FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Respond in Dashboard
            </a>
          </div>
          <p>Or reply directly to: ${userEmail}</p>
        </div>
      </div>
    `,
  };
}

export function generateTicketNotification(
  customerName: string,
  problemType: string,
  description: string,
  urgency: string,
  ticketId: string
) {
  return {
    subject: `🎫 New Support Ticket - #${ticketId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #F59E0B; color: white; padding: 20px;">
          <h1>New Support Ticket</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Problem Type:</strong> ${problemType}</p>
            <p><strong>Urgency:</strong> <span style="color: ${urgency === 'high' ? '#EF4444' : urgency === 'medium' ? '#F59E0B' : '#10B981'};">${urgency.toUpperCase()}</span></p>
            <p><strong>Description:</strong></p>
            <p style="background: #f9f9f9; padding: 10px; border-left: 3px solid #0066FF;">${description}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.client.NEXT_PUBLIC_APP_URL}/admin/tickets" 
               style="background: #0066FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              View in Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    `,
  };
}
