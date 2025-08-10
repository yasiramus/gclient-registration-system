"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookie_session = void 0;
const cookie_session_1 = __importDefault(require("cookie-session"));
const date_1 = require("../lib/date");
exports.cookie_session = (0, cookie_session_1.default)({
    name: "admin_session",
    keys: [process.env.JWT_SECRET || "gclient_admin_keys"],
    secure: process.env.NODE_ENV === "production", //on localhost set to false
    httpOnly: true,
    // domain: "gclient.com",
    path: "/gclient/api",
    expires: (0, date_1.generateExpirationDate)(1, 0), //set to 1hour
    sameSite: "strict",
});
// errol and make payment before they can access coursees
// the learner register by themselfves
