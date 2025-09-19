const request = require("supertest");
const app = require("../../app");
const Sweet = require("../../models/sweetModel");
const jwt = require("jsonwebtoken");

// Mock Sweet model & JWT
jest.mock("../../models/sweetModel.js", () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("POST /api/sweets/:id/restock - Restock Sweet (Admin only)", () => {
  afterEach(() => jest.clearAllMocks());

  const token = "validAdminToken";
  const adminPayload = { id: "a1", role: "admin" };
  const userPayload = { id: "u1", role: "user" };

  const sweetData = {
    _id: "s1",
    name: "Gulab Jamun",
    category: "Milk-based",
    price: 120,
    quantity: 50,
  };

  it("should restock a sweet successfully for admin", async () => {
    jwt.verify.mockReturnValue(adminPayload);
    Sweet.findById.mockResolvedValue({ ...sweetData });
    Sweet.findByIdAndUpdate.mockResolvedValue({
      ...sweetData,
      quantity: sweetData.quantity + 20,
    });

    const res = await request(app)
      .post("/api/sweets/s1/restock")
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 20 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet).toHaveProperty("quantity", 70); // 50 + 20
    expect(Sweet.findByIdAndUpdate).toHaveBeenCalledWith(
      "s1",
      { quantity: 70 },
      { new: true }
    );
  });

  it("should return 403 if non-admin user tries to restock", async () => {
    jwt.verify.mockReturnValue(userPayload);

    const res = await request(app)
      .post("/api/sweets/s1/restock")
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 20 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden: Access denied");
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app)
      .post("/api/sweets/s1/restock")
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .post("/api/sweets/s1/restock")
      .set("Authorization", "Bearer invalidToken")
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should return 500 if DB fails during restock", async () => {
    jwt.verify.mockReturnValue({ id: "a1", role: "admin" });

    // simulate DB failure
    Sweet.findById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .post("/api/sweets/s1/restock")
      .set("Authorization", `Bearer validAdminToken`)
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
