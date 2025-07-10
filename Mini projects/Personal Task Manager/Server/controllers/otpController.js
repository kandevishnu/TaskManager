import OTP from "../models/otpModel.js";
import nodemailer from "nodemailer";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`,
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
