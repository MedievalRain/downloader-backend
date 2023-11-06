import { getVideoFileInfo } from "../../utils/files";
import {
  parseDownloadFileRequest,
  parseDownloadVideoRequest,
  parseGetVideoInfoRequest,
} from "../../validation/youtube/requestSchema";
import { YoutubeRepository } from "./YoutubeRepository";
import { getYoutubeId } from "./youtubeUtils";

class YoutubeService {
  constructor(private youtubeRepository: YoutubeRepository) {}

  public async getVideoInfo(data: any) {
    const { url } = parseGetVideoInfoRequest(data);
    const id = getYoutubeId(url);
    return this.youtubeRepository.getVideoInfo(id);
  }

  public async downloadVideo(data: any) {
    const downloadData = parseDownloadVideoRequest(data);
    const filename = await this.youtubeRepository.downloadVideo(downloadData);
    return filename;
  }

  public async getFileInfo(data: any, filename: string) {
    const { videoname } = parseDownloadFileRequest(data);
    const { extension, filepath, stats } = await getVideoFileInfo(filename);
    return { filepath, stats, extension, videoname };
  }
}

export const youtubeService = new YoutubeService(new YoutubeRepository());
