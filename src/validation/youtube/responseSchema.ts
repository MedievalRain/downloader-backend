import z from "zod";

const audioStreamSchema = z.object({
  id: z.string(),
  size: z.number(),
  bitrate: z.number(),
});

const videoStreamSchema = z.object({
  id: z.string(),
  size: z.number(),
  bitrate: z.number(),
  resolution: z.object({ height: z.number(), width: z.number() }),
});

export const getVideoInfoResponseSchema = z.object({
  id: z.string(),
  audio: z.array(audioStreamSchema),
  video: z.array(videoStreamSchema),
});
