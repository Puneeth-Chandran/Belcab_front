import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from '../models/user.js'
import ErrorHandler from "../utils/errorhandler.js";
import sendToken from "../utils/sendToken.js";


//Register user => /api/bel/register
export const registerUser = catchAsyncErrors(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
    }

    // Create new user
    const user = await User.create({ 
        name,
        email,
        password });

   sendToken(user, 201, res);
});

//Login user =>/api/bel/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Find user in the database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Check your password and try again", 401));
    }

    sendToken(user, 201, res);

});

//Logout user => /api/bel/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()), // Correct key is 'expires'
        httpOnly: true,
        secure: process.env.NODE_ENV !== "DEVELOPMENT", // Secure only in production
        sameSite: "strict", // Helps mitigate CSRF
    });

    res.status(200).json({
        success: true, // Add success field for consistency
        message: "Logged out successfully",
    });
});







