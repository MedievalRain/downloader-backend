import { exec } from "child_process";
import { randomUUID } from "crypto";
import { checkFileExists, deleteFile, readJsonFile } from "../../utils/files";
import { DownloadData, VideoInfoResponse } from "./types";
import { parseVideoInfo } from "./youtubeUtils";

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

  public async downloadVideo(downoadData: DownloadData) {
    const { videoStream, audioStream, extension, id } = downoadData;
    const channels = `${videoStream ? videoStream : ""}+${audioStream ? audioStream : ""}`;
    const filename = `${id}_${videoStream}_${audioStream}.${extension}`;
    const filepath = `files/video/${filename}`;
    const exists = await checkFileExists(filepath);
    if (!exists) {
      const command = `${this.cli} -f ${channels} --merge-output-format ${extension} -o ${filepath} ${id}`;
      await this.executeCommand(command);
    }
    return filename;
  }

  private async executeCommand(command: string) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
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
}
