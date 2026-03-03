import nodemailer from 'nodemailer';

export const sendAdminRequestEmail = async (userDetails) => {
    try {
        const { username, fullname, email, phone, address } = userDetails;

        // Configure the transporter. 
        // Note: The user still needs to provide the real USER and PASS in .env
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
                <p>To approve this request, log in to your database or Admin Dashboard and change the <code>admin</code> boolean to <code>true</code> for this user.</p>
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
