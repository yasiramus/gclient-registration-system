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
exports.testPassword = exports.testEmail = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const client_1 = require("../../src/db/client");
const prisma_1 = require("../../generated/prisma");
const timestamp = Date.now();
exports.testEmail = `admin${timestamp}@gclient.com`;
exports.testPassword = "admin1234";
describe("POST /api/auth/admin/register", () => {
    let superAdminToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client_1.prisma.$connect();
        // first login as a supper admin 
        const res = yield (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
            email: "admintest2@gclient.com",
            password: exports.testPassword
        });
        superAdminToken = res.body.data.token;
        console.log(res.body.message, superAdminToken);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client_1.prisma.user.deleteMany({
            where: {
                role: prisma_1.Role.ADMIN
            },
        });
        yield client_1.prisma.$disconnect();
    }));
    it("should register a new admin dynamically", () => __awaiter(void 0, void 0, void 0, function* () {
        // Generate a unique email for every test run
        const res = yield (0, supertest_1.default)(app_1.default).post("/api/auth/admin/register").set("Authorization", `Bearer ${superAdminToken}`).send({
            firstName: "New",
            lastName: "Admin",
            email: exports.testEmail,
            password: exports.testEmail,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Admin registered successfully");
        expect(res.body.data).toMatchObject({
            email: exports.testEmail,
            role: "ADMIN"
        });
        expect(res.body.data).toHaveProperty("otp");
    }));
    // it("should return 400 if email already exists", async () => {
    //     // First register a user
    //     await request(app).post("/api/auth/admin/register").send({
    //         firstName: "Jane",
    //         lastName: "Doe",
    //         email: "",
    //         password: "password123"
    //     });
    // })
    // it("should return 400 if email is invalid", async () => {
    //     const res = await request(app).post("/api/auth/admin/register").send({
    //         firstName: "Jane",
    //         lastName: "Doe",
    //         email: "invalid-email",
    //         password: "password123"
    //     });
    //     expect(res.statusCode).toBe(400);
    //     expect(res.body.message).toBe("Invalid email format");
    // });
    // it("should return 400 if password is too short", async () => {
    //     const res = await request(app).post("/api/auth/admin/register").send({
    //         firstName: "Jane",
    //         lastName: "Doe",
    //         email: "",
    //         password: "short"
    //     }); 
    //     expect(res.statusCode).toBe(400);
    //     expect(res.body.message).toBe("Password must be at least 8 characters long")
    // })
    // it.only('the fetch fails with an error', async () => {
    //     expect.assertions(1);
    //     try {
    //         await request(app).post("/api/auth/admin/register").send({
    //             firstName: "Jane",      
    //             lastName: "Doe",
    //             email: "invalid-email", 
    //             password: "short"
    //         });
    //     } catch (error) {
    //         expect(error).toMatch('error');
    //     }
    // });
});
