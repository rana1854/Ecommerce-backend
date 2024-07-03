import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const authenticateUser = (req, res, next) => {
    try {
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "access denied, token invalid",
            });
        }
        jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "access denied, you are not authorized",
                });
            }
            req.user = user;
            next()

        })


    } catch (error) {
        return res.status(500).json(error.message)

    }
}


// role admin/user

export const authRole = (role) => {
    return function (req, res, next) {
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "access denied" })
        }
        jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "invalid token" });
            }
            if (!role.includes(user.role)) {
                return res.status(403).json({ message: "unauthorized access" })
            }
            req.user = user;
            next();

        });



    }
}
