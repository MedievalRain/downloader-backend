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

  public async downloadVideo(data: any) {
    const downoadData = parseDownloadVideoRequest(data);
    const filepath = await this.youtubeRepository.downloadVideo(downoadData);
    return { filepath, filename: downoadData.name, extension: downoadData.extension };
  }
}

export const youtubeService = new YoutubeService(new YoutubeRepository());
