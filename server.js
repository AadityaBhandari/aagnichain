// AagniChain Backend Server (Refactored)

// 1. Import necessary tools
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

// 2. Setup the server
const app = express();
app.use(cors());
app.use(express.json());

// 3. Configure the Email Service (Resend)
// API Key and email addresses are now managed via environment variables for security and flexibility.
const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_EMAIL = process.env.SENDER_EMAIL; // e.g., 'AagniChain <noreply@yourdomain.com>'
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL; // e.g., 'contact@yourdomain.com'

const PORT = 3000;

// 4. Create a Reusable Email Sending Function
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
            console.error(`❌ Resend Email Sending Error for ${to}:`, JSON.stringify(error, null, 2));
            return { error };
        }

        console.log(`✅ Email sent successfully via Resend to ${to}:`, data);
        return { data };
    } catch (error) {
        console.error('❌ Server Catch Block Error in sendEmail:', error);
        return { error: 'Something went wrong on our end.' };
    }
};

// 5. Create API Endpoint for Farmer Registration
app.post('/register-farmer', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    console.log(`✅ Received farmer registration request for: ${email}`);

    const subject = 'Thank You for Registering with AagniChain! 🙏';
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello,</h2>
            <p>Thank you for registering your interest in AagniChain! We're thrilled to have you on board.</p>
            <p>You are now on our exclusive pre-launch list. We will notify you at this email address as soon as we launch in your area.</p>
            <p>Together, we can turn Parali into a goldmine and build a cleaner, wealthier, and healthier India.</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>The AagniChain Team</strong></p>
        </div>
    `;

    const { data, error } = await sendEmail({ to: email, subject, html });

    if (error) {
        return res.status(400).json({ error });
    }
    res.status(200).json({ success: true, message: 'Confirmation email sent successfully!' });
});

// 6. Create API Endpoint for Business Registration
app.post('/register-business', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    console.log(`✅ Received business partnership request for: ${email}`);

    const subject = 'Your Partnership Inquiry with AagniChain';
    const html = `
         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello,</h2>
            <p>Thank you for your interest in partnering with AagniChain to build a sustainable future.</p>
            <p>We have received your inquiry and a member of our partnership team will reach out to you at this email address within the next 48 hours to discuss potential synergies.</p>
            <p>We look forward to exploring how we can collaborate to meet your ESG goals and empower local communities.</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>The AagniChain Partnership Team</strong></p>
        </div>
    `;

    const { data, error } = await sendEmail({ to: email, subject, html });

    if (error) {
        return res.status(400).json({ error });
    }
    res.status(200).json({ success: true, message: 'Inquiry confirmation sent successfully!' });
});

// 7. Start the server
app.listen(PORT, () => {
    console.log(`✅ AagniChain backend server is running on http://localhost:${PORT}`);
    console.log('Waiting for registration requests...');
});
