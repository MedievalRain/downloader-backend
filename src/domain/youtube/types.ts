export interface Stream {
  id: string;
  size: number;
  extension: string;
  bitrate: number;
  resolution: string;
}

export interface VideoInfo {
  id: string;
  audio: Stream[];
  video: Stream[];
}

export interface StreamFormat {
  format_id: string;
  format_note: string;
  resolution: string;
  fps: number | null;
  ext: string;
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

export type FileExtension = "mp4" | "webm";

export interface DownloadData {
  id: string;
  audioStream: number | null;
  videoStream: number | null;

  extension: FileExtension;
}
