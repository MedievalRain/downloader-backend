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

const validIdSchema = z.string().refine(
  (data) => {
    const regex = /^[A-Za-z0-9-]+$/;
    return regex.test(data);
  },
  {
    message: "Bad Id",
  },
);

export const getVideoInfoSchema = z.object({
  url: z.string().refine(isYoutubeUrl),
});
const streamSchema = z.string().optional();
const downloadVideoSchema = z.object({
  id: validIdSchema,
  audio: streamSchema,
  video: streamSchema,
  title: z.string(),
});

const downloadFileSchema = z.object({
  videoname: z.string(),
});

export const parseDownloadVideoRequest = (data: any): DownloadData => {
  try {
    const parsed = downloadVideoSchema.parse(data);
    const audio = parsed.audio ? parseInt(parsed.audio) : null;
    const video = parsed.video ? parseInt(parsed.video) : null;
    return { ...parsed, audio, video };
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

export const parseDownloadFileRequest = (data: any) => {
  try {
    return downloadFileSchema.parse(data);
  } catch (error) {
    throw new ValidationError("Bad input");
  }
};
