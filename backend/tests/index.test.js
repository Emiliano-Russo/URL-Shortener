const request = require("supertest");
const app = require("../index");

describe("/POST shorten", () => {
  test("should return 400 if URL is not provided", async () => {
    const response = await request(app).post("/shorten").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("URL is required");
  });

  test("should return 400 for an invalid URL", async () => {
    const response = await request(app).post("/shorten").send({ url: "invalidurl" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid URL");
  });

  test("should create a shortened URL for a valid URL", async () => {
    const response = await request(app).post("/shorten").send({ url: "http://example.com" });
    expect(response.status).toBe(200);
    expect(response.body.shortUrl).toContain(process.env.BASE_URL);
  });
});

describe("GET /:id", () => {
  test("should redirect to the original URL if valid ID is provided", async () => {
    const postResponse = await request(app).post("/shorten").send({ url: "http://example.com" });
    const shortId = postResponse.body.shortUrl.split("/").pop();
    const getResponse = await request(app).get(`/${shortId}`);
    expect(getResponse.status).toBe(302); // 302 is the status code for redirection
    expect(getResponse.headers.location).toBe("http://example.com/");
  });

  test("should return 404 if ID does not exist", async () => {
    const response = await request(app).get("/nonexistentid");
    expect(response.status).toBe(404);
  });
});
