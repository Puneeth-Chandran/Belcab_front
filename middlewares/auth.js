import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/user.js";

// Check if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    // Extract token from cookies or headers
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new ErrorHandler("You need to log in to access this resource", 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validate decoded data and fetch user
        if (!decoded.id) {
            return next(new ErrorHandler("Invalid token, please log in again", 401));
        }

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler("No user found with this token, please log in again", 401));
        }

        next();
    } catch (err) {
        return next(new ErrorHandler("Invalid or expired token, please log in again", 401));
    }
});

//Authorize user roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Ensure req.user and req.user.role exist
        if (!req.user) {
            return next(new ErrorHandler("User information is missing. Please log in again.", 401));
        }

        // Check if the user's role is authorized
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler("You are not authorized for this action.", 403));
        }

        next();
    };
};

