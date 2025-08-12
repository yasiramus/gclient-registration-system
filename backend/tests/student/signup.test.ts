import request from "supertest";

import app from "../../src/app";
import { testEmail, testPassword } from "../util";
import { Learner } from "../../generated/prisma";

describe("POST /", () => {
  it("should register a new student", async () => {
    const res = await request(app).post("/gclient/api/student").send({
      firstName: "New",
      lastName: "Student",
      email: testEmail,
      password: testPassword,
      confirm_password: testPassword,
    });
    console.log(res, "pp");
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Learner created");
    expect(res.body.data).toMatchObject<Learner>(res.body.data);
  });
});
