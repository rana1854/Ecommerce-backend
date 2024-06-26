import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const dburl = process.env.MongoDB_URL
const connectionfunction = async () => {
    try {
        const connection = await mongoose.connect(dburl)
        console.log("Database connected with port:", connection.connection.host)

    } catch (error) {
        console.log(error.message)

    }
}
export default connectionfunction