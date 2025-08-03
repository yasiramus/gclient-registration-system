import request from "supertest";

import app from "../../src/app";
import { prisma } from "../../src/db/client";
import { Role } from "../../generated/prisma";

const timestamp = Date.now();
export const testEmail = `admin${timestamp}@gclient.com`;
export const testPassword = "admin1234";

describe("POST /gclient/api/auth/admin/register", () => {
  let superAdminToken: string;

  beforeAll(async () => {
    await prisma.$connect();

    // first login as a supper admin
    const res = await request(app).post("/gclient/api/auth/login").send({
      email: "admin@gclient.com",
      password: testPassword,
    });

    superAdminToken = res.body.data.token;
    console.log(res.body.message, superAdminToken, "loin_super_admin");
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({
      where: {
        role: Role.ADMIN,
      },
    });

    await prisma.$disconnect();
  });

  it("should register a new admin dynamically", async () => {
    // Generate a unique email for every test run
    const res = await request(app)
      .post("/gclient/api/auth/admin/register")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({
        firstName: "New",
        lastName: "Admin",
        email: testEmail,
        password: testEmail,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe(
      "Admin Registration completed. Check your email to verify."
    );
    expect(res.body.data).toMatchObject({
      email: testEmail,
      role: "ADMIN",
    });
    expect(res.body.data).toHaveProperty("email");
  });

  // it("should return 400 if email already exists", async () => {
  //     // First register a admin
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
