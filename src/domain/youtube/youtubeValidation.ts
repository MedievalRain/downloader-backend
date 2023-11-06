import z from "zod";
import { ValidationError } from "../../types/errors";

const isYoutubeUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === "https:";
    const isYoutubeDomain = ["youtube.com", "youtu.be"].includes(parsedUrl.hostname.replace("www.", ""));
    return isHttps && isYoutubeDomain;
  } catch (error) {
    return false;
  }
};

const getVideoInfoSchema = z.object({
  url: z.string().refine(isYoutubeUrl),
});

export const parseVideoInfoSchema = (data: any) => {
  try {
    return getVideoInfoSchema.parse(data);
  } catch (error) {
    throw new ValidationError("Bad input");
  }
};
