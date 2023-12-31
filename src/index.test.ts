import request from "supertest";
import express from "express";
import { apiRouter } from "./api/api";
import { getVideoInfoResponseSchema, getVideoUrlSchema } from "./validation/youtube/responseSchema";
import { DownloadData } from "./domain/youtube/types";

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
  }, 1000);

  it("should respond with 400 status when not youtube url", async () => {
    const url = "https://google.com";
    const response = await request(app).get(baseUrl).query({ url });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: "Bad input",
      }),
    );
  }, 1000);
  it("should respond with 400 status when no id in url found", async () => {
    const url = "https://youtube.com?b=xcq";
    const response = await request(app).get(baseUrl).query({ url });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: "Video ID not found",
      }),
    );
  }, 1000);
  it("should respond with 200 status and video info when using url with www", async () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const response = await request(app).get(baseUrl).query({ url });
    expect(response.statusCode).toBe(200);
    const parseResult = getVideoInfoResponseSchema.safeParse(response.body);
    expect(parseResult.success).toBe(true);
  }, 20000);
  it("should respond with 200 status and video info when using url without www", async () => {
    const url = "https://www.youtube.com/watch?v=Yh2eH4fXgbU";
    const response = await request(app).get(baseUrl).query({ url });
    expect(response.statusCode).toBe(200);
    const parseResult = getVideoInfoResponseSchema.safeParse(response.body);
    expect(parseResult.success).toBe(true);
  }, 20000);
});

describe("Download file", () => {
  const downloadData: DownloadData = {
    id: "F7hHnrlEfpY",
    audio: 599,
    video: null,
    title: "Test Title",
  };
  it("should get filename", async () => {
    const response = await request(app).get("/api/youtube/url").query(downloadData);
    expect(response.statusCode).toBe(200);
    const parseResult = getVideoUrlSchema.safeParse(response.body);
    expect(parseResult.success).toBe(true);
  }, 60000);
  it("should get file", async () => {
    const videoname = "You Probably Shouldn't Use React.memo()";
    const response = await request(app)
      .get(`/api/youtube/download/${downloadData.id}_${downloadData.video}_${downloadData.audio}.mp4`)
      .query({ videoname });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(expect.stringContaining(`video/mp4`));
    expect(response.headers["content-disposition"]).toEqual(expect.stringContaining("attachment; filename="));
    expect(response.headers["content-length"]).toBeDefined();
    const expectedFilename = encodeURIComponent(videoname + `.mp4`);
    expect(response.headers["content-disposition"]).toEqual(expect.stringContaining(expectedFilename));
    const contentLength = parseInt(response.headers["content-length"], 10);
    expect(contentLength).toBeGreaterThan(0);
    expect(response.body).not.toBeNull();
    expect(Buffer.isBuffer(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  }, 10000);
});
