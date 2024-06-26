import express from 'express'
const userRouter = express.Router()
import { logOut, loginUser, singUp } from '../controllers/auth.js'
import { createUser, deleteUsers, getAllUsers, singleUser, updateUser } from '../controllers/user.js';
import { authRole, authenticateUser } from '../middleware/authmiddleware.js';
//user routes
userRouter.post("/create-user", createUser)
userRouter.get("/get-user", authenticateUser, authRole(["admin"]), getAllUsers)
userRouter.get("/single-user/:id", singleUser)
userRouter.delete("/delete-user/:id", deleteUsers)
userRouter.put("/update-user/:id", updateUser)

//auth routes
userRouter.post("/signUp", singUp)
userRouter.post("/signin", loginUser)
userRouter.post("/logout", logOut)

export default userRouter