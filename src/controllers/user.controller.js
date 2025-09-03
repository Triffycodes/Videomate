import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    // registration logic
    res.status(201).json({
        success: true,
        message: "User registered successfully",
    });
});

export {
    registerUser,
};
