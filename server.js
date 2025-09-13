// AagniChain Backend Server
// This is the "engine" that sends real emails.

// 1. Import necessary tools
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

// 2. Setup the server
const app = express();
app.use(cors()); // Allows requests from any origin for hackathon purposes
app.use(express.json()); // Allows the server to understand JSON

// 3. Configure the Email Service (Resend)
// API Key is correctly placed here from the user's request.
const resend = new Resend('process.env.RESEND_API_KEY'); 

const PORT = 3000;

// 4. Create an API Endpoint for Farmer Registration
app.post('/register-farmer', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    console.log(`✅ Received farmer registration request for: ${email}`);
    try {
        const { data, error } = await resend.emails.send({
            // --- EMAIL 'FROM' ADDRESS UPDATED ---
            from: 'AagniChain (aagnichain2025@gmail.com) <onboarding@resend.dev>',
            to: [email],
            // --- NEW: REPLY-TO FIELD ADDED ---
            reply_to: 'aagnichain2025@gmail.com',
            subject: 'Thank You for Registering with AagniChain! 🙏',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Hello,</h2>
                    <p>Thank you for registering your interest in AagniChain! We're thrilled to have you on board.</p>
                    <p>You are now on our exclusive pre-launch list. We will notify you at this email address as soon as we launch in your area.</p>
                    <p>Together, we can turn Parali into a goldmine and build a cleaner, wealthier, and healthier India.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><strong>The AagniChain Team</strong></p>
                </div>
            `,
        });
        if (error) {
            console.error('❌ Resend Email Sending Error:', JSON.stringify(error, null, 2));
            return res.status(400).json({ error });
        }
        console.log('✅ Email sent successfully via Resend:', data);
        res.status(200).json({ success: true, message: 'Confirmation email sent successfully!' });
    } catch (error) {
        console.error('❌ Server Catch Block Error:', error);
        res.status(500).json({ error: 'Something went wrong on our end.' });
    }
});

// 5. Create an API Endpoint for Business Registration
app.post('/register-business', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    console.log(`✅ Received business partnership request for: ${email}`);
    try {
        const { data, error } = await resend.emails.send({
            // --- EMAIL 'FROM' ADDRESS UPDATED ---
            from: 'AagniChain Partnerships (aagnichain2025@gmail.com) <onboarding@resend.dev>',
            to: [email],
            // --- NEW: REPLY-TO FIELD ADDED ---
            reply_to: 'aagnichain2025@gmail.com',
            subject: 'Your Partnership Inquiry with AagniChain',
            html: `
                 <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Hello,</h2>
                    <p>Thank you for your interest in partnering with AagniChain to build a sustainable future.</p>
                    <p>We have received your inquiry and a member of our partnership team will reach out to you at this email address within the next 48 hours to discuss potential synergies.</p>
                    <p>We look forward to exploring how we can collaborate to meet your ESG goals and empower local communities.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><strong>The AagniChain Partnership Team</strong></p>
                </div>
            `,
        });
        if (error) {
            console.error('❌ Resend Business Email Sending Error:', JSON.stringify(error, null, 2));
            return res.status(400).json({ error });
        }
        console.log('✅ Business email sent successfully via Resend:', data);
        res.status(200).json({ success: true, message: 'Inquiry confirmation sent successfully!' });
    } catch (error) {
        console.error('❌ Server Catch Block Error (Business):', error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});


// 6. Start the server
app.listen(PORT, () => {
    console.log(`✅ AagniChain backend server is running on http://localhost:${PORT}`);
    console.log('Waiting for registration requests...');

});
