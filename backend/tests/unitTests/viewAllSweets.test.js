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

describe("GET /api/sweets - Get All Sweets (Protected)", () => {
  afterEach(() => jest.clearAllMocks());

  const token = "validToken123";
  const userPayload = { id: "u1", role: "user" };

  it("should return all sweets successfully with valid token", async () => {
    jwt.verify.mockReturnValue(userPayload);

    const mockSweets = [
      {
        _id: "s1",
        name: "Gulab Jamun",
        category: "Fried",
        price: 50,
        quantity: 100,
      },
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
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("sweets");
    expect(res.body.sweets).toHaveLength(2);
    expect(res.body.sweets[0]).toHaveProperty("name", "Gulab Jamun");
    expect(Sweet.find).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/api/sweets");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer invalidToken`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should return 500 if Server fails", async () => {
    jwt.verify.mockReturnValue(userPayload);
    Sweet.find.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });

  it("should return empty array if no sweets exist", async () => {
    jwt.verify.mockReturnValue(userPayload);
    Sweet.find.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets).toEqual([]);
  });
});
