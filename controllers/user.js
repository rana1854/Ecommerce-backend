import userModel from '../models/user.js'
import bcrypt from 'bcrypt'

// Create Api
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const image = req.file.path;
        console.log("Image Path: ", image);
        const isEmailExisted = await userModel.findOne({ email });

        //hsah passowrd
        const hashedpassword = await bcrypt.hash(password, 10)
        if (isEmailExisted) {
            res.json({
                success: false,
                message: "Email already Existed",
            });

        } else {
            const user = new userModel({
                name,
                email,
                password: hashedpassword,
                image,
            });
            await user.save();
            console.log("User Created: ", user); 
            res.status(200).json({
                success: true,
                message: "user created successfully",
            });
        }
    } catch (error) {
        res.status(500).json(error.message);

    }
};


// get all user Api

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}


//Get SingleUser Api
export const singleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            })
        } else {
            res.status(200).json({
                success: true,
                user
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
}


//Delete Api

export const deleteUsers = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await userModel.findByIdAndDelete(userId)
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "user deleted successfully",
            deletedUser
        });
    } catch (error) {
        res.status(500).json(error.message)
    }
}


//Update Api
export const updateUser = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.params.id;
        const user = await userModel.findByIdAndUpdate(userId, data, { new: true })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Data Updated Successfully",
            user
        })


    } catch (error) {
        return res.status(500).json(error.message)

    }
};

//update user password API

export const updatePassword = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id).select("+password");

        // Check if old password matches
        const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // Check if new password and confirm password match
        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

        // Update user's password
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Update User Role API
export const updateUserRole = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const userId = req.params.id;

        // Create new user data object with role updated
        const newUserData = {
            name,
            email,
            role,
        };

        // Find and update user by userId
        const user = await userModel.findByIdAndUpdate(userId, newUserData, {
            new: true,           // Return updated document
            runValidators: true, // Validate updates against model's schema
            useFindAndModify: false, // Use native findOneAndUpdate() rather than findAndModify()
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user,
        });

    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};
