import express from 'express'
const userRouter = express.Router()
import { logOut, loginUser, singUp } from '../controllers/auth.js'
import { createUser, deleteUsers, getAllUsers, singleUser, updateUser } from '../controllers/user.js';
import { authRole, authenticateUser } from '../middleware/authmiddleware.js';
import upload from '../middleware/multer.js';
//user routes
//Mostly admin routes here
userRouter.post("/create-user",upload.single("image"), createUser)
userRouter.get("/get-user", authenticateUser, authRole(["admin"]), getAllUsers)
userRouter.get("/single-user/:id", singleUser,authenticateUser, authRole(["admin"]),)
userRouter.delete("/delete-user/:id",authenticateUser, authRole(["admin"]), deleteUsers)
userRouter.put("/update-user/:id",authenticateUser, authRole(["admin"]), updateUser)

//auth routes
userRouter.post("/signUp", singUp)
userRouter.post("/signin", loginUser)
userRouter.post("/logout", logOut)

export default userRouter