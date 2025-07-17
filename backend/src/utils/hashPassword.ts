import bcrypt from "bcrypt";

/**
 * Hashes a password using bcrypt with a specified number of salt rounds.
 * @param data - The password to hash
 * @returns A promise that resolves to the hashed password
 */
export const hashPassword = async (data: string) => {
    const saltRounds = 10;
    return await bcrypt.genSalt(saltRounds).then(salt => bcrypt.hash(data, salt))
};

/**
 * Compares a plain text password with a hashed password.
 * @param plainData - The plain text password
 * @param hashed - The hashed password
 * @returns A promise that resolves to a boolean indicating if the passwords match
 */
export const compareHashPassword = async (plainData: string, hashed: string) => {
    return await bcrypt.compare(plainData, hashed);
}