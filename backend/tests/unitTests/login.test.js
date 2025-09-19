const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock User model, bcrypt, and jwt
jest.mock("../../models/userModel", () => ({
  findOne: jest.fn(),
}));
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("Auth - Login Route (Unit Tests)", () => {
  afterEach(() => jest.clearAllMocks());

  it("should login successfully and return token", async () => {
    const user = {
      _id: "123",
      name: "Shreya",
      email: "shreya@example.com",
      password: "hashedPassword123",
      role: "user",
    };

    // Mock DB and bcrypt
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken123");

    const res = await request(app).post("/api/auth/login").send({
      email: "shreya@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body.user).toHaveProperty("_id", "123");
    expect(res.body.user).toHaveProperty("email", "shreya@example.com");
    expect(res.body).toHaveProperty("token", "mockToken123");
  });

  it("should return 400 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "shreya@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });

  it("should return 400 if password is incorrect", async () => {
    const user = {
      _id: "123",
      name: "Shreya",
      email: "shreya@example.com",
      password: "hashedPassword123",
      role: "user",
    };
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post("/api/auth/login").send({
      email: "shreya@example.com",
      password: "wrongPassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });

  it("should return 500 for server errors", async () => {
    User.findOne.mockRejectedValue(new Error("Server error"));

    const res = await request(app).post("/api/auth/login").send({
      email: "shreya@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });

  it("should return 400 if email or password is missing", async () => {
    // Missing email
    let res = await request(app).post("/api/auth/login").send({
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "All fields are required");

    // Missing password
    res = await request(app).post("/api/auth/login").send({
      email: "shreya@example.com",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "All fields are required");

    // Missing both
    res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "All fields are required");
  });
});
