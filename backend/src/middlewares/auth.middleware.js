import HTTPError from "../utils/HttpError.js";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const validateAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return next(new HTTPError(401, "NO TOKEN PROVIDED"));

        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) return next(new HTTPError(401, "NO TOKEN PROVIDED"));

        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (!user) return next(new HTTPError(404, "user not found"));
        req.user = user;

        next();
    } catch (err) {
        next(err);
    }
};


export const allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new HTTPError(403, `Access denied. Required role: ${roles.join(' or ')}`));
        }
        next();
    };
};