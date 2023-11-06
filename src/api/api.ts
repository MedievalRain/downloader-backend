import express from "express";
import { youtubeRouter } from "../routes/youtubeRoutes";
const apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: true }));

apiRouter.use("/youtube", youtubeRouter);

export { apiRouter };
