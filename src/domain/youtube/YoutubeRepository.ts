import { exec } from "child_process";

export class YoutubeRepository {
  public async getVideoInfo(id: string) {
    const command = `yt-dlp -F '${id}'`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      console.log(`stdout: ${stdout}`);
    });
  }
}
