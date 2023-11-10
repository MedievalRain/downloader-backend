import { getFileSize } from "../../utils/files";
import { parseDownloadVideoRequest, parseGetVideoInfoRequest } from "../../validation/youtube/requestSchema";
import { YoutubeRepository } from "./YoutubeRepository";
import { getYoutubeId } from "./youtubeUtils";

class YoutubeService {
  constructor(private youtubeRepository: YoutubeRepository) {}

  public async getVideoInfo(data: any) {
    const { url } = parseGetVideoInfoRequest(data);
    const id = getYoutubeId(url);
    return this.youtubeRepository.getVideoInfo(id);
  }

  public async downloadVideo(data: any, filepath: string) {
    const downloadData = parseDownloadVideoRequest(data);
    await this.youtubeRepository.downloadVideo(downloadData, filepath);
    const stats = await getFileSize(filepath);
    return { stats, title: downloadData.title };
  }
}

export const youtubeService = new YoutubeService(new YoutubeRepository());
