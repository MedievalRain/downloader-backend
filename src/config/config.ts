import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT!;

if (!PORT) {
  throw new Error("Missing environment variables. Check your .env file.");
}
