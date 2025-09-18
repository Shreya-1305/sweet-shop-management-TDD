const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock User.create, bcrypt.hash, and jwt.sign
jest.mock("../../models/userModel", () => ({
  create: jest.fn(),
}));
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("Auth - Register Route (Unit Tests)", () => {
  afterEach(() => jest.clearAllMocks());

  it("registers a new user and returns token", async () => {
    const newUser = {
      name: "Shreya",
      email: "shreya@example.com",
      password: "password123",
    };

    // Mock hashed password
    bcrypt.hash.mockResolvedValue("hashedPassword123");

    // Mock User.create to return the user object
    User.create.mockResolvedValue({
      _id: "123",
      ...newUser,
      password: "hashedPassword123",
      role: "user",
    });

    // Mock JWT token
    jwt.sign.mockReturnValue("mockToken123");

    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body.user).toHaveProperty("_id", "123");
    expect(res.body.user).toHaveProperty("role", "user");
    expect(res.body).toHaveProperty("token", "mockToken123");

    expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10);
    expect(User.create).toHaveBeenCalledWith({
      name: newUser.name,
      email: newUser.email,
      password: "hashedPassword123",
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "123", email: newUser.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  it("should return 400 if email already exists", async () => {
    const newUser = {
      name: "Shreya",
      email: "shreya@example.com",
      password: "password123",
    };

    const error = new Error();
    error.code = 11000; // Mongo duplicate key error
    User.create.mockRejectedValue(error);

    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Email already exists");
  });

  it("should return 400 if required fields are missing", async () => {
    const incompleteUser = { email: "shreya@example.com" };

    const res = await request(app)
      .post("/api/auth/register")
      .send(incompleteUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 500 for server errors", async () => {
    const newUser = {
      name: "Shreya",
      email: "shreya@example.com",
      password: "password123",
    };
    const error = new Error("Database is down");
    User.create.mockRejectedValue(error);

    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
