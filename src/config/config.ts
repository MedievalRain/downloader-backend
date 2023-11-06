import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT!;
export const CORS_URL = process.env.CORS_URL!;

if (!(PORT && CORS_URL)) {
  throw new Error("Missing environment variables. Check your .env file.");
}
