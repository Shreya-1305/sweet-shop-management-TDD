const request = require("supertest");
const app = require("../../app.js");
const Sweet = require("../../models/sweetModel.js");
const jwt = require("jsonwebtoken");

// Mock Sweet model & JWT
jest.mock("../../models/sweetModel.js", () => ({
  create: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("POST /api/sweets - Add Sweet (Admin only)", () => {
  afterEach(() => jest.clearAllMocks());

  const token = "validToken123";

  it("should add a new sweet successfully for admin", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });

    Sweet.create.mockResolvedValue({
      _id: "s1",
      name: "Gulab Jamun",
      category: "Fried",
      price: 50,
      quantity: 100,
    });

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gulab Jamun",
        category: "Fried",
        price: 50,
        quantity: 100,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("sweet");
    expect(res.body.sweet).toHaveProperty("name", "Gulab Jamun");
    expect(Sweet.create).toHaveBeenCalledWith({
      name: "Gulab Jamun",
      category: "Fried",
      price: 50,
      quantity: 100,
    });
  });

  it("should return 403 if non-admin user tries to add sweet", async () => {
    jwt.verify.mockReturnValue({ id: "u2", role: "user" });

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ladoo",
        category: "Sugar-based",
        price: 30,
        quantity: 50,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden: Admin only");
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app).post("/api/sweets").send({
      name: "Barfi",
      category: "Barfi",
      price: 80,
      quantity: 50,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", "Bearer invalidToken")
      .send({
        name: "Jalebi",
        category: "Sugar-based",
        price: 40,
        quantity: 20,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });
});
