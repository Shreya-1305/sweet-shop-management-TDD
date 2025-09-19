jest.setTimeout(60000); // 60 seconds

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const User = require("../../models/userModel");
const Sweet = require("../../models/sweetModel");
const bcrypt = require("bcryptjs");

let mongoServer;
let adminToken;
let userToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashedAdminPassword,
    role: "admin",
  });

  // Create normal user
  const hashedUserPassword = await bcrypt.hash("user123", 10);
  await User.create({
    name: "User",
    email: "user@example.com",
    password: hashedUserPassword,
    role: "user",
  });

  // Login admin
  const adminRes = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "admin123",
  });
  adminToken = adminRes.body.token;

  // Login user
  const userRes = await request(app).post("/api/auth/login").send({
    email: "user@example.com",
    password: "user123",
  });
  userToken = userRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Sweet.deleteMany({});
});

describe("Inventory Integration Tests", () => {
  it("should allow admin to restock a sweet", async () => {
    const sweet = await Sweet.create({
      name: "Gulab Jamun",
      category: "Milk-based",
      price: 120,
      quantity: 50,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 20 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet).toHaveProperty("quantity", 70);
  });

  it("should forbid non-admin from restocking", async () => {
    const sweet = await Sweet.create({
      name: "Kaju Katli",
      category: "Dry Fruits-based",
      price: 300,
      quantity: 20,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Forbidden: Access denied");
  });

  it("should allow user to purchase a sweet", async () => {
    const sweet = await Sweet.create({
      name: "Rasgulla",
      category: "Milk-based",
      price: 150,
      quantity: 30,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet).toHaveProperty("quantity", 25);
  });

  it("should return 400 if purchase quantity exceeds stock", async () => {
    const sweet = await Sweet.create({
      name: "Motichoor Ladoo",
      category: "Ladoo",
      price: 200,
      quantity: 10,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 50 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Insufficient stock");
  });

  it("should return 404 if sweet not found during purchase", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/sweets/${nonExistingId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });
});
