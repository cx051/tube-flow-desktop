
interface YouTubeApiOptions {
  apiKey: string | null;
  type?: string;
  query?: string;
  maxResults?: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  publishedAt: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  itemCount: string;
}

export const fetchYouTubeData = async (options: YouTubeApiOptions): Promise<any> => {
  const { apiKey, type = "trending", query = "", maxResults = 20 } = options;
  
  if (!apiKey) {
    throw new Error("YouTube API key is required. Please add your API key in Settings.");
  }
  
  let apiUrl = "";
  let params = new URLSearchParams({
    key: apiKey,
    part: "snippet,statistics",
    maxResults: maxResults.toString(),
    regionCode: "US",
  });

  try {
    // Determine the endpoint based on the type
    switch (type) {
      case "trending":
        apiUrl = "https://www.googleapis.com/youtube/v3/videos";
        params.append("chart", "mostPopular");
        break;
        
      case "search":
        if (!query) {
          throw new Error("Search query is required");
        }
        apiUrl = "https://www.googleapis.com/youtube/v3/search";
        params.append("q", query);
        params.append("part", "snippet");
        params.delete("statistics"); // Search doesn't support statistics
        break;
        
      case "video":
        if (!query) {
          throw new Error("Search query is required");
        }
        apiUrl = "https://www.googleapis.com/youtube/v3/search";
        params.append("q", query);
        params.append("type", "video");
        params.append("part", "snippet");
        params.delete("statistics");
        break;
        
      case "channel":
        if (!query) {
          throw new Error("Search query is required");
        }
        apiUrl = "https://www.googleapis.com/youtube/v3/search";
        params.append("q", query);
        params.append("type", "channel");
        params.append("part", "snippet");
        params.delete("statistics");
        break;
        
      case "playlist":
        if (!query) {
          throw new Error("Search query is required");
        }
        apiUrl = "https://www.googleapis.com/youtube/v3/search";
        params.append("q", query);
        params.append("type", "playlist");
        params.append("part", "snippet");
        params.delete("statistics");
        break;
        
      default:
        throw new Error(`Unsupported search type: ${type}`);
    }

    const response = await fetch(`${apiUrl}?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch YouTube data");
    }
    
    const data = await response.json();
    
    // Process the response based on type
    switch (type) {
      case "trending":
        return processVideoResponse(data);
        
      case "search":
      case "video":
        if (data.items?.length) {
          // For search results, we need to get video IDs and fetch additional data
          const videoIds = data.items
            .filter((item: any) => item.id?.videoId)
            .map((item: any) => item.id.videoId)
            .join(",");
            
          if (videoIds) {
            return fetchVideoDetailsByIds(videoIds, apiKey);
          }
        }
        return [];
        
      case "channel":
        return processChannelResponse(data);
        
      case "playlist":
        return processPlaylistResponse(data);
        
      default:
        return [];
    }
  } catch (error) {
    console.error("YouTube API Error:", error);
    throw error;
  }
};

// Helper to fetch additional video details using video IDs
const fetchVideoDetailsByIds = async (
  videoIds: string,
  apiKey: string
): Promise<YouTubeVideo[]> => {
  const params = new URLSearchParams({
    key: apiKey,
    part: "snippet,statistics",
    id: videoIds,
  });
  
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to fetch video details");
  }
  
  const data = await response.json();
  return processVideoResponse(data);
};

// Process video response data
const processVideoResponse = (data: any): YouTubeVideo[] => {
  if (!data.items?.length) {
    return [];
  }
  
  return data.items.map((item: any) => ({
    id: item.id?.videoId || item.id,
    title: item.snippet?.title || "Untitled Video",
    description: item.snippet?.description || "",
    thumbnail: 
      item.snippet?.thumbnails?.maxres?.url ||
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      "",
    channelTitle: item.snippet?.channelTitle || "Unknown Channel",
    viewCount: item.statistics?.viewCount || "0",
    publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
  }));
};

// Process channel response data
const processChannelResponse = (data: any): YouTubeChannel[] => {
  if (!data.items?.length) {
    return [];
  }
  
  return data.items.map((item: any) => ({
    id: item.id?.channelId,
    title: item.snippet?.title || "Unnamed Channel",
    description: item.snippet?.description || "",
    thumbnail: 
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      "",
    subscriberCount: "N/A", // Search API doesn't provide subscriber count
    videoCount: "N/A",      // Search API doesn't provide video count
  }));
};

// Process playlist response data
const processPlaylistResponse = (data: any): YouTubePlaylist[] => {
  if (!data.items?.length) {
    return [];
  }
  
  return data.items.map((item: any) => ({
    id: item.id?.playlistId,
    title: item.snippet?.title || "Untitled Playlist",
    description: item.snippet?.description || "",
    thumbnail: 
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      "",
    channelTitle: item.snippet?.channelTitle || "Unknown Channel",
    itemCount: "N/A", // Search API doesn't provide item count
  }));
};
