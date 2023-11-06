import z from "zod";
import { ValidationError } from "../../types/errors";
import { DownloadData } from "../../domain/youtube/types";

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

export const getVideoInfoSchema = z.object({
  url: z.string().refine(isYoutubeUrl),
});

const downloadVideoSchema = z.object({
  id: z.string(),
  streams: z.object({
    audio: z.union([z.number(), z.null()]),
    video: z.union([z.number(), z.null()]),
  }),
  extension: z.union([z.literal("mp4"), z.literal("webm")]),
});

export const parseDownloadVideoRequest = (data: any): DownloadData => {
  try {
    return downloadVideoSchema.parse(data);
  } catch (error) {
    throw new ValidationError("Bad input");
  }
};

export const parseGetVideoInfoRequest = (data: any) => {
  try {
    return getVideoInfoSchema.parse(data);
  } catch (error) {
    throw new ValidationError("Bad input");
  }
};
