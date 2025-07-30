import request from "supertest";

import app from "../../src/app";
import { testEmail, testPassword } from "./register.test";

describe("POST /gclient/api/auth/login", () => {
  it("should log in a registered admin and return token", async () => {
    // Register admin first
    await request(app)
      .post("/gclient/api/auth/admin/register")
      .set("Authorization", `Bearer ${process.env.SUPER_ADMIN_TOKEN}`)
      .send({
        firstName: "Yasira",
        lastName: "Musah",
        email: testEmail,
        password: testPassword,
      });

    // Then login
    const res = await request(app).post("/gclient/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User logged successful");

    // Assert returned token and data
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("token");
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.role).toBe("ADMIN");
  });
});
