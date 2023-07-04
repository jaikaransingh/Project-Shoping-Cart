const userModel = require("../models/userModel");

const JWT = require("jsonwebtoken");
const {isValidObjectId} = require("mongoose");
const {isValid} = require("../utils/validation")

require('dotenv').config();
const { JWT_SECRET } = process.env



// ======================================= AUTHENTICATION =============================================//



const isAuthenticated = async function ( req , res , next ) {
    try {
        let token = req.headers['x-api-key']; 

        if (!token) {
            return res.status(401).send({ status: false, message: "Token must be Present." });
        }

        JWT.verify( token,JWT_SECRET, function ( err , decodedToken ) {
            if (err) {

                if (err.name === 'JsonWebTokenError') {
                    return res.status(404).send({ status: false, message: "invalid token" });
                }

                if (err.name === 'TokenExpiredError') {
                    return res.status(404).send({ status: false, message: "you are logged out, login again" });
                } else {
                    return res.send({ msg: err.message });
                }
            } else {
                req.userId = decodedToken.userId
                next()
            }
        });

    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message })
    }
}



// =========================================== AUTHORISATION ===========================================//



const isAuthorized = async function ( req , res , next ) {
    try {
        const loggedUserId = req.userId;

        if (req.originalUrl === "/user") {
            let userId = req.params.userId;
            if (!isValid(userId)) {
                return res.status(400).send({ status: false, message: "userId must be in string." });
            }

            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "Invalid user id" });
            }

            const userData = await userModel.findById(userId);

            if (!userData) {
                return res.status(404).send({ status: false, message: "The user does not exist" });
            }

            if (loggedUserId != userId) {
                return res.status(403).send({ status: false, message: "Not authorized,please provide your own user id for book creation" });
            }

            req.body.userId = userId;
        }
        next();
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
module.exports = { isAuthenticated, isAuthorized };