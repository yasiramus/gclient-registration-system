import request from "supertest";

import app from "../src/app";

describe("Get /", () => {
  it("should return a Welcome message", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Welcome to the GClient Registration System API");
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Not found");
  });
});
