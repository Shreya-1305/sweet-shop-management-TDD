const request = require("supertest");
const app = require("../../app");
const sendError = require("../../utils/sendError");

jest.mock("../../utils/sendError");

describe("Catch-all 404 route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 for GET request on unknown route", async () => {
    const res = await request(app).get("/non-existent-route");

    expect(sendError).toHaveBeenCalledWith(res, 404, "Route not found");
  });

  it("should return 404 for POST request on unknown route", async () => {
    const res = await request(app).post("/another-fake-route");

    expect(sendError).toHaveBeenCalledWith(res, 404, "Route not found");
  });
});
