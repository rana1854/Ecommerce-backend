import express from 'express'
import connectionfunction from './config/connection.js'
import bodyParser from 'body-parser'
import userRouter from './routers/user.js'
import { fileURLToPath } from 'url'
import logger from 'morgan'
import dotenv from 'dotenv'
import productRouter from './routers/product.js'
import categoryRouter from './routers/category.js'
import path from 'path'
// import cookieParser from 'cookie-parser'
dotenv.config()

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use(cookieParser())
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
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