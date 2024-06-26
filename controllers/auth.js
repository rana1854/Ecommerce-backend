import Todo from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import cookies from 'cookie-parser'
import dotenv from "dotenv";
dotenv.config();


// SignUp Api

export const singUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
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
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                })

            } else {
                const token = jwt.sign({ id: user._id, email: user.email,role:user.role }, process.env.PRIVATE_KEY, { expiresIn: "1hr" })
                //set in cookies
                res.cookie("token", token)
                res.status(200).json({
                    success: true,
                    message: "login successfully",
                    token
                });
            }

        }

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
};


//logout api

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({
            success: true,
            message: "you are succeffully logout"
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}