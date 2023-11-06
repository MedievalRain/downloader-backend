import { YoutubeRepository } from "./YoutubeRepository";
import { getYoutubeId } from "./youtubeUtils";
import { parseVideoInfoSchema } from "./youtubeValidation";

class YoutubeService {
  constructor(private youtubeRepository: YoutubeRepository) {}

  public async getVideoInfo(data: any) {
    const { url } = parseVideoInfoSchema(data);
    const id = getYoutubeId(url);
    await this.youtubeRepository.getVideoInfo(id);
  }
}

export const youtubeService = new YoutubeService(new YoutubeRepository());
