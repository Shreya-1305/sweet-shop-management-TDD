jest.setTimeout(60000); // 60 seconds

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const User = require("../../models/userModel");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Auth Integration Tests", () => {
  it("should register a user and return a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Shreya",
      email: "shreya@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "shreya@example.com");
  });

  it("should login a registered user and return a token", async () => {
    // Register the user first
    await request(app).post("/api/auth/register").send({
      name: "Shreya",
      email: "shreya@example.com",
      password: "password123",
    });

    // Login
    const res = await request(app).post("/api/auth/login").send({
      email: "shreya@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "shreya@example.com");
  });
});
