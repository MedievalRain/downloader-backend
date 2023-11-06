import z from "zod";
import { ValidationError } from "../../types/errors";

const getVideoInfoSchema = z.object({
  url: z.string().min(8).max(256).startsWith("https://youtu"),
});

export const parseVideoInfoSchema = (data: any) => {
  try {
    return getVideoInfoSchema.parse(data);
  } catch (error) {
    throw new ValidationError("Bad input");
  }
};
