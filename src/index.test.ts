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
  it("should respond with 200 status and video info when using url with www", async () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const response = await request(app).get(baseUrl).query({ url });
    expect(response.statusCode).toBe(200);
    const parseResult = getVideoInfoResponseSchema.safeParse(response.body);
    expect(parseResult.success).toBe(true);
  });
  it("should respond with 200 status and video info when using url without www", async () => {
    const url = "https://www.youtube.com/watch?v=Yh2eH4fXgbU";
    const response = await request(app).get(baseUrl).query({ url });
    expect(response.statusCode).toBe(200);
    const parseResult = getVideoInfoResponseSchema.safeParse(response.body);
    expect(parseResult.success).toBe(true);
  });
});

describe("/api/youtube/url", () => {
  const url = "/api/youtube/url";
  it("should respond with 200 status for valid arguments", async () => {
    const downloadData: DownloadData = {
      extension: "mp4",
      id: "Yh2eH4fXgbU",
      audioStream: 600,
      videoStream: 597,
    };
    const response = await request(app).get(url).query(downloadData);
    expect(response.statusCode).toBe(200);
    const parseResult = getVideoUrlSchema.safeParse(response.body);
    expect(parseResult.success).toBe(true);
  }, 60000);
});
