
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SearchBar } from "@/components/SearchBar";
import { VideoCard } from "@/components/VideoCard";
import { VideoModal } from "@/components/VideoModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fetchYouTubeData, YouTubeVideo } from "@/utils/youtubeApi";
import { Flame, YoutubeIcon, Search } from "lucide-react";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [apiKey] = useLocalStorage<string | null>("youtube-api-key", null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get the type from URL params or default to 'trending'
  const type = searchParams.get("type") || "trending";
  const query = searchParams.get("q") || "";

  // Set active tab based on URL params
  const [activeTab, setActiveTab] = useState(type);

  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  // Fetch YouTube data
  const { data: videos, isLoading, isError, error } = useQuery({
    queryKey: ["youtubeData", type, query, apiKey],
    queryFn: () => fetchYouTubeData({ apiKey, type, query }),
    enabled: !!apiKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle search
  const handleSearch = (searchQuery: string, searchType: string) => {
    setSearchParams({ type: "search", q: searchQuery });
  };

  // Handle API key error
  useEffect(() => {
    if (isError && apiKey === null) {
      toast({
        title: "API Key Required",
        description: "Please add your YouTube API key in Settings to use this app.",
        variant: "destructive",
      });
    } else if (isError && error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [isError, apiKey, error, toast]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ type: value });
  };

  // Handle video selection
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedVideoId(null);
  };

  return (
    <div className="w-full animate-fade-in">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="trending" className="px-4">
              <Flame className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="search" className="px-4">
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trending" className="mt-0">
          <h1 className="text-3xl font-bold mb-6">Trending Videos</h1>
          
          {!apiKey && (
            <div className="glass p-8 rounded-lg text-center mb-6">
              <YoutubeIcon className="h-12 w-12 mx-auto mb-4 text-youtube-red" />
              <h2 className="text-xl font-semibold mb-2">YouTube API Key Required</h2>
              <p className="text-muted-foreground mb-4">
                Please add your YouTube API key in the Settings page to start browsing videos.
              </p>
              <a 
                href="/settings" 
                className="text-primary hover:underline font-medium"
              >
                Go to Settings
              </a>
            </div>
          )}
          
          {apiKey && isLoading && (
            <div className="glass p-8 rounded-lg flex items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Loading trending videos...</p>
              </div>
            </div>
          )}
          
          {apiKey && !isLoading && videos && videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video: YouTubeVideo, index: number) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  channelTitle={video.channelTitle}
                  viewCount={video.viewCount}
                  publishedAt={video.publishedAt}
                  onClick={() => handleVideoSelect(video.id)}
                  index={index}
                />
              ))}
            </div>
          )}
          
          {apiKey && !isLoading && (!videos || videos.length === 0) && (
            <div className="glass p-8 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-2">No Videos Found</h2>
              <p className="text-muted-foreground">
                Try checking your API key or internet connection.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="search" className="mt-0">
          <h1 className="text-3xl font-bold mb-6">Search Videos</h1>
          
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
          
          {query ? (
            <>
              {isLoading && (
                <div className="glass p-8 rounded-lg flex items-center justify-center min-h-[300px]">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Searching for "{query}"...</p>
                  </div>
                </div>
              )}
              
              {!isLoading && videos && videos.length > 0 && (
                <>
                  <h2 className="text-xl font-medium mb-4">
                    Search results for "{query}"
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video: YouTubeVideo, index: number) => (
                      <VideoCard
                        key={video.id}
                        id={video.id}
                        title={video.title}
                        thumbnail={video.thumbnail}
                        channelTitle={video.channelTitle}
                        viewCount={video.viewCount}
                        publishedAt={video.publishedAt}
                        onClick={() => handleVideoSelect(video.id)}
                        index={index}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {!isLoading && (!videos || videos.length === 0) && (
                <div className="glass p-8 rounded-lg text-center">
                  <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
                  <p className="text-muted-foreground">
                    Try a different search term or check your API key.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="glass p-8 rounded-lg text-center">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Search for Videos</h2>
              <p className="text-muted-foreground">
                Enter a search term to find videos, channels, or playlists.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Player Modal */}
      {selectedVideoId && (
        <VideoModal
          videoId={selectedVideoId}
          isOpen={!!selectedVideoId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Index;
