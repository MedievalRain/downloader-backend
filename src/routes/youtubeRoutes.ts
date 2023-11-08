import express from "express";
import { youtubeService } from "../domain/youtube/YoutubeService";
import { FileNotExistsError, IdParsingError, ValidationError } from "../types/errors";
import { createReadStream } from "fs";
import { deleteFile } from "../utils/files";

const youtubeRouter = express.Router();

youtubeRouter.get("/url", async (req, res) => {
  try {
    const filename = await youtubeService.downloadVideo(req.query);
    res.status(200).send({ filename });
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

youtubeRouter.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
    const { filepath, stats, videoname } = await youtubeService.getFileInfo(req.query, filename);
    res.writeHead(200, {
      "Content-Disposition": "attachment; filename=" + encodeURIComponent(`${videoname}.mp4`),
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
  res.on("finish", () => {
    deleteFile(`files/video/${filename}`).catch((error) => {
      console.error("Error deleting file after sending:", error);
    });
  });
});

export { youtubeRouter };
