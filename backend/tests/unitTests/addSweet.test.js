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

describe("POST /api/sweets - Add Sweet (Access denied)", () => {
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
    expect(res.body).toHaveProperty("error", "Forbidden: Access denied");
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
  it("should return 400 if any required field is missing", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });

    const testCases = [
      { category: "Fried", price: 50, quantity: 10 }, // missing name
      { name: "Ladoo", price: 30, quantity: 5 }, // missing category
      { name: "Barfi", category: "Barfi", quantity: 10 }, // missing price
      { name: "Jalebi", category: "Sugar-based", price: 20 }, // missing quantity
    ];

    for (const payload of testCases) {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    }
  });

  it("should return 400 if price or quantity is negative", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });

    const testCases = [
      { name: "Rasgulla", category: "Milk-based", price: -10, quantity: 10 },
      {
        name: "Kaju Katli",
        category: "Dry Fruits-based",
        price: 50,
        quantity: -5,
      },
    ];

    for (const payload of testCases) {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    }
  });

  it("should return 400 if price or quantity is not a number", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });

    const testCases = [
      { name: "Rasgulla", category: "Milk-based", price: "abc", quantity: 10 },
      {
        name: "Kaju Katli",
        category: "Dry Fruits-based",
        price: 50,
        quantity: "ten",
      },
    ];

    for (const payload of testCases) {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    }
  });

  it("should return 400 if category is invalid", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Unknown Sweet",
        category: "InvalidCategory",
        price: 50,
        quantity: 10,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid category");
  });

  it("should return 500 if Server fails", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });
    Sweet.create.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Kaju Katli",
        category: "Dry Fruits-based",
        price: 120,
        quantity: 10,
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
