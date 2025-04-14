import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sentMail = async (email, otp) => {
  const mailOptions = {
    from: `"GameShop Support" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Code for GameShop",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto;">
            <tr>
            <td align="center" style="padding: 20px 0;">
                <h2 style="color: #0073e6; margin: 0;">Your OTP Code for GameShop</h2>
            </td>
            </tr>
            <tr>
            <td style="background-color: #f4f4f4; padding: 30px; border-radius: 8px;">
                <p style="font-size: 18px; margin: 0 0 10px;">Hello,</p>
                <p style="font-size: 16px; margin: 0 0 20px;">
                Thank you for requesting an OTP for your GameShop account. Your one-time password (OTP) is:
                </p>
                <div style="background-color: #0073e6; color: white; font-size: 24px; padding: 12px 20px; text-align: center; border-radius: 5px; margin: 20px auto; width: fit-content;">
                ${otp}
                </div>
                <p style="font-size: 16px; margin: 20px 0;">
                This OTP will expire in 5 minutes. Please use it to complete your verification process.
                </p>
                <p style="font-size: 16px; margin: 0 0 20px;">
                If you did not request this OTP, please ignore this email.
                </p>
                <p style="font-size: 14px; color: #888; margin: 0;">
                Best regards,<br />
                GameShop Support Team
                </p>
            </td>
            </tr>
        </table>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
