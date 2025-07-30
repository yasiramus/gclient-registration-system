// expiration date for verification codes
export const generateExpirationDate = (hours = 24, minutes = 0): Date => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    return expiresAt;
};