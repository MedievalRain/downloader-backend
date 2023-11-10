import { exec } from "child_process";
import { randomUUID } from "crypto";
import { deleteFile, readJsonFile } from "../../utils/files";
import { DownloadData, VideoInfoResponse } from "./types";
import { parseVideoInfo } from "./youtubeUtils";
import { VideoNotFoundError } from "../../types/errors";

export class YoutubeRepository {
  private cli = "yt-dlp";
  public async getVideoInfo(id: string) {
    const fileId = randomUUID();
    const filepath = `files/json/${fileId}.json`;
    const command = `${this.cli}  -j ${id} > ${filepath}`;
    await this.executeCommand(command);
    const data = (await readJsonFile(filepath)) as VideoInfoResponse;
    await deleteFile(filepath);
    const videoInfo = parseVideoInfo(data);
    return videoInfo;
  }

  public async downloadVideo(downoadData: DownloadData, filepath: string) {
    const { video, audio, id } = downoadData;
    const channels = this.formatChannels(video, audio);
    const command = `${this.cli} -f ${channels} --merge-output-format mp4 ${id} -o ${filepath}`;
    await this.executeCommand(command);
    return filepath;
  }

  private async executeCommand(command: string) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          if (stderr.includes("is not a valid URL. Set --default-search")) {
            return reject(new VideoNotFoundError("Video not found"));
          }
        }
        if (stderr) {
          if (!stderr.includes("WARNING: [youtube] Failed to download m3u8 information: HTTP Error 429: Too Many Requests")) {
            console.error("stderr: ", stderr);
          }
        }

        resolve(stdout);
      });
    });
  }

  private formatChannels(videoStream: number | null, audioStream: number | null): string {
    if (videoStream && audioStream) return `${videoStream}+${audioStream}`;
    if (videoStream) return videoStream.toString();
    if (audioStream) return audioStream.toString();
    return "";
  }
}
