import express from 'express'
import connectionfunction from './config/connection.js'
import bodyParser from 'body-parser'
import userRouter from './routers/user.js'
import nodemon from 'nodemon'
import logger from 'morgan'
import dotenv from 'dotenv'
import productRouter from './routers/product.js'
import categoryRouter from './routers/category.js'
// import cookieParser from 'cookie-parser'
dotenv.config()

const app = express();
const port = process.env.PORT;

// app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))

connectionfunction()

app.use("/api/v1", userRouter)
app.use("/api/v1", productRouter)
app.use("/api/v1", categoryRouter)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})