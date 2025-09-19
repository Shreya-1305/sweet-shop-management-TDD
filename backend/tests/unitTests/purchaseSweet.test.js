const request = require("supertest");
const app = require("../../app.js");
const Sweet = require("../../models/sweetModel.js");
const jwt = require("jsonwebtoken");

// Mock Sweet model & JWT
jest.mock("../../models/sweetModel.js", () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("POST /api/sweets/:id/purchase - Purchase Sweet", () => {
  afterEach(() => jest.clearAllMocks());

  const token = "validToken123";
  const userPayload = { id: "u1", role: "user" };

  const sweetData = {
    _id: "s1",
    name: "Gulab Jamun",
    category: "Milk-based",
    price: 120,
    quantity: 50,
  };

  it("should purchase a sweet successfully and reduce quantity", async () => {
    jwt.verify.mockReturnValue(userPayload);

    Sweet.findById.mockResolvedValue({ ...sweetData });

    Sweet.findByIdAndUpdate.mockResolvedValue({
      ...sweetData,
      quantity: sweetData.quantity - 5,
    });

    const res = await request(app)
      .post("/api/sweets/s1/purchase")
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet).toHaveProperty("quantity", 45);
    expect(Sweet.findByIdAndUpdate).toHaveBeenCalledWith(
      "s1",
      { quantity: 45 },
      { new: true }
    );
  });

  it("should return 400 if purchase quantity exceeds stock", async () => {
    jwt.verify.mockReturnValue(userPayload);
    Sweet.findById.mockResolvedValue({ ...sweetData });

    const res = await request(app)
      .post("/api/sweets/s1/purchase")
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 1000 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Insufficient stock");
  });

  it("should return 404 if sweet not found", async () => {
    jwt.verify.mockReturnValue(userPayload);
    Sweet.findById.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/sweets/s1/purchase")
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });

  it("should return 400 if quantity is not a number", async () => {
    jwt.verify.mockReturnValue(userPayload);

    const res = await request(app)
      .post("/api/sweets/s1/purchase")
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: "five" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app)
      .post("/api/sweets/s1/purchase")
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .post("/api/sweets/s1/purchase")
      .set("Authorization", "Bearer invalidToken")
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should return 400 if quantity is negative or zero", async () => {
    jwt.verify.mockReturnValue(userPayload);

    const testCases = [{ quantity: -5 }, { quantity: 0 }];

    for (const payload of testCases) {
      const res = await request(app)
        .post("/api/sweets/s1/purchase")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    }
  });

  it("should return 500 if DB fails during purchase", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "user" });

    Sweet.findById.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .post("/api/sweets/s1/purchase")
      .set("Authorization", `Bearer validToken123`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
