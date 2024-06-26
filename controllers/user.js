import Sid from '../models/user.js'
import bcrypt from 'bcrypt'

//Create Api
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExisted = await Sid.findOne({ email });

        //hsah passowrd
        const hashedpassword = await bcrypt.hash(password, 10)
        if (isEmailExisted) {
            res.json({
                success: false,
                message: "Email already Existed",
            });

        } else {
            const user = new Sid({
                name,
                email,
                password: hashedpassword,
            });
            await user.save();
            res.status(200).json({
                success: true,
                message: "user created successfully in CRUD",
            });
        }
    } catch (error) {
        res.status(500).json(error.message);

    }
};


//get all user Api

export const getAllUsers = async (req, res) => {
    try {
        const users = await Sid.find();
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
        const user = await Sid.findById(userId);
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
        const deletedUser = await Sid.findByIdAndDelete(userId)
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
        const user = await Sid.findByIdAndUpdate(userId, data, { new: true })
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
}
