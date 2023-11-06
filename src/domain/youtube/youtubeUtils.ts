import { IdParsingError } from "../../types/errors";
import { VideoInfo, VideoInfoResponse } from "./types";

export const getYoutubeId = (urlString: string) => {
  const url = new URL(urlString);
  const id = url.searchParams.get("v");
  if (id) {
    return id;
  } else {
    throw new IdParsingError("Video ID not found");
  }
};

export const parseVideoInfo = (data: VideoInfoResponse): VideoInfo => {
  const videoInfo: VideoInfo = { audio: [], video: [], id: "" };
  videoInfo.id = data.id;
  data.formats.forEach((format) => {
    const { audio_channels, resolution, width, height, filesize, vbr, abr } = format;
    if (audio_channels === null && resolution !== "audio only" && width && height && filesize && vbr) {
      videoInfo.video.push({ id: format.format_id, resolution: { width, height }, size: filesize, bitrate: vbr });
    } else if (audio_channels != null && resolution === "audio only" && filesize && abr) {
      videoInfo.audio.push({ id: format.format_id, size: filesize, bitrate: abr });
    }
  });

  return videoInfo;
};
