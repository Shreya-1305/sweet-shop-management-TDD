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

  // Create regular user
  const hashedUserPassword = await bcrypt.hash("user123", 10);
  await User.create({
    name: "User",
    email: "user@example.com",
    password: hashedUserPassword,
    role: "user",
  });

  // Login admin to get token
  const adminRes = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "admin123",
  });
  adminToken = adminRes.body.token;

  // Login regular user to get token
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

describe("Sweet Integration Tests", () => {
  it("should add a new sweet (Admin only)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Milk-based",
        price: 120,
        quantity: 50,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.sweet).toHaveProperty("name", "Gulab Jamun");
    expect(res.body.sweet).toHaveProperty("category", "Milk-based");
  });

  it("should NOT allow regular user to add a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Rasgulla",
        category: "Milk-based",
        price: 100,
        quantity: 20,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error");
  });

  it("should get all sweets for any logged-in user", async () => {
    await Sweet.create({
      name: "Kaju Katli",
      category: "Dry Fruits-based",
      price: 300,
      quantity: 20,
    });

    const resAdmin = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(resAdmin.statusCode).toBe(200);
    expect(resAdmin.body.sweets.length).toBe(1);

    const resUser = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);
    expect(resUser.statusCode).toBe(200);
    expect(resUser.body.sweets.length).toBe(1);
  });

  it("should update a sweet (Admin only)", async () => {
    const sweet = await Sweet.create({
      name: "Ladoo",
      category: "Ladoo",
      price: 100,
      quantity: 40,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 150, quantity: 60 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet).toHaveProperty("price", 150);
    expect(res.body.sweet).toHaveProperty("quantity", 60);
  });

  it("should NOT allow regular user to update a sweet", async () => {
    const sweet = await Sweet.create({
      name: "Ladoo",
      category: "Ladoo",
      price: 100,
      quantity: 40,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ price: 150 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error");
  });

  it("should delete a sweet (Admin only)", async () => {
    const sweet = await Sweet.create({
      name: "Jalebi",
      category: "Sugar-based",
      price: 80,
      quantity: 30,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
    const check = await Sweet.findById(sweet._id);
    expect(check).toBeNull();
  });

  it("should NOT allow regular user to delete a sweet", async () => {
    const sweet = await Sweet.create({
      name: "Jalebi",
      category: "Sugar-based",
      price: 80,
      quantity: 30,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error");
  });
});
