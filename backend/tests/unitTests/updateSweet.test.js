const request = require("supertest");
const app = require("../../app.js");
const Sweet = require("../../models/sweetModel.js");
const jwt = require("jsonwebtoken");

// Mock Sweet model & JWT
jest.mock("../../models/sweetModel.js", () => ({
  findByIdAndUpdate: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("PUT /api/sweets/:id - Update Sweet (Admin only)", () => {
  afterEach(() => jest.clearAllMocks());

  const token = "validToken123";
  const adminPayload = { id: "u1", role: "admin" };
  const userPayload = { id: "u2", role: "user" };

  it("should update sweet successfully for admin", async () => {
    jwt.verify.mockReturnValue(adminPayload);
    Sweet.findByIdAndUpdate.mockResolvedValue({
      _id: "s1",
      name: "Updated Sweet",
      category: "Fried",
      price: 60,
      quantity: 120,
    });

    const res = await request(app)
      .put("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Sweet", price: 60 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet).toHaveProperty("name", "Updated Sweet");
  });

  it("should return 400 if price or quantity is negative", async () => {
    jwt.verify.mockReturnValue(adminPayload);

    const testCases = [{ price: -10 }, { quantity: -5 }];

    for (const payload of testCases) {
      const res = await request(app)
        .put("/api/sweets/s1")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    }
  });

  it("should return 400 if price or quantity is not a number", async () => {
    jwt.verify.mockReturnValue(adminPayload);

    const testCases = [{ price: "abc" }, { quantity: "ten" }];

    for (const payload of testCases) {
      const res = await request(app)
        .put("/api/sweets/s1")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    }
  });

  it("should return 403 if user is not admin", async () => {
    jwt.verify.mockReturnValue(userPayload);

    const res = await request(app)
      .put("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Sweet" });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden: Access denied");
  });

  it("should return 400 if invalid category is provided", async () => {
    jwt.verify.mockReturnValue(adminPayload);

    const res = await request(app)
      .put("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "InvalidCategory" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid category");
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app)
      .put("/api/sweets/s1")
      .send({ name: "Updated Sweet" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .put("/api/sweets/s1")
      .set("Authorization", "Bearer invalidToken")
      .send({ name: "Updated Sweet" });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should return 404 if sweet not found", async () => {
    jwt.verify.mockReturnValue(adminPayload);
    Sweet.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Sweet" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });

  it("should return 500 if DB fails", async () => {
    jwt.verify.mockReturnValue(adminPayload);
    Sweet.findByIdAndUpdate.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .put("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Sweet" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
