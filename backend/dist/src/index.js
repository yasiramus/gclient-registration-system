"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const Port = 4000;
app_1.default.disable("x-powered-by"); // may discourage a casual exploit
app_1.default.listen(Port, () => {
    console.log(`Server is running on Port: ${Port}`);
});
