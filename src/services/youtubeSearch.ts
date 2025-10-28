import ytSearch from "yt-search";

interface VideoInfo {
  title: string;
  videoId: string;
  url: string;
  description: string;
  views: number;
  ago: string;
  timestamp: string;
  duration: { seconds: number; timestamp: string };
  author: {
    name: string;
    url: string;
  };
  image: string;
  thumbnail: string;
  type: string;
}

export async function searchVideo(query: string): Promise<VideoInfo | null> {
  const result = await ytSearch(query);
  const videos = result.videos;

  if (!videos || videos.length === 0) return null;

  return videos[0]
}
