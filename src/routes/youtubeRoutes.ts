import express from "express";
import { youtubeService } from "../domain/youtube/YoutubeService";
import { IdParsingError, ValidationError } from "../types/errors";

const youtubeRouter = express.Router();

youtubeRouter.get("/download", async (req, res) => {
  try {
    await youtubeService.downloadVideo(req.query);
    res.status(200).send();
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
