const request = require("supertest");
const nodemailer = require("nodemailer");

const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

jest.mock("nodemailer");

const transport = {
  sendMail: jest.fn()
};

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  //executa antes de qualquer coisa
  beforeAll(() => {
    nodemailer.createTransport.mockReturnValue(transport);
  });

  it("should be able to authenticate with valid credentials", async () => {
    const user = await factory.create("User", {
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
    const user = await factory.create("User", {
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

  it("Should return a jwt token when authenticated", async () => {
    const user = await factory.create("User", {
      password: "123456"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123456"
      });

    expect(response.body).toHaveProperty("token");
  });

  it("shoud be able to access private routes when authenticated", async () => {
    const user = await factory.create("User");

    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it("Should not be able to access private routes when not authenticated", async () => {
    const response = await request(app).get("/dashboard");

    expect(response.status).toBe(401);
  });

  it("Should not be able to access private routes with invalid token", async () => {
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `bearer 123456`);

    expect(response.status).toBe(401);
  });

  it("Should recive email notification when authenticated", async () => {
    const user = await factory.create("User", {
      password: "123456"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: "123456"
      });
    expect(transport.sendMail).toHaveBeenCalledTimes(1);
    //se queres ver mas detalhes da funcao, ai pegamos a primeira chamada, o 1 parametro e nome da propriedade
    expect(transport.sendMail.mock.calls[0][0].to).toBe(
      `${user.name} <${user.email}>`
    );
  });
});
