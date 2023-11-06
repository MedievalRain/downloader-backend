export interface Stream {
  id: string;
  size: number;
  bitrate: number;
}
export interface VideoStream extends Stream {
  resolution: { height: number; width: number };
}

export interface VideoInfo {
  id: string;
  audio: Stream[];
  video: VideoStream[];
}

export interface StreamFormat {
  format_id: string;
  format_note: string;
  resolution: string;
  fps: number | null;
  audio_channels: number | null;
  filesize: number | null;
  asr: number | null;
  height: number | null;
  width: number | null;
  vbr: number | null;
  abr: number | null;
}
export interface VideoInfoResponse {
  id: string;
  title: string;
  formats: StreamFormat[];
}
