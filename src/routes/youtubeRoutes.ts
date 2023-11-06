import express from "express";
import { youtubeService } from "../domain/youtube/YoutubeService";
import { IdParsingError, ValidationError } from "../types/errors";

const youtubeRouter = express.Router();

youtubeRouter.get("/:url", async (req, res) => {
  try {
    await youtubeService.getVideoInfo(req.query);
    res.status(200);
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
