import express from "express";
import { youtubeService } from "../domain/youtube/YoutubeService";
import { FileNotExistsError, IdParsingError, ValidationError, VideoNotFoundError } from "../types/errors";
import { createReadStream } from "fs";
import { deleteFile } from "../utils/files";
import { randomUUID } from "crypto";

const youtubeRouter = express.Router();

youtubeRouter.get("/info", async (req, res) => {
  try {
    const videoInfo = await youtubeService.getVideoInfo(req.query);
    res.status(200).json(videoInfo);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof IdParsingError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof VideoNotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

youtubeRouter.get("/download/", async (req, res) => {
  const filepath = `files/video/${randomUUID()}.mp4`;
  res.on("finish", () => {
    deleteFile(filepath).catch((error) => {
      console.error("Error deleting file after sending:", error);
    });
  });
  try {
    const { stats, title } = await youtubeService.downloadVideo(req.query, filepath);
    res.writeHead(200, {
      "Content-Disposition": "attachment; filename=" + encodeURIComponent(`${title}.mp4`),
      "Content-Type": `video/mp4`,
      "Content-Length": stats.size,
    });
    const readStream = createReadStream(filepath);
    readStream.pipe(res);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof IdParsingError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof FileNotExistsError) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export { youtubeRouter };
