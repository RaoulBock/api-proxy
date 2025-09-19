const request = require("supertest");
const app = require("./server");
const axios = require("axios");

jest.mock("axios");

describe("Proxy Server", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should forward a GET request and return the response", async () => {
    axios.mockResolvedValueOnce({
      status: 200,
      data: { message: "success" },
    });

    const res = await request(app).get("/proxy/test");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "success" });
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining("/test"),
      })
    );
  });

  it("should forward a POST request with body", async () => {
    axios.mockResolvedValueOnce({
      status: 201,
      data: { created: true },
    });

    const res = await request(app)
      .post("/proxy/data")
      .send({ name: "Raoul" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ created: true });
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        data: { name: "Raoul" },
      })
    );
  });

  it("should handle upstream server errors gracefully", async () => {
    axios.mockRejectedValueOnce({
      response: { status: 404, data: "Not Found" },
    });

    const res = await request(app).get("/proxy/missing");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not Found" });
  });

  it("should handle network errors", async () => {
    axios.mockRejectedValueOnce(new Error("Network Error"));

    const res = await request(app).get("/proxy/timeout");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Network Error" });
  });
});