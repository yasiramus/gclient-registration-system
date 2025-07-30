"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpirationDate = void 0;
// expiration date for verification codes
const generateExpirationDate = (hours = 24, minutes = 0) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    return expiresAt;
};
exports.generateExpirationDate = generateExpirationDate;
