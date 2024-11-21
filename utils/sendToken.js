// Create token and save in the cookie
export default (user, statusCode, res) => {
    // Create JWT token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000 // Convert days to milliseconds
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV !== "DEVELOPMENT", // Cookie is secure in production
        sameSite: "strict", // Protects against CSRF
    };

    // Set cookie and send response
    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            token, // Include token only if required
            message: "Authentication successful",
        });
};
