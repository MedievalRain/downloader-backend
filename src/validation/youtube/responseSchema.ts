import z from "zod";

const audioStreamSchema = z.object({
  id: z.string(),
  size: z.number(),
  bitrate: z.number(),
  extension: z.string(),
});

const videoStreamSchema = z.object({
  id: z.string(),
  size: z.number(),
  bitrate: z.number(),
  extension: z.string(),
  resolution: z.object({ height: z.number(), width: z.number() }),
});

export const getVideoInfoResponseSchema = z.object({
  id: z.string(),
  audio: z.array(audioStreamSchema),
  video: z.array(videoStreamSchema),
});

export const getVideoUrlSchema = z.object({ filename: z.string() });
