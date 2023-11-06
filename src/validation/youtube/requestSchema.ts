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
const streamSchema = z.union([z.string(), z.null()]);
const downloadVideoSchema = z.object({
  id: z.string(),
  audioStream: streamSchema,
  videoStream: streamSchema,
  extension: z.union([z.literal("mp4"), z.literal("webm")]),
});

export const parseDownloadVideoRequest = (data: any): DownloadData => {
  try {
    const parsed = downloadVideoSchema.parse(data);
    const audioStream = parsed.audioStream ? parseInt(parsed.audioStream) : null;
    const videoStream = parsed.videoStream ? parseInt(parsed.videoStream) : null;
    return { ...parsed, audioStream, videoStream };
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
