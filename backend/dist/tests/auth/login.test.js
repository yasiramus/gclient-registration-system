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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const register_test_1 = require("./register.test");
describe("POST /api/auth/login", () => {
    it("should log in a registered admin and return token", () => __awaiter(void 0, void 0, void 0, function* () {
        // Register admin first
        yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/admin/register")
            .set("Authorization", `Bearer ${process.env.SUPER_ADMIN_TOKEN}`)
            .send({
            firstName: "Yasira",
            lastName: "Musah",
            email: register_test_1.testEmail,
            password: register_test_1.testPassword,
        });
        // Then login
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({
            email: register_test_1.testEmail,
            password: register_test_1.testPassword,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User logged successful");
        // Assert returned token and data
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("token");
        expect(typeof res.body.data.token).toBe("string");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.role).toBe("ADMIN");
    }));
});
