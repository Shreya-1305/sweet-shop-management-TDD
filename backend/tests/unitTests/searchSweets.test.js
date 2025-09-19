const request = require("supertest");
const app = require("../../app.js");
const Sweet = require("../../models/sweetModel.js");
const jwt = require("jsonwebtoken");

// Mock Sweet model & JWT
jest.mock("../../models/sweetModel.js", () => ({
  find: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("GET /api/sweets/search - Search Sweets ", () => {
  afterEach(() => jest.clearAllMocks());

  const token = "validToken123";
  const userPayload = { id: "u1", role: "user" };

  it("should return sweets matching name", async () => {
    jwt.verify.mockReturnValue(userPayload);
    const mockSweets = [
      {
        _id: "s1",
        name: "Gulab Jamun",
        category: "Fried",
        price: 50,
        quantity: 100,
      },
    ];
    Sweet.find.mockResolvedValue(mockSweets);

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ name: "Gulab Jamun" });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets).toHaveLength(1);
    expect(res.body.sweets[0].name).toContain("Gulab Jamun");
  });

  it("should return sweets matching category", async () => {
    jwt.verify.mockReturnValue(userPayload);
    const mockSweets = [
      {
        _id: "s2",
        name: "Rasgulla",
        category: "Milk-based",
        price: 30,
        quantity: 50,
      },
    ];
    Sweet.find.mockResolvedValue(mockSweets);

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ category: "Milk-based" });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets[0].category).toBe("Milk-based");
  });

  it("should return sweets within price range", async () => {
    jwt.verify.mockReturnValue(userPayload);
    const mockSweets = [
      { _id: "s1", name: "Ladoo", category: "Ladoo", price: 20, quantity: 10 },
    ];
    Sweet.find.mockResolvedValue(mockSweets);

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ minPrice: 10, maxPrice: 25 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets[0].price).toBeGreaterThanOrEqual(10);
    expect(res.body.sweets[0].price).toBeLessThanOrEqual(25);
  });

  it("should return empty array if no sweets match", async () => {
    jwt.verify.mockReturnValue(userPayload);
    Sweet.find.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ name: "Nonexistent" });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets).toEqual([]);
  });

  it("should return 400 for invalid price range", async () => {
    jwt.verify.mockReturnValue(userPayload);

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ minPrice: 50, maxPrice: 10 }); // minPrice > maxPrice

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid price range");
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app)
      .get("/api/sweets/search")
      .query({ name: "Gulab" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", "Bearer invalidToken")
      .query({ name: "Gulab" });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should return 500 if DB fails", async () => {
    jwt.verify.mockReturnValue(userPayload);
    Sweet.find.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .get("/api/sweets/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ name: "Gulab" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
