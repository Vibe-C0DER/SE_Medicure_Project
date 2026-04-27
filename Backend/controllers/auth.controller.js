import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../errors/error.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import sendEmail from '../utils/email.js';

const client = new OAuth2Client();

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    if (!email || !password || !firstName || !lastName) {
      return next(errorHandler(400, 'First name, last name, email and password are required'));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();
    const userObj = newUser.toObject ? newUser.toObject() : newUser._doc || {};
    const { password: _p, ...rest } = userObj;
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: {
        user: rest,
      },
    });
  } catch (error) {
    // Handle duplicate email nicely instead of raw 500
    if (error.code === 11000 && error.keyPattern?.email) {
      return next(errorHandler(400, 'An account with this email already exists'));
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return next(errorHandler(400, 'Email and password are required'));
    }
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(401, 'Invalid email or password'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Invalid email or password'));

    if (!process.env.JWT_SECRET) {
      return next(
        errorHandler(500, 'JWT secret is not configured on the server. Set JWT_SECRET in .env.')
      );
    }

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role || 'user' },
      process.env.JWT_SECRET
    );
    const userObj = validUser.toObject ? validUser.toObject() : validUser._doc || {};
    const { password: _p, ...rest } = userObj;
    res
      .cookie('access_token', token, { 
          httpOnly: true, 
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
          secure: process.env.NODE_ENV === 'production'
      })
      .status(200)
      .json({
        success: true,
        message: 'Signed in successfully',
        data: {
          user: rest,
          token,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential, access_token } = req.body;
    
    let email, name, picture;

    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else if (access_token) {
      const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const data = await resp.json();
      if (!resp.ok) {
        return next(errorHandler(400, 'Invalid Google access token'));
      }
      email = data.email;
      name = data.name;
      picture = data.picture;
    } else {
      return next(errorHandler(400, 'Google credential token is required'));
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user, generating a secure random password since they login via Auth
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      const firstName = name.split(' ')[0] || name;
      const lastName = name.split(' ').slice(1).join(' ') || '';

      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        avatar: picture,
      });
      await user.save();
    } else {
      // User exists. Update avatar if missing so the frontend correctly shows it
      if (!user.avatar && picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET
    );
    const userObj = user.toObject ? user.toObject() : user._doc || {};
    const { password: _p, ...rest } = userObj;
    
    res
      .cookie('access_token', token, { 
          httpOnly: true, 
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
          secure: process.env.NODE_ENV === 'production'
      })
      .status(200)
      .json({
        success: true,
        message: 'Signed in with Google successfully',
        data: {
          user: rest,
          token,
        },
      });
  } catch (error) {
    console.error('Google Auth Error:', error);
    next(errorHandler(401, 'Google authentication failed or token is invalid'));
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(errorHandler(400, 'Please provide an email'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal if user exists or not, but return success to avoid enumeration
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate plain random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before saving it to DB
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Expires in 15 minutes
    
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) requested a password reset. \n\nPlease go to this link to reset your password:\n\n${resetUrl}`;
    const htmlMessage = `
      <div style="font-family: sans-serif; max-w-md: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #db2777;">Password Reset</h2>
        <p>You are receiving this email because you (or someone else) requested a password reset for your MediCure account.</p>
        <p>Please click the button below to reset your password. This link is valid for 15 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #db2777; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">Reset Password</a>
        <p style="margin-top: 24px; font-size: 12px; color: #666;">If you did not request this, please safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'MediCure Password Reset',
        message: message,
        html: htmlMessage,
      });

      res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Email Error:', err);
      return next(errorHandler(500, 'There was an error sending the reset email. Please try again later.'));
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return next(errorHandler(400, 'A new password of at least 8 characters is required'));
    }

    // Hash incoming plaintext token to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // Ensure it's not expired
    });

    if (!user) {
      return next(errorHandler(400, 'Password reset token is invalid or has expired'));
    }

    // Update password
    user.password = bcryptjs.hashSync(password, 10);
    // Clear out reset tokens from document
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Your password has been successfully reset.' });
  } catch (error) {
    next(error);
  }
};



