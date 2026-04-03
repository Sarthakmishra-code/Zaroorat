import nodemailer from 'nodemailer';

export const sendAdminRequestEmail = async (userDetails) => {
    try {
        const { username, fullname, email, phone, address } = userDetails;


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.OFFICIAL_EMAIL,
                pass: process.env.OFFICIAL_EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.OFFICIAL_EMAIL,
            to: process.env.OFFICIAL_EMAIL, // Send it to the official email
            subject: `New Admin Access Request: ${fullname}`,
            html: `
                <h2>New Admin Access Request</h2>
                <p>A new user has registered and requested Admin Access. Please review their details:</p>
                <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Full Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${fullname}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Username:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${username}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${address}</td></tr>
                </table>
                <br />
                <p>To approve this request, click the button below:</p>
                <a href="${process.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/users/approve-admin?email=${encodeURIComponent(email)}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Approve as Admin</a>
                <br /><br />
                <p>Alternatively, you can log in to your database and change the <code>admin</code> boolean to <code>true</code> for this user.</p>
                <p>Zaroorat Team</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin request email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending admin request email:', error);
        return false;
    }
};

export const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.OFFICIAL_EMAIL,
                pass: process.env.OFFICIAL_EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.OFFICIAL_EMAIL,
            to: email, 
            subject: `Your Zaroorat Registration OTP`,
            html: `
                <h2>Verify your Email</h2>
                <p>Thank you for registering with Zaroorat! Your OTP for verification is:</p>
                <h1 style="color: blue; letter-spacing: 5px;">${otp}</h1>
                <p>This OTP will expire in 10 minutes.</p>
                <br />
                <p>Zaroorat Team</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};
