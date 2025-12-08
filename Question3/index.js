require('dotenv').config();
const nodemailer = require('nodemailer');
const path = require('path');

async function main() {
    // Configuration for real email sending
    // You must use an App Password if using Gmail with 2FA enabled.
    // https://support.google.com/accounts/answer/185833
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"Ritika Tiwari" <tiwariritika672@gmail.com>', // sender address
        to: 'hr@ignitershub.com', // destination
        // For testing
        //to: 'ritikatiwaryyy@gmail.com',
        subject: 'Challenge 3 Completed',
        text: 'Name: Ritika Tiwari\nSemester: 7th\nBranch: CSE\nRoll Number: 220180101039',
        html: `
            <p><b>Name:</b> Ritika Tiwari</p>
            <p><b>Semester:</b> 7th</p>
            <p><b>Branch:</b> CS</p>
            <p><b>Roll Number:</b> 220180101039</p>
        `,
        attachments: [
            {
                filename: 'test_image.png',
                path: path.join(__dirname, 'test_image.png')
            }
        ]
    };

    console.log('Sending email...');
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

main().catch(console.error);
