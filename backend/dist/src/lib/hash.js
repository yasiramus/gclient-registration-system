"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHashPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Hashes a password using bcrypt with a specified number of salt rounds.
 * @param data - The password to hash
 * @returns A promise that resolves to the hashed password
 */
const hashPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return yield bcrypt_1.default.genSalt(saltRounds).then(salt => bcrypt_1.default.hash(data, salt));
});
exports.hashPassword = hashPassword;
/**
 * Compares a plain text password with a hashed password.
 * @param plainData - The plain text password
 * @param hashed - The hashed password
 * @returns A promise that resolves to a boolean indicating if the passwords match
 */
const compareHashPassword = (plainData, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(plainData, hashed);
});
exports.compareHashPassword = compareHashPassword;
