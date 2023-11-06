import express, { Express } from "express";
import { apiRouter } from "./api/api";
import { PORT } from "./config/config";

const app: Express = express();
app.use("/api", apiRouter);
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
