import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startTestEnvironment, teardownTestDatabase } from "prisma/vitest-environment-prisma/setup";
describe("Refresh Token (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
    await startTestEnvironment();
  });
  afterAll(async () => {
    await app.close();
    await teardownTestDatabase();
  });
  it("should be able to refresh a token", async () => {
    await request(app.server).post("/users").send({
      name: "cako",
      email: "cako@gmail.com",
      password: "123456",
    });
    const authResponse = await request(app.server).post("/sessions").send({
      email: "cako@gmail.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
