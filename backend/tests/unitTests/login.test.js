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

  // 1️⃣ Success scenario
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
});
