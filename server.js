// AagniChain Backend Server (Vercel-compatible)

// 1. Only load dotenv locally, not on Vercel
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

// 2. Setup the server
const app = express();
app.use(cors());
app.use(express.json());

// 3. Configure the Email Service
const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL;

// 4. Health check route (fixes "Cannot GET /")
const path = require('path');

// Add this route BEFORE your other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'aagnichain-landing.html'));
});

// 5. Reusable Email Sending Function
const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: [to],
            reply_to: REPLY_TO_EMAIL,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error(`❌ Resend Error for ${to}:`, JSON.stringify(error, null, 2));
            return { error };
        }

        console.log(`✅ Email sent to ${to}:`, data);
        return { data };
    } catch (error) {
        console.error('❌ Catch Block Error:', error);
        return { error: 'Something went wrong on our end.' };
    }
};

// 6. Farmer Registration Endpoint
app.post('/register-farmer', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const subject = 'Thank You for Registering with AagniChain! 🙏';
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello,</h2>
            <p>Thank you for registering your interest in AagniChain! We're thrilled to have you on board.</p>
            <p>You are now on our exclusive pre-launch list. We will notify you as soon as we launch in your area.</p>
            <p>Together, we can turn Parali into a goldmine and build a cleaner, wealthier, and healthier India.</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>The AagniChain Team</strong></p>
        </div>
    `;

    const { data, error } = await sendEmail({ to: email, subject, html });
    if (error) return res.status(400).json({ error });
    res.status(200).json({ success: true, message: 'Confirmation email sent successfully!' });
});

// 7. Business Registration Endpoint
app.post('/register-business', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const subject = 'Your Partnership Inquiry with AagniChain';
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello,</h2>
            <p>Thank you for your interest in partnering with AagniChain!</p>
            <p>We have received your inquiry and our partnership team will reach out within 48 hours.</p>
            <p>We look forward to exploring how we can collaborate to meet your ESG goals.</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>The AagniChain Partnership Team</strong></p>
        </div>
    `;

    const { data, error } = await sendEmail({ to: email, subject, html });
    if (error) return res.status(400).json({ error });
    res.status(200).json({ success: true, message: 'Inquiry confirmation sent successfully!' });
});

// 8. Export for Vercel (replaces app.listen)
module.exports = app;
