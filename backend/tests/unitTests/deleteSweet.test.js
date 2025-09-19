// tests/unitTests/deleteSweet.test.js
const request = require("supertest");
const app = require("../../app.js");
const Sweet = require("../../models/sweetModel.js");
const jwt = require("jsonwebtoken");

// Mock Sweet model & JWT
jest.mock("../../models/sweetModel.js", () => ({
  findByIdAndDelete: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("DELETE /api/sweets/:id - Delete Sweet (Admin only)", () => {
  afterEach(() => jest.clearAllMocks());

  const token = "validToken123";

  it("should delete sweet successfully for admin", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });
    Sweet.findByIdAndDelete.mockResolvedValue({
      _id: "s1",
      name: "Gulab Jamun",
    });

    const res = await request(app)
      .delete("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Sweet deleted successfully");
    expect(Sweet.findByIdAndDelete).toHaveBeenCalledWith("s1");
  });

  it("should return 403 if non-admin tries to delete", async () => {
    jwt.verify.mockReturnValue({ id: "u2", role: "user" });

    const res = await request(app)
      .delete("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden: Admin only");
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app).delete("/api/sweets/s1");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app)
      .delete("/api/sweets/s1")
      .set("Authorization", "Bearer invalidToken");

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });

  it("should return 404 if sweet not found", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });
    Sweet.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });

  it("should return 500 if DB fails", async () => {
    jwt.verify.mockReturnValue({ id: "u1", role: "admin" });
    Sweet.findByIdAndDelete.mockRejectedValue(new Error("DB down"));

    const res = await request(app)
      .delete("/api/sweets/s1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
