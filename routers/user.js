import express from 'express'
const userRouter = express.Router()
import { forgotPassword, logOut, loginUser, resetPassword, singUp } from '../controllers/auth.js'
import { createUser, deleteUsers, getAllUsers, singleUser, updatePassword, updateUser, updateUserRole } from '../controllers/user.js';
import { authRole, authenticateUser } from '../middleware/authmiddleware.js';
import upload from '../middleware/multer.js';
//user routes 
//Mostly admin routes here
// userRouter.post("/user/:id/upload", upload.single("image"), createUser)
userRouter.post("/create-user", upload.single("image"), createUser)
userRouter.get("/admin/get-user", authenticateUser, authRole(["admin"]), getAllUsers)
userRouter.get("/single-user/:id", authenticateUser, singleUser)
userRouter.delete("/admin/delete-user/:id", authenticateUser, authRole(["admin"]), deleteUsers)
userRouter.put("/update-user/:id", authenticateUser, updateUser)
userRouter.put("/admin/updateUserRole/:id", authenticateUser, authRole("admin"), updateUserRole)

//auth routes
userRouter.post("/signUp", upload.single("image"), singUp)
userRouter.post("/signin", loginUser)
userRouter.post("/logout", logOut)
userRouter.post("/password/forgot", forgotPassword)
userRouter.put("/resetPassword/:token", resetPassword)
userRouter.put("/updatePassword", authenticateUser, updatePassword)

export default userRouter