
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Eye, User2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  publishedAt: string;
  onClick: () => void;
  index: number;
}

export function VideoCard({
  id,
  title,
  thumbnail,
  channelTitle,
  viewCount,
  publishedAt,
  onClick,
  index,
}: VideoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Format numbers with commas
  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString();
  };

  // Format the relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div 
      className={cn(
        "video-card rounded-xl overflow-hidden border border-border/50 bg-card transition-all duration-500 animate-slide-up",
        !isLoaded && "animate-pulse"
      )}
      style={{ 
        animationDelay: `${index * 100}ms`,
        opacity: isLoaded ? 1 : 0.7,
      }}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-background/50 overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={thumbnail}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            !isLoaded && "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
          <Clock className="w-3 h-3 inline mr-1" />
          {formatRelativeTime(publishedAt)}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium line-clamp-2 mb-2 text-sm md:text-base" title={title}>
          {title}
        </h3>
        
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <User2 className="w-3 h-3 mr-1" />
          <span className="truncate mr-3" title={channelTitle}>{channelTitle}</span>
          
          <Eye className="w-3 h-3 mr-1" />
          <span>{formatNumber(viewCount)} views</span>
        </div>
      </div>
    </div>
  );
}
