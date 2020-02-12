const request = require("supertest");

const app = require("../../src/app");
const truncate = require("../utils/truncate");
const { User } = require("../../src/app/models");

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to authenticate with valid credentials", async () => {
    const user = await User.create({
      name: "constantino",
      email: "ngana@ngana.com",
      password: "123456"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123456"
      });

    expect(response.status).toBe(200);
  });
  it("should not be able to authenticate with invalid credentials", async () => {
    const user = await User.create({
      name: "constantino",
      email: "ngana@ngana.com",
      password: "123456"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123"
      });

    expect(response.status).toBe(401);
  });
});
