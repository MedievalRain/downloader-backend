import express from "express";
import { youtubeRouter } from "../routes/youtubeRoutes";
import { corsMiddleware } from "../middleware/cors";
const apiRouter = express.Router();

apiRouter.use(corsMiddleware);
apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: true }));

apiRouter.use("/youtube", youtubeRouter);

export { apiRouter };
