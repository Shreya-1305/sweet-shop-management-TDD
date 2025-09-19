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
