import { exec } from "child_process";
import { randomUUID } from "crypto";
import { deleteFile, readJsonFile } from "../../utils/files";
import { VideoInfoResponse } from "./types";
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
