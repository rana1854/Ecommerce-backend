import Todo from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

import dotenv from "dotenv";
dotenv.config();

// SignUp Api
export const singUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const image = req.file.path;
        const isEmailExisted = await Todo.findOne({ email });

        //hash passowrd
        const hashedpassword = await bcrypt.hash(password, 10)
        if (isEmailExisted) {
            res.json({
                success: false,
                message: "Email already Existed",
            });

        } else {
            const user = new Todo({
                name,
                email,
                password: hashedpassword,
                image
            });
            await user.save();
            res.status(200).json({
                success: true,
                message: "signUp successfully",
            });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
};

//Login Api
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Todo.findOne({ email })
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        } else {
            //compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                })
            } else {
                // Generate token
                const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.PRIVATE_KEY, { expiresIn: "1hr" });

                // Set token in cookies
                res.cookie("token", token);

                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    token
                });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Forgot Password Api
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Todo.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email does not exist"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email with reset link
        const resetURL = `http://${req.headers.host}/api/v1/reset-password/${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n`
            + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
            + `${resetURL}\n\n`
            + `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        await sendEmail(user.email, 'Password Reset Request', message);

        res.status(200).json({
            success: true,
            message: 'Password reset email has been sent'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password Api
export const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token;
        const { newPassword } = req.body;

        const user = await Todo.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout Api
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({
            success: true,
            message: "You are successfully logged out"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
