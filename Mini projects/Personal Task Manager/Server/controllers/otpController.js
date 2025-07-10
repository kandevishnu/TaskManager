import OTP from "../models/otpModel.js";
import nodemailer from "nodemailer";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const otpCode = generateOTP();

    // Save OTP to DB
    await OTP.create({ email, otp: otpCode });

    // Send OTP via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Task Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Task Manager OTP Code",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>👋 Welcome to Personal Task Manager!</h2>
      <p>Hi there,</p>
      <p>Thank you for signing up! You're just one step away from unlocking your productivity journey.</p>
      <p>This app helps you:</p>
      <ul>
        <li>📝 Create, update, and delete your tasks</li>
        <li>✅ Manage your to-do checklist</li>
        <li>📊 Get real-time dashboard analytics</li>
        <li>🔐 Enjoy secure login with token authentication</li>
      </ul>

      <h3 style="margin-top: 30px;">Your OTP Code:</h3>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; background: #f4f4f4; padding: 15px; display: inline-block; border-radius: 8px; border: 1px solid #ccc;">
        ${otpCode}
      </div>

      <p style="margin-top: 20px;">This OTP is valid for <strong>5 minutes</strong>.</p>

      <p>If you didn't request this, please ignore this email.</p>

      <hr />
      <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Task Manager App</p>
    </div>
  `,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const validOtp = await OTP.findOne({ email, otp });

    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await OTP.deleteMany({ email }); // Clean up old OTPs
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
