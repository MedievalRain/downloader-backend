import z from "zod";

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
