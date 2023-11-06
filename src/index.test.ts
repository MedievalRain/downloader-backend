import request from "supertest";
import express from "express";
import { apiRouter } from "./api/api";

const app = express();
app.use("/api", apiRouter);

describe("/api/youtube/info", () => {
  const baseUrl = "/api/youtube/info";
  it("should respond with 400 status when no query params", async () => {
    const response = await request(app).get(baseUrl);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: "Bad input",
      }),
    );
  });

  it("should respond with 400 status when not youtube url", async () => {
    const url = "https://google.com";
    const response = await request(app).get(baseUrl).query({ url });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: "Bad input",
      }),
    );
  });
  it("should respond with 400 status when no id in url found", async () => {
    const url = "https://youtube.com?b=xcq";
    const response = await request(app).get(baseUrl).query({ url });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: "Video ID not found",
      }),
    );
  });
  it("should respond with 200 status when found id", async () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const response = await request(app).get(baseUrl).query({ url });
    expect(response.statusCode).toBe(200);
  });
});
