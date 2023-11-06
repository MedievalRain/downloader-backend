import express from "express";
import { youtubeService } from "../domain/youtube/YoutubeService";
import { IdParsingError, ValidationError } from "../types/errors";
import { createReadStream, promises as fsPromises } from "fs";

const youtubeRouter = express.Router();

youtubeRouter.get("/download", async (req, res) => {
  try {
    const { filepath, filename, extension } = await youtubeService.downloadVideo(req.query);
    const stats = await fsPromises.stat(filepath);
    res.writeHead(200, {
      "Content-Disposition": "attachment; filename=" + encodeURIComponent(`${filename}.${extension}`),
      "Content-Type": `video/${extension}`,
      "Content-Length": stats.size,
    });
    const readStream = createReadStream(filepath);
    readStream.pipe(res);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof IdParsingError) {
      res.status(400).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
youtubeRouter.get("/info", async (req, res) => {
  try {
    const videoInfo = await youtubeService.getVideoInfo(req.query);
    res.status(200).json(videoInfo);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof IdParsingError) {
      res.status(400).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export { youtubeRouter };
