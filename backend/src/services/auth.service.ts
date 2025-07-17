import { prisma } from "../db/client";
import { IUser } from "../interfaces/user.int";
import { generateOTP } from "../utils/generateOtp";
import { generateToken } from "../utils/generateToken";
import { compareHashPassword, hashPassword } from "../utils/hashPassword";

/**
 * Register a new user in the system.
 * @param user - The user data to register
 * @returns The newly created user data
 * @throws Error if the user already exists or if there is an error hashing the password
 */
export const registerAUser = async (user: IUser) => {
    const { firstName, lastName, email, password, role } = user;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    //user exit
    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await hashPassword(password); //hash password

    if (!passwordHash) {
        throw new Error("Error hashing password");
    }

    const otpCode = generateOTP();

    console.log("Generated OTP:", otpCode);

    //add user to db
    const newUser = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            passwordHash,
            otp: otpCode,
            role: role,
        },
    });

    return {
        id: newUser.id, email: newUser.email, otp: newUser.otp, role: newUser.role
    };
};

/**
 * Log in a user and generate a JWT token.
 * @param user - The user data to log in
 * @returns An object containing the user's ID and JWT token
 * @throws Error if the user does not exist or if the password is incorrect
 */
export const logIn = async (user: IUser) => {
    const { email, password } = user;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser || !existingUser.passwordHash) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await compareHashPassword(
        password,
        existingUser.passwordHash
    );
    if (!isMatch) {
        throw new Error("Invalid password credentials");
    }

    const token = generateToken(existingUser.id, existingUser.role);

    if (!token) {
        throw new Error("Error generating token");
    }

    return {
        id: existingUser.id,
        token,
    };
};
