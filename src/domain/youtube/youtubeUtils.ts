import { IdParsingError } from "../../types/errors";

export const getYoutubeId = (urlString: string) => {
  const url = new URL(urlString);
  const id = url.searchParams.get("v");
  if (id) {
    return id;
  } else {
    throw new IdParsingError("Video ID not found");
  }
};
