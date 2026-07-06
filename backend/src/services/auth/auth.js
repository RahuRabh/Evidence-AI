import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { OAuth2Client } from "google-auth-library";

import { User } from "../../models/user.js";

import { sendAuthResponse } from "../../utils/sendAuthResponse.js";
import { mailSender } from "../../utils/mailSender.js";

import crypto from "crypto";
import { hashOTP } from "../../utils/hash.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const normalizeEmail = (email) => email.trim().toLowerCase();

async function googleAuthHandler(req, res) {
  // Get authorization header
  const authHeader = req.headers["authorization"];
  // Check if the header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or malformed Authorization header" });
  }

  // Extract the token from the header
  const idToken = authHeader.split(" ")[1];
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // find or create the user
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    return sendAuthResponse(res, user, 200, "Logged in !!");
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ error: "Token verification failed" });
  }
}

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = normalizeEmail(email);

    // Find user via mail
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email " });
    }

    // Check If USER SIGNED UP VIA GOOGLE AND HAS NO PASSWORD
    if (!user.password) {
      return res.status(400).json({
        error: "This account uses Google Sign-In. Please log in via Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    return sendAuthResponse(res, user, 200, "Logged in !!");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function registerHandler(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return sendAuthResponse(res, newUser, 200, "Registered !!!");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function refreshHandler(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User profile no longer exists" });
    }
    return sendAuthResponse(res, user, 200);
  } catch (err) {
    console.error("Token refresh error", err);
    return res
      .status(401)
      .json({ error: "Invalid or expired session. Please log in again." });
  }
}

async function logoutHandler(req, res) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSit: "strict",
    });

    res.clearCookie("connect.sid");

    return res.status(200).json({
      message: "Logged out !!",
    });
  } catch (err) {
    console.err("Logout error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function forgotPasswordHandler(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "If email is registered, an OTP code has been sent.",
      });
    }

    // Limiting otp generation for 60 sec before new otp generation is requested
    const now = Date.now();
    if (user.otpLastSentAt && now - user.otpLastSentAt.getTime() < 60 * 1000) {
      return res.status(429).json({
        error: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    // Generate cryptographic secure 6-digit number
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // Persist to user recode;
    user.resetOtp = hashOTP(otpCode);
    user.resetOtpExpires = Date.now() + 600000;
    user.resetOtpAttempts = 0;
    user.otpLastSentAt = new Date();

    await user.save();

    // Execute mail worker passing the parameters
    await mailSender(user.email, otpCode);

    return res
      .status(200)
      .json({ message: "If mail is registerd, OTP code has been sent." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ error: "Interal server error" });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All input fields are required" });
    }

    // Find user matching email, active OTP, check expiration time
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP code." });
    }

    // OTP expired
    if (
      !user.resetOtp ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      return res.status(400).json({
        error: "OTP has expired. Please request new one.",
      });
    }

    // Too many attemps
    if (user.resetOtpAttempts >= 5) {
      return res.status(403).json({
        error: "Too many incorrect attemps. Request a new OTP.",
      });
    }

    // Compare hash
    if (user.resetOtp !== hashOTP(otp)) {
      const remainingAttempts = 5 - user.resetOtpAttempts;
      user.resetOtpAttempts += 1;
      await user.save();
      return res.status(400).json({
        error: `Incorrect OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? "" : "s"} remaining.`,
      });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // clear otp fields
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;
    user.otpLastSentAt = null;

    await user.save();
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export {
  googleAuthHandler,
  loginHandler,
  registerHandler,
  refreshHandler,
  logoutHandler,
  forgotPasswordHandler,
  verifyOTP,
};
