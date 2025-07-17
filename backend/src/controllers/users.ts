import { Request, Response } from "express";

import { Role } from "../../generated/prisma";
import { IUser } from "../interfaces/user.int";
import { logIn, registerAUser } from "../services/auth.service";

/**
 * Register a new admin user.
 * @param req - Express request object
 * @param res - Express response object
 */
export const registerAdmin = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        if (!data) {
            return res.status(400).json({
                message: "No data provided"
            });
        }

        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email
            || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user: IUser = {
            firstName,
            lastName, email, password,
            role: Role.ADMIN
        }

        const newUser = await registerAUser(user);
        return res.status(201).json({
            message: "Admin registered successfully",
            data: newUser
        });
    } catch (error: any) {
        console.error("Error registering admin:", error.message);
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
};

/**
 * Log in a user and return a JWT token.
 * @param req - Express request object
 * @param res - Express response object
 */
export const login = async (req: Request, res: Response) => {

    const data = req.body;

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const saveUser = await logIn(data)

        res.status(200).json({
            message: 'User logged successful',
            data: saveUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server during login' });
    }
};

